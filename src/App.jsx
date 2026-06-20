import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Toast from './components/Toast';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import { BookOpen } from 'lucide-react';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-dark-bg text-zinc-100 flex flex-col font-sans selection:bg-accent-gold selection:text-black">
          {/* Main Navigation Header bar */}
          <Header />

          {/* Core Page Content Router view stage */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>

          {/* Elegant Footer finishing block */}
          <footer className="bg-card-bg border-t border-subtle-border py-12 text-zinc-400 font-sans tracking-wide">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Brand label */}
              <div className="flex items-center gap-2">
                <div className="bg-accent-gold text-black h-7 w-7 rounded-lg flex items-center justify-center font-bold shadow-md">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="serif font-semibold text-white text-sm tracking-tight">
                  Bibliotheca &copy; 2026
                </span>
                <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider">
                  | COLLECTORS GUILD
                </span>
              </div>

              {/* Navigation links references */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
                <a href="/books" className="hover:text-accent-gold transition-colors">Catalog Index</a>
                <a href="/orders" className="hover:text-accent-gold transition-colors">Order Tracking</a>
                <a href="/admin" className="hover:text-accent-gold transition-colors">Admin Panel</a>
                <a href="/cart" className="hover:text-accent-gold transition-colors">Cart Bag</a>
              </div>

              {/* Subtext info */}
              <p className="text-[10px] text-zinc-500 text-center font-mono uppercase tracking-wider">
                Full-Stack Bookstore Management System
              </p>
            </div>
          </footer>

          {/* Global floating toast portal node */}
          <Toast />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
