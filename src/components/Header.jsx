import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookOpen, ShoppingCart, LogOut, ShieldAlert } from 'lucide-react';

export default function Header() {
  const { user, cart, logout } = useApp();
  const navigate = useNavigate();

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItemClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-card-light text-accent-gold font-semibold shadow-sm'
        : 'text-zinc-400 hover:bg-card-dark hover:text-white'
    }`;

  return (
    <header id="app-header" className="sticky top-0 z-40 w-full border-b border-subtle-border bg-card-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link id="logo-link" to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-gold text-black shadow-lg transition-transform duration-200 group-hover:scale-105">
              <BookOpen className="h-5 w-5 stroke-[2.25]" />
            </div>
            <div className="flex flex-col">
              <span className="serif font-bold text-white tracking-wide leading-none text-base sm:text-lg">
                Bibliotheca
              </span>
              <span className="text-[9px] text-[#C5A059] font-mono tracking-[0.18em] mt-0.5 uppercase">
                Fine Bookstore
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-1.5">
            <NavLink id="nav-home" to="/" end className={navItemClass}>
              Home
            </NavLink>
            <NavLink id="nav-catalog" to="/books" className={navItemClass}>
              Browse Books
            </NavLink>
            {user && (
              <NavLink id="nav-orders" to="/orders" className={navItemClass}>
                My Orders
              </NavLink>
            )}
            {user && user.role === 'admin' && (
              <NavLink id="nav-admin" to="/admin" className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-[#C5A059] hover:bg-card-dark hover:text-accent-gold-hover flex items-center gap-1">
                <ShieldAlert className="h-4 w-4 text-[#C5A059]" />
                Admin Dashboard
              </NavLink>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Cart Link Widget */}
            <Link
              id="cart-widget-link"
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-subtle-border bg-card-dark text-zinc-300 hover:text-white hover:border-zinc-700 shadow-sm transition-all duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-gold text-[10px] font-bold text-black ring-2 ring-[#161618] animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Auth section */}
            <div className="h-6 w-px bg-subtle-border hidden xs:block"></div>

            {user ? (
              <div className="flex items-center gap-2">
                {/* User avatar/name display */}
                <div id="user-profile-summary" className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-sm font-medium text-white truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] leading-tight font-mono text-accent-gold uppercase tracking-widest">
                    {user.role}
                  </span>
                </div>
                
                {/* Custom avatar badge */}
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-card-light border border-subtle-border text-white font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Logout Button */}
                <button
                  id="header-logout-btn"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-zinc-400 hover:text-white hover:bg-card-light rounded-xl border border-transparent hover:border-subtle-border transition-all cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  id="header-login-link"
                  to="/login"
                  className="px-3 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-card-dark transition-all"
                >
                  Sign In
                </Link>
                <Link
                  id="header-register-link"
                  to="/register"
                  className="px-3 py-2 bg-accent-gold text-black font-semibold rounded-xl text-sm hover:bg-accent-gold-hover shadow-md transition-all shrink-0"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
