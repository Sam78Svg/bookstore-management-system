import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { Plus, Edit3, Trash2, BookOpen, FileSpreadsheet, ShieldAlert, Clock } from 'lucide-react';

export default function Admin() {
  const {
    user,
    fetchBooks,
    fetchOrders,
    addBook,
    updateBook,
    deleteBook,
    updateOrderStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState('inventory');
  
  // Books lists
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  // Orders lists
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    genre: 'Sci-Fi',
    stock: '',
    ISBN: '',
    description: '',
    imageUrl: '',
    featured: false
  });

  // Delete modal confirmation target ID
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState('');

  const genres = ['Sci-Fi', 'Technology', 'Mystery', 'Self-Help', 'Fantasy', 'History'];

  // Refresh catalogs
  const loadInventories = async () => {
    setLoadingBooks(true);
    const data = await fetchBooks({ limit: 100 }); // load full listings
    setBooks(data.books);
    setLoadingBooks(false);
  };

  const loadAllOrders = async () => {
    setLoadingOrders(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadInventories();
      loadAllOrders();
    }
  }, [user]);

  // Deny access to non-admins immediately
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="mx-auto h-14 w-14 bg-[#161618] border border-subtle-border text-[#C5A059] rounded-2xl flex items-center justify-center mb-6 shadow-md">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="serif text-xl font-bold text-white">Administrative Access Required</h2>
        <p className="text-sm text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
          Access is gated for store administrators only. Please log in with an admin profile to modify index logs.
        </p>
      </div>
    );
  }

  // Handle Form Submission: Create or Edit Book
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const bookPayload = {
      title: formData.title,
      author: formData.author,
      price: Number(formData.price),
      genre: formData.genre,
      stock: Number(formData.stock),
      ISBN: formData.ISBN,
      description: formData.description,
      imageUrl: formData.imageUrl,
      featured: formData.featured
    };

    if (editingBookId) {
      const success = await updateBook(editingBookId, bookPayload);
      if (success) {
        setShowForm(false);
        setEditingBookId(null);
        loadInventories();
      }
    } else {
      const success = await addBook(bookPayload);
      if (success) {
        setShowForm(false);
        loadInventories();
      }
    }
  };

  // Populate Edit form values
  const startEditBook = (book) => {
    setEditingBookId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price.toString(),
      genre: book.genre,
      stock: book.stock.toString(),
      ISBN: book.ISBN,
      description: book.description,
      imageUrl: book.imageUrl,
      featured: !!book.featured
    });
    setShowForm(true);
  };

  // Open creation form blank
  const startAddBook = () => {
    setEditingBookId(null);
    setFormData({
      title: '',
      author: '',
      price: '',
      genre: 'Sci-Fi',
      stock: '',
      ISBN: '',
      description: '',
      imageUrl: '',
      featured: false
    });
    setShowForm(true);
  };

  // Delete inventory confirmation flow
  const triggerDeleteConfirm = (id, title) => {
    setDeleteId(id);
    setDeleteTitle(title);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    const success = await deleteBook(deleteId);
    if (success) {
      loadInventories();
    }
    setDeleteId(null);
  };

  // Handle order delivery status modifier trigger
  const handleStatusChange = async (orderId, status) => {
    const success = await updateOrderStatus(orderId, status);
    if (success) {
      loadAllOrders();
    }
  };

  return (
    <div id="admin-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Page Title */}
      <div className="border-b border-subtle-border pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="serif text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-accent-gold" />
            Admin Operations Panel
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Store inventory catalogue, ISBN codes registry, user orders processing, and shipments fulfillment.
          </p>
        </div>

        {/* Global Stats indicators */}
        <div className="flex gap-4 font-mono text-xs text-zinc-450 shrink-0">
          <div className="px-3.5 py-1.5 bg-card-bg border border-subtle-border rounded-xl">
            Total books: <span className="font-bold text-accent-gold">{books.length}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-card-bg border border-subtle-border rounded-xl">
            Fulfillments: <span className="font-bold text-accent-gold">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Admin Module Switch Tab buttons */}
      <div className="flex border-b border-subtle-border">
        <button
          id="tab-inventory-btn"
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 -mb-0.5 transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-accent-gold text-accent-gold font-extrabold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Catalog Inventory CRUD
        </button>
        <button
          id="tab-orders-btn"
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 -mb-0.5 transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'border-accent-gold text-accent-gold font-extrabold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Fulfillment Orders Logistics
        </button>
      </div>

      {/* --- INVENTORY PANEL MODULE view --- */}
      {activeTab === 'inventory' && (
        <div id="admin-inventory-module" className="flex flex-col gap-6">
          <div className="flex justify-between items-center sm:gap-4 shrink-0">
            <h2 className="serif text-lg font-bold text-white">
              Active Catalog Index
            </h2>
            <button
              id="admin-add-book-trigger"
              onClick={startAddBook}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-accent-gold hover:bg-accent-gold-hover text-black rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer animate-fadeIn"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              Add New Book
            </button>
          </div>

          {/* Inline Book creation or edit form drawer segment */}
          {showForm && (
            <div id="book-editor-form-drawer" className="p-6 bg-card-bg border border-subtle-border rounded-2xl flex flex-col gap-4 animate-fadeIn">
              <h3 className="font-extrabold text-sm text-[#C5A059] border-b border-subtle-border pb-2.5 flex items-center justify-between">
                <span>{editingBookId ? `Edit Details for "${formData.title}"` : 'Register New Literary Acquisition'}</span>
                <button
                  id="close-drawer-btn"
                  onClick={() => setShowForm(false)}
                  className="text-xs text-zinc-400 hover:text-white hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </h3>

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 text-sm">
                <div className="md:col-span-8 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="p-2.5 border rounded-xl bg-card-dark text-white border-subtle-border focus:outline-none focus:ring-1 focus:ring-accent-gold"
                  />
                </div>

                <div className="md:col-span-4 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Author</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="p-2.5 border rounded-xl bg-card-dark text-white border-subtle-border focus:outline-none focus:ring-1 focus:ring-accent-gold"
                  />
                </div>

                <div className="md:col-span-3 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="p-2.5 border rounded-xl bg-card-dark text-white border-subtle-border focus:outline-none focus:ring-1 focus:ring-accent-gold"
                  />
                </div>

                <div className="md:col-span-3 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Stock units</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="p-2.5 border rounded-xl bg-card-dark text-white border-subtle-border focus:outline-none focus:ring-1 focus:ring-accent-gold"
                  />
                </div>

                <div className="md:col-span-3 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Genre selection</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="p-2.5 border rounded-xl bg-card-dark text-white border-subtle-border focus:outline-none focus:ring-1 focus:ring-accent-gold"
                  >
                    {genres.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">ISBN Code</label>
                  <input
                    type="text"
                    required
                    placeholder="978-X-XX-XXXXXX-X"
                    value={formData.ISBN}
                    onChange={(e) => setFormData({ ...formData, ISBN: e.target.value })}
                    className="p-2.5 border rounded-xl bg-card-dark text-white border-subtle-border focus:outline-none focus:ring-1 focus:ring-accent-gold"
                  />
                </div>

                <div className="md:col-span-9 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Image Cover URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="p-2.5 border rounded-xl bg-card-dark text-white border-subtle-border focus:outline-none focus:ring-1 focus:ring-accent-gold"
                  />
                </div>

                <div className="md:col-span-3 flex items-center gap-2 pt-6.5">
                  <input
                    type="checkbox"
                    id="checkbox-featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4.5 w-4.5 text-black bg-card-dark border-subtle-border rounded focus:ring-accent-gold cursor-pointer"
                  />
                  <label htmlFor="checkbox-featured" className="text-xs font-bold text-zinc-300 cursor-pointer">
                    Flag featured highlighted
                  </label>
                </div>

                <div className="md:col-span-12 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Comprehensive Description Details</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="p-2.5 border rounded-xl bg-card-dark text-white border-subtle-border focus:outline-none focus:ring-1 focus:ring-accent-gold"
                  />
                </div>

                <div className="md:col-span-12 flex justify-end gap-2 border-t border-subtle-border pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border rounded-xl border-subtle-border bg-card-dark text-xs font-semibold cursor-pointer text-zinc-400 hover:bg-card-light hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    id="admin-submit-book-btn"
                    type="submit"
                    className="px-4 py-2 bg-accent-gold hover:bg-accent-gold-hover text-black rounded-xl text-xs font-extrabold cursor-pointer shadow-md transition-all"
                  >
                    {editingBookId ? 'Save Changes' : 'Publish Book'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Books inventory list Table representation */}
          {loadingBooks ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-card-bg rounded"></div>
              <div className="h-16 bg-card-dark rounded"></div>
              <div className="h-16 bg-card-dark rounded"></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-subtle-border bg-card-bg shadow-lg">
              <table className="w-full border-collapse text-left text-sm text-zinc-450">
                <thead className="bg-[#1C1C1F] text-xs font-extrabold text-[#C5A059] uppercase tracking-wider border-b border-subtle-border">
                  <tr>
                    <th className="px-6 py-4">Title & details</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-3 py-4">Genre</th>
                    <th className="px-3 py-4 text-center">Stock</th>
                    <th className="px-6 py-4 text-right">Unit Price</th>
                    <th className="px-6 py-4 text-center">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle-border text-zinc-300">
                  {books.map((b) => (
                    <tr key={b.id} id={`admin-book-row-${b.id}`} className="hover:bg-card-dark/40 transition-colors">
                      {/* Title details */}
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                        <div className="h-11 w-9 rounded overflow-hidden border border-subtle-border shrink-0 bg-card-dark">
                          <img src={b.imageUrl} alt={b.title} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate max-w-[200px]">{b.title}</span>
                          <span className="font-mono text-[10px] text-zinc-450 block mt-0.5 tracking-tighter">ISBN: {b.ISBN}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 truncate max-w-[150px] text-zinc-300">{b.author}</td>
                      <td className="px-3 py-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-subtle-border bg-card-dark text-[#C5A059]">
                          {b.genre}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-center font-mono">
                        {b.stock <= 0 ? (
                          <span className="text-rose-455 font-bold bg-rose-955/45 border border-rose-900/50 px-1.5 py-0.5 rounded">0 (Empty)</span>
                        ) : b.stock <= 5 ? (
                          <span className="text-amber-455 font-bold bg-amber-955/45 border border-amber-900/50 px-1.5 py-0.5 rounded">{b.stock} left!</span>
                        ) : (
                          <span className="text-zinc-200 font-semibold">{b.stock}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-black font-mono text-accent-gold">${b.price.toFixed(2)}</td>
                      {/* Editor actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            id={`admin-edit-btn-${b.id}`}
                            onClick={() => startEditBook(b)}
                            title="Edit details"
                            className="p-2 text-zinc-400 hover:text-accent-gold hover:bg-card-light rounded-xl transition-colors cursor-pointer"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            id={`admin-delete-btn-${b.id}`}
                            onClick={() => triggerDeleteConfirm(b.id, b.title)}
                            title="Purge book"
                            className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-955/65 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- ORDERS LOGISTICS PANEL view --- */}
      {activeTab === 'orders' && (
        <div id="admin-orders-module" className="flex flex-col gap-6">
          <h2 className="serif text-lg font-bold text-white">
            Fulfillment and Dispatch logs
          </h2>

          {loadingOrders ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-card-bg rounded"></div>
              <div className="h-16 bg-card-dark rounded"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 border border-subtle-border border-dashed rounded-2xl bg-card-bg max-w-lg mx-auto w-full">
              <Clock className="h-10 w-10 text-[#C5A059] opacity-70 mx-auto mb-3" />
              <h4 className="serif font-bold text-white">No Orders logged</h4>
              <p className="text-xs text-zinc-400 mt-1">Customers haven't submitted checkout receipts yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((or) => (
                <div
                  key={or.id}
                  id={`admin-order-card-${or.id}`}
                  className="bg-card-bg border rounded-2xl border-subtle-border p-5 flex flex-col gap-4 shadow-lg hover:shadow-xl transition-all"
                >
                  {/* Customer coordinates header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-baseline border-b border-subtle-border pb-3 gap-3">
                    <div className="text-xs font-mono text-zinc-400 flex flex-col gap-0.5">
                      <span className="text-white font-bold block">
                        Order hash: <span className="text-[11px] text-accent-gold bg-card-dark border border-subtle-border px-1.5 py-0.5 rounded">{or.id}</span>
                      </span>
                      <span>Customer: <strong className="text-zinc-200 mt-1 block sm:inline font-sans font-bold">{or.customerName}</strong> ({or.customerEmail})</span>
                      <span>Submitted on: {new Date(or.createdAt).toLocaleString()}</span>
                    </div>

                    {/* Status updater dropdown operations */}
                    <div className="flex items-center gap-2 text-xs shrink-0 bg-card-dark p-1.5 rounded-xl border border-subtle-border">
                      <span className="font-extrabold text-[#C5A059] uppercase tracking-wider text-[9px] px-1.5 leading-none">
                        Fulfillment State:
                      </span>
                      <select
                        id={`admin-order-status-select-${or.id}`}
                        value={or.status}
                        onChange={(e) => handleStatusChange(or.id, e.target.value)}
                        className="py-1 px-2.5 border rounded-lg bg-card-light border-subtle-border focus:outline-none font-bold text-xs text-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Books list elements of custom order */}
                  <div className="flex flex-col gap-2 bg-card-dark/45 p-3.5 rounded-xl border border-subtle-border">
                    <span className="text-[9px] tracking-widest font-extrabold uppercase text-[#C5A059]">Ordered publications:</span>
                    <div className="flex flex-col gap-2 mt-1">
                      {or.books.map((bi, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="font-bold text-zinc-200">
                            📕 {bi.title} &mdash; <span className="italic text-zinc-400">by {bi.author} (qty: {bi.quantity})</span>
                          </span>
                          <span className="font-mono text-accent-gold font-bold">
                            ${(bi.price * bi.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipment instructions, Grand total Paid info */}
                  <div className="flex flex-col sm:flex-row justify-between pt-1 text-xs gap-3">
                    <span className="text-zinc-300 max-w-sm font-sans">
                      <strong className="text-zinc-400 uppercase font-mono tracking-widest text-[9px] block">Shipping Instructions Address</strong>
                      {or.shippingAddress}
                    </span>

                    <div className="text-right sm:self-end">
                      <span className="text-zinc-400 uppercase font-mono tracking-widest text-[9px] block">Sum Paid</span>
                      <span className="font-black font-mono text-base text-accent-gold">${or.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reusable warning target Modal confirmation popup box for catalog removals */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={executeDelete}
        title="Unpublish publication from Store?"
        message={`This action is irreversible. You are about to permanently purge "${deleteTitle}" from the library list database.`}
        confirmLabel="Purge item"
        cancelLabel="Abort"
        type="danger"
      />

    </div>
  );
}
