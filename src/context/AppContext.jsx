import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('bookstore_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('bookstore_token');
  });

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('bookstore_cart');
    return stored ? JSON.parse(stored) : [];
  });

  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('bookstore_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast notifier triggers
  const showToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('bookstore_user', JSON.stringify(data.user));
        localStorage.setItem('bookstore_token', data.token);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        setIsLoading(false);
        return true;
      } else {
        showToast(data.error || 'Login failed', 'error');
        setIsLoading(false);
        return false;
      }
    } catch {
      showToast('Connection error during login', 'error');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('bookstore_user', JSON.stringify(data.user));
        localStorage.setItem('bookstore_token', data.token);
        showToast(`Registration successful! Welcome to the bookstore, ${data.user.name}!`, 'success');
        setIsLoading(false);
        return true;
      } else {
        showToast(data.error || 'Registration failed', 'error');
        setIsLoading(false);
        return false;
      }
    } catch {
      showToast('Connection error during registration', 'error');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bookstore_user');
    localStorage.removeItem('bookstore_token');
    showToast('Logged out successfully', 'info');
  };

  const addToCart = (book, quantity = 1) => {
    if (book.stock <= 0) {
      showToast('Out of stock', 'error');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      if (existing) {
        const totalQty = existing.quantity + quantity;
        if (totalQty > book.stock) {
          showToast(`Cannot add ${quantity} more. Only ${book.stock} available in stock.`, 'error');
          return prev;
        }
        showToast(`Updated "${book.title}" in cart.`, 'success');
        return prev.map(item => item.book.id === book.id ? { ...item, quantity: totalQty } : item);
      }
      showToast(`Added "${book.title}" to cart!`, 'success');
      return [...prev, { book, quantity }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart(prev => {
      const item = prev.find(i => i.book.id === bookId);
      if (item) {
        showToast(`Removed "${item.book.title}" from cart.`, 'info');
      }
      return prev.filter(i => i.book.id !== bookId);
    });
  };

  const updateCartQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prev => {
      const target = prev.find(item => item.book.id === bookId);
      if (target && quantity > target.book.stock) {
        showToast(`Only ${target.book.stock} items left in stock.`, 'error');
        return prev;
      }
      return prev.map(item => item.book.id === bookId ? { ...item, quantity } : item);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // REST API Interactions
  const fetchBooks = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.genre) query.append('genre', params.genre);
    if (params.year) query.append('year', params.year);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.featured) query.append('featured', 'true');

    try {
      const res = await fetch(`/api/books?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        return { books: data.books, pagination: data.pagination };
      }
    } catch {
      showToast('Failed to fetch books catalogue.', 'error');
    }
    return { books: [], pagination: { total: 0, page: 1, limit: 8, totalPages: 1 } };
  };

  const fetchOrders = async () => {
    if (!token) return [];
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        return data.orders;
      }
    } catch {
      showToast('Error loading orders.', 'error');
    }
    return [];
  };

  const createOrder = async (shippingAddress) => {
    if (!token) {
      showToast('Please login to place an order.', 'error');
      return false;
    }
    setIsLoading(true);
    try {
      const items = cart.map(item => ({
        bookId: item.book.id,
        quantity: item.quantity
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ books: items, shippingAddress })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Order placed successfully! Thank you for shopping with us.', 'success');
        clearCart();
        setIsLoading(false);
        return true;
      } else {
        showToast(data.error || 'Failed to place order.', 'error');
        setIsLoading(false);
        return false;
      }
    } catch {
      showToast('Network error while checkout', 'error');
      setIsLoading(false);
      return false;
    }
  };

  const addBook = async (bookData) => {
    if (!token) return false;
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Book "${bookData.title}" added to inventory successfully!`, 'success');
        return true;
      } else {
        showToast(data.error || 'Error adding book', 'error');
        return false;
      }
    } catch {
      showToast('Server error while adding book', 'error');
      return false;
    }
  };

  const updateBook = async (id, bookData) => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Updated "${bookData.title || 'book'}" details!`, 'success');
        return true;
      } else {
        showToast(data.error || 'Error updating book', 'error');
        return false;
      }
    } catch {
      showToast('Server error while updating book', 'error');
      return false;
    }
  };

  const deleteBook = async (id) => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Book removed from index.', 'success');
        return true;
      } else {
        showToast(data.error || 'Error deleting book', 'error');
        return false;
      }
    } catch {
      showToast('Server error during book deletion', 'error');
      return false;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to ${status}!`, 'success');
        return true;
      } else {
        showToast(data.error || 'Error updating status', 'error');
        return false;
      }
    } catch {
      showToast('Failed to update status', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      user, token, cart, toasts, isLoading,
      login, register, logout,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      showToast, dismissToast,
      fetchBooks, fetchOrders, createOrder,
      addBook, updateBook, deleteBook, updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
