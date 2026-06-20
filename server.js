import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { db } from './server-db.js';
import { extractMetadataFromPdf } from './src/utils/pdfExtractor.js';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_bookstore_key_2026';

app.use(express.json({ limit: '15mb' }));

// Helper for sending formatted API errors
const sendError = (res, status, message) => {
  res.status(status).json({ success: false, error: message });
};

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 401, 'Access denied. Access token required.');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 403, 'Invalid or expired token.');
  }
};

// Admin Authorization Middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 403, 'Forbidden. Admin privileges required.');
  }
  next();
};

// --- AUTH API ---

// User Registration
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return sendError(res, 400, 'Please provide name, email, and password.');
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return sendError(res, 400, 'User with this email already exists.');
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = db.addUser({
    name,
    email: email.toLowerCase(),
    role: 'customer',
    hashedPassword
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    token,
    user
  });
});

// User Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, 'Please provide email and password.');
  }

  const userRaw = db.getUserByEmail(email);
  if (!userRaw) {
    return sendError(res, 400, 'Invalid email or password.');
  }

  const validPassword = bcrypt.compareSync(password, userRaw.hashedPassword);
  if (!validPassword) {
    return sendError(res, 400, 'Invalid email or password.');
  }

  const user = {
    id: userRaw.id,
    name: userRaw.name,
    email: userRaw.email,
    role: userRaw.role
  };

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    user
  });
});

// --- BOOKS API ---

// Get Books (with pagination, search, genre, and publication year filter)
app.get('/api/books', (req, res) => {
  const allBooks = db.getBooks();

  // Search filter
  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : '';
  // Genre filter
  const genre = typeof req.query.genre === 'string' ? req.query.genre : '';
  // Year filter
  const year = typeof req.query.year === 'string' ? req.query.year : '';
  // Featured filter
  const featured = req.query.featured === 'true';

  let filtered = allBooks;

  if (search) {
    filtered = filtered.filter(b => 
      b.title.toLowerCase().includes(search) || 
      b.author.toLowerCase().includes(search) ||
      b.genre.toLowerCase().includes(search) ||
      b.ISBN.toLowerCase().includes(search)
    );
  }

  if (genre) {
    filtered = filtered.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
  }

  if (year) {
    filtered = filtered.filter(b => b.publicationYear === year);
  }

  if (featured) {
    filtered = filtered.filter(b => b.featured);
  }

  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedBooks = filtered.slice(startIndex, endIndex);

  res.json({
    success: true,
    books: paginatedBooks,
    pagination: {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    }
  });
});

// Get Book By ID
app.get('/api/books/:id', (req, res) => {
  const book = db.getBookById(req.params.id);
  if (!book) {
    return sendError(res, 404, 'Book not found.');
  }
  res.json({ success: true, book });
});

// Create Book (Admin only)
app.post('/api/books', authenticateToken, requireAdmin, (req, res) => {
  const { title, author, price, genre, stock, ISBN, description, imageUrl, featured } = req.body;

  if (!title || !author || price === undefined || !genre || stock === undefined || !ISBN || !description) {
    return sendError(res, 400, 'Please provide all required fields (title, author, price, genre, stock, ISBN, description).');
  }

  const defaultImg = 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600&auto=format&fit=crop';
  const newBook = db.addBook({
    title,
    author,
    price: Number(price),
    genre,
    stock: Number(stock),
    ISBN,
    description,
    imageUrl: imageUrl || defaultImg,
    featured: !!featured
  });

  res.status(201).json({ success: true, book: newBook });
});

// Update Book (Admin only)
app.put('/api/books/:id', authenticateToken, requireAdmin, (req, res) => {
  const updated = db.updateBook(req.params.id, req.body);
  if (!updated) {
    return sendError(res, 404, 'Book not found.');
  }
  res.json({ success: true, book: updated });
});

// Delete Book (Admin only)
app.delete('/api/books/:id', authenticateToken, requireAdmin, (req, res) => {
  const success = db.deleteBook(req.params.id);
  if (!success) {
    return sendError(res, 404, 'Book not found or cannot be deleted.');
  }
  res.json({ success: true, message: 'Book deleted successfully.' });
});

// PDF Intelligence Extraction Endpoint
app.post('/api/pdf-extract', async (req, res) => {
  const { pdfBase64, bookId } = req.body;

  if (!pdfBase64) {
    return sendError(res, 400, 'Please provide the raw base64 string of the PDF content.');
  }

  try {
    const metadata = await extractMetadataFromPdf(pdfBase64);
    
    // Automatically update book properties if bookId is provided
    if (bookId) {
      db.updateBook(bookId, {
        title: metadata.title,
        author: metadata.author,
        genre: metadata.genre,
        publicationDate: metadata.publicationDate,
        publicationYear: metadata.publicationYear,
        summary: metadata.summary,
        description: metadata.description
      });
    }

    res.json({
      success: true,
      metadata
    });
  } catch (error) {
    console.error('PDF extraction route error:', error);
    sendError(res, 500, error?.message || 'Failed to extract metadata from the PDF using GenAI.');
  }
});

// --- ORDERS API ---

// Create Order (All Authenticated users)
app.post('/api/orders', authenticateToken, (req, res) => {
  const { books, shippingAddress } = req.body;

  if (!books || !Array.isArray(books) || books.length === 0) {
    return sendError(res, 400, 'Please provide list of books for the order.');
  }

  if (!shippingAddress) {
    return sendError(res, 400, 'Please provide a valid shipping address.');
  }

  // Validate stock levels before placing order
  const booksDb = db.getBooks();
  for (const item of books) {
    const book = booksDb.find(b => b.id === item.bookId);
    if (!book) {
      return sendError(res, 404, `Book with ID ${item.bookId} not found.`);
    }
    if (book.stock < item.quantity) {
      return sendError(res, 400, `Insufficient stock for "${book.title}". Available: ${book.stock}, requested: ${item.quantity}.`);
    }
  }

  // Calculate totals and format items
  let totalPrice = 0;
  const orderItems = books.map(item => {
    const book = booksDb.find(b => b.id === item.bookId);
    const itemTotal = book.price * item.quantity;
    totalPrice += itemTotal;
    return {
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      quantity: item.quantity,
      imageUrl: book.imageUrl
    };
  });

  const newOrder = db.addOrder({
    userId: req.user.id,
    customerName: req.user.name,
    customerEmail: req.user.email,
    books: orderItems,
    status: 'Pending',
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    shippingAddress,
    paymentStatus: 'Paid' // Simulated instant checkout payoff
  });

  res.status(201).json({ success: true, order: newOrder });
});

// Get Orders (Admin is all, customer is self)
app.get('/api/orders', authenticateToken, (req, res) => {
  const allOrders = db.getOrders();

  if (req.user.role === 'admin') {
    res.json({ success: true, orders: allOrders.reverse() });
  } else {
    // Return customer-only subset
    const customerOrders = allOrders.filter(o => o.userId === req.user.id);
    res.json({ success: true, orders: customerOrders.reverse() });
  }
});

// Get Order Details by ID
app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const allOrders = db.getOrders();
  const order = allOrders.find(o => o.id === req.params.id);

  if (!order) {
    return sendError(res, 404, 'Order not found.');
  }

  // Ensure security: only order Creator or admins can see details
  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return sendError(res, 403, 'Access denied. This is not your order.');
  }

  res.json({ success: true, order });
});

// Update Order Status (Admin only)
app.put('/api/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;

  if (!status) {
    return sendError(res, 400, 'Please provide order status.');
  }

  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return sendError(res, 400, `Invalid status. Choose from: ${validStatuses.join(', ')}`);
  }

  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return sendError(res, 404, 'Order not found.');
  }

  res.json({ success: true, order: updated });
});

// Serve frontend build static files & configure Vite dev proxy
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server starting... running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
