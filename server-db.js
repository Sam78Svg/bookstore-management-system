import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const BOOKS_FILE = path.join(DATA_DIR, 'books.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure directory and files exist
function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Preseed Books
  if (!fs.existsSync(BOOKS_FILE)) {
    const defaultBooks = [
      {
        id: 'book-1',
        title: 'The Infinite Horizon',
        author: 'Evelyn Reed',
        price: 14.99,
        genre: 'Sci-Fi',
        stock: 12,
        ISBN: '978-3-16-148410-0',
        description: 'An epic journey across galaxies where human consciousness has merged with silicon, exploring the outer bounds of space and deep secrets of the old world.',
        imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop',
        featured: true,
        publicationDate: 'March 20, 2024',
        publicationYear: '2024',
        summary: "A futuristic epic chronicling humanity's transition to a merged silicon-consciousness among the stars."
      },
      {
        id: 'book-2',
        title: 'Designing Tomorrow',
        author: 'Aris Thorne',
        price: 29.99,
        genre: 'Technology',
        stock: 15,
        ISBN: '978-1-56619-909-4',
        description: 'A comprehensive visual and philosophical guide to scalable design, user experience design, and building beautiful products in the era of intelligence.',
        imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop',
        featured: true,
        publicationDate: 'November 5, 2025',
        publicationYear: '2025',
        summary: 'An essential design manifesto for engineers and creators building clean, tactile user interfaces in the modern era.'
      },
      {
        id: 'book-3',
        title: 'Chords of the Silent Sea',
        author: 'Julian Vane',
        price: 11.49,
        genre: 'Mystery',
        stock: 5,
        ISBN: '978-0-06-620412-2',
        description: 'When an underwater recording station intercepts a haunting, rhythmic melody, a marine biologist sets out to decipher its origins and reveals an ancient civilization.',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
        featured: false,
        publicationDate: 'August 12, 2023',
        publicationYear: '2023',
        summary: 'A high-suspense marine mystery following a biologist who uncovers ancient acoustic signals beneath the deep ocean.'
      },
      {
        id: 'book-4',
        title: 'Breathe: The Art of Living Slowly',
        author: 'Amara Lopez',
        price: 18.00,
        genre: 'Self-Help',
        stock: 20,
        ISBN: '978-0-307-27767-1',
        description: 'Find presence, calm, and focus in a hyper-connected world. Amara Lopez shares visual practices, meditation prompts, and direct breathwork exercises.',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
        featured: true,
        publicationDate: 'January 15, 2026',
        publicationYear: '2026',
        summary: 'A highly visual guide detailing intentional exercises and mindfulness structures for recovering calm and clarity.'
      },
      {
        id: 'book-5',
        title: 'The Great Alchemist',
        author: 'Rayan Kaelen',
        price: 9.99,
        genre: 'Fantasy',
        stock: 8,
        ISBN: '978-0-451-52493-5',
        description: "Follow the trials of a young scholar as they unravel the legendary recipe for the Philosopher's stone, battling shadows and inner doubts along the way.",
        imageUrl: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=600&auto=format&fit=crop',
        featured: false,
        publicationDate: 'May 28, 2021',
        publicationYear: '2021',
        summary: 'An enchanting tale of self-discovery, hidden knowledge, and ancient scholarly arts.'
      },
      {
        id: 'book-6',
        title: 'The Echo of Empires',
        author: 'Dr. Sarah Sterling',
        price: 24.50,
        genre: 'History',
        stock: 10,
        ISBN: '978-0-14-118776-1',
        description: 'A brilliant archaeological perspective on the rise and sudden fall of historical civilizations across the Mediterranean basin, packed with fresh discovery details.',
        imageUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=600&auto=format&fit=crop',
        featured: false,
        publicationDate: 'October 10, 2018',
        publicationYear: '2018',
        summary: 'An archaeological tour-de-force detailing the systemic collapse and structural relics of ancient Mediterranean empires.'
      }
    ];
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(defaultBooks, null, 2));
  } else {
    // Migrate existing books to ensure they have publicationDate, publicationYear, and summary
    try {
      const current = JSON.parse(fs.readFileSync(BOOKS_FILE, 'utf8'));
      const defaultBooks = [
        {
          id: 'book-1',
          title: 'The Infinite Horizon',
          author: 'Evelyn Reed',
          price: 14.99,
          genre: 'Sci-Fi',
          stock: 12,
          ISBN: '978-3-16-148410-0',
          description: 'An epic journey across galaxies where human consciousness has merged with silicon, exploring the outer bounds of space and deep secrets of the old world.',
          imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop',
          featured: true,
          publicationDate: 'March 20, 2024',
          publicationYear: '2024',
          summary: "A futuristic epic chronicling humanity's transition to a merged silicon-consciousness among the stars."
        },
        {
          id: 'book-2',
          title: 'Designing Tomorrow',
          author: 'Aris Thorne',
          price: 29.99,
          genre: 'Technology',
          stock: 15,
          ISBN: '978-1-56619-909-4',
          description: 'A comprehensive visual and philosophical guide to scalable design, user experience design, and building beautiful products in the era of intelligence.',
          imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop',
          featured: true,
          publicationDate: 'November 5, 2025',
          publicationYear: '2025',
          summary: 'An essential design manifesto for engineers and creators building clean, tactile user interfaces in the modern era.'
        },
        {
          id: 'book-3',
          title: 'Chords of the Silent Sea',
          author: 'Julian Vane',
          price: 11.49,
          genre: 'Mystery',
          stock: 5,
          ISBN: '978-0-06-620412-2',
          description: 'When an underwater recording station intercepts a haunting, rhythmic melody, a marine biologist sets out to decipher its origins and reveals an ancient civilization.',
          imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
          featured: false,
          publicationDate: 'August 12, 2023',
          publicationYear: '2023',
          summary: 'A high-suspense marine mystery following a biologist who uncovers ancient acoustic signals beneath the deep ocean.'
        },
        {
          id: 'book-4',
          title: 'Breathe: The Art of Living Slowly',
          author: 'Amara Lopez',
          price: 18.00,
          genre: 'Self-Help',
          stock: 20,
          ISBN: '978-0-307-27767-1',
          description: 'Find presence, calm, and focus in a hyper-connected world. Amara Lopez shares visual practices, meditation prompts, and direct breathwork exercises.',
          imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
          featured: true,
          publicationDate: 'January 15, 2026',
          publicationYear: '2026',
          summary: 'A highly visual guide detailing intentional exercises and mindfulness structures for recovering calm and clarity.'
        },
        {
          id: 'book-5',
          title: 'The Great Alchemist',
          author: 'Rayan Kaelen',
          price: 9.99,
          genre: 'Fantasy',
          stock: 8,
          ISBN: '978-0-451-52493-5',
          description: "Follow the trials of a young scholar as they unravel the legendary recipe for the Philosopher's stone, battling shadows and inner doubts along the way.",
          imageUrl: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=600&auto=format&fit=crop',
          featured: false,
          publicationDate: 'May 28, 2021',
          publicationYear: '2021',
          summary: 'An enchanting tale of self-discovery, hidden knowledge, and ancient scholarly arts.'
        },
        {
          id: 'book-6',
          title: 'The Echo of Empires',
          author: 'Dr. Sarah Sterling',
          price: 24.50,
          genre: 'History',
          stock: 10,
          ISBN: '978-0-14-118776-1',
          description: 'A brilliant archaeological perspective on the rise and sudden fall of historical civilizations across the Mediterranean basin, packed with fresh discovery details.',
          imageUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=600&auto=format&fit=crop',
          featured: false,
          publicationDate: 'October 10, 2018',
          publicationYear: '2018',
          summary: 'An archaeological tour-de-force detailing the systemic collapse and structural relics of ancient Mediterranean empires.'
        }
      ];
      let updated = false;
      current.forEach(b => {
        if (!b.publicationYear) {
          const def = defaultBooks.find(d => d.id === b.id);
          b.publicationDate = b.publicationDate || def?.publicationDate || 'June 19, 2026';
          b.publicationYear = b.publicationYear || def?.publicationYear || '2026';
          b.summary = b.summary || def?.summary || b.description.slice(0, 100) + '...';
          updated = true;
        }
      });
      if (updated) {
        fs.writeFileSync(BOOKS_FILE, JSON.stringify(current, null, 2));
      }
    } catch (e) {
      console.error("Migration error:", e);
    }
  }

  // Preseed Users
  if (!fs.existsSync(USERS_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const defaultUsers = [
      {
        id: 'user-admin',
        name: 'Store Administrator',
        email: 'admin@bookstore.com',
        hashedPassword: bcrypt.hashSync('admin123', salt),
        role: 'admin'
      },
      {
        id: 'user-customer',
        name: 'Jane Doe',
        email: 'user@bookstore.com',
        hashedPassword: bcrypt.hashSync('user123', salt),
        role: 'customer'
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  }

  // Preseed Orders
  if (!fs.existsSync(ORDERS_FILE)) {
    const defaultOrders = [
      {
        id: 'order-1',
        userId: 'user-customer',
        customerName: 'Jane Doe',
        customerEmail: 'user@bookstore.com',
        books: [
          {
            bookId: 'book-1',
            title: 'The Infinite Horizon',
            author: 'Evelyn Reed',
            price: 14.99,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop'
          },
          {
            bookId: 'book-3',
            title: 'Chords of the Silent Sea',
            author: 'Julian Vane',
            price: 11.49,
            quantity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop'
          }
        ],
        status: 'Delivered',
        totalPrice: 37.97,
        shippingAddress: '123 Meadow Lane, Green City, GC 90210',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        id: 'order-2',
        userId: 'user-customer',
        customerName: 'Jane Doe',
        customerEmail: 'user@bookstore.com',
        books: [
          {
            bookId: 'book-4',
            title: 'Breathe: The Art of Living Slowly',
            author: 'Amara Lopez',
            price: 18.00,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop'
          }
        ],
        status: 'Processing',
        totalPrice: 18.00,
        shippingAddress: '123 Meadow Lane, Green City, GC 90210',
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(defaultOrders, null, 2));
  }
}

// Initial Call
initDB();

// DB Access Methods
export const db = {
  // Books API methods
  getBooks: () => {
    try {
      const data = fs.readFileSync(BOOKS_FILE, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveBooks: (books) => {
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2));
  },

  getBookById: (id) => {
    return db.getBooks().find(b => b.id === id);
  },

  addBook: (bookData) => {
    const books = db.getBooks();
    const newBook = {
      ...bookData,
      id: `book-${Date.now()}`
    };
    books.push(newBook);
    db.saveBooks(books);
    return newBook;
  },

  updateBook: (id, updateData) => {
    const books = db.getBooks();
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return null;
    books[index] = { ...books[index], ...updateData };
    db.saveBooks(books);
    return books[index];
  },

  deleteBook: (id) => {
    const books = db.getBooks();
    const filtered = books.filter(b => b.id !== id);
    if (books.length === filtered.length) return false;
    db.saveBooks(filtered);
    return true;
  },

  // Users API methods
  getUsersRaw: () => {
    try {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveUsersRaw: (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  },

  getUserByEmail: (email) => {
    return db.getUsersRaw().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserById: (id) => {
    const raw = db.getUsersRaw().find((u) => u.id === id);
    if (!raw) return null;
    const { hashedPassword, ...userWithoutPassword } = raw;
    return userWithoutPassword;
  },

  addUser: (userData) => {
    const users = db.getUsersRaw();
    const newUser = {
      ...userData,
      id: `user-${Date.now()}`
    };
    users.push(newUser);
    db.saveUsersRaw(users);
    const { hashedPassword, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Orders API methods
  getOrders: () => {
    try {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveOrders: (orders) => {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  },

  addOrder: (orderData) => {
    const orders = db.getOrders();
    const newOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    db.saveOrders(orders);

    // Update book inventory stocks
    const books = db.getBooks();
    newOrder.books.forEach(orderedBook => {
      const bookIndex = books.findIndex(b => b.id === orderedBook.bookId);
      if (bookIndex !== -1) {
        books[bookIndex].stock = Math.max(0, books[bookIndex].stock - orderedBook.quantity);
      }
    });
    db.saveBooks(books);

    return newOrder;
  },

  updateOrderStatus: (id, status) => {
    const orders = db.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    orders[index].status = status;
    db.saveOrders(orders);
    return orders[index];
  }
};
