import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Mail, Key, UserCheck } from 'lucide-react';

export default function Register() {
  const { register, isLoading } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div id="register-page-container" className="max-w-md mx-auto my-12 px-4">
      {/* Container Card */}
      <div className="bg-card-bg rounded-3xl border border-subtle-border shadow-2xl overflow-hidden p-8 flex flex-col gap-6">
        
        {/* Header Title info */}
        <div className="text-center">
          <h1 className="serif text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
            <UserCheck className="h-5 w-5 text-accent-gold" />
            Create Account
          </h1>
          <p className="text-xs text-zinc-405 mt-1.5 leading-relaxed">
            Fill in your basic information details to join Bibliotheca club instantly.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={submitForm} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-name-input" className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
              <User className="h-3 w-3 text-accent-gold" />
              Full Name
            </label>
            <input
              id="reg-name-input"
              type="text"
              required
              placeholder="Alexander Reed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-subtle-border bg-card-dark text-sm text-white placeholder:text-zinc-555 focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-transparent transition-all"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-email-input" className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
              <Mail className="h-3 w-3 text-accent-gold" />
              Email Address
            </label>
            <input
              id="reg-email-input"
              type="email"
              required
              placeholder="alex@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-subtle-border bg-card-dark text-sm text-white placeholder:text-zinc-555 focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-transparent transition-all"
            />
          </div>

          {/* Secret Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-password-input" className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
              <Key className="h-3 w-3 text-accent-gold" />
              Secret Password
            </label>
            <input
              id="reg-password-input"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-subtle-border bg-card-dark text-sm text-white placeholder:text-zinc-555 focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-transparent transition-all"
            />
          </div>

          <button
            id="reg-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-accent-gold hover:bg-accent-gold-hover text-black rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Creating profile...' : 'Register Profile'}
          </button>
        </form>

        {/* Link back to login */}
        <div className="text-center pt-3 border-t border-subtle-border">
          <p className="text-xs text-zinc-404">
            Already have an active profile?{' '}
            <Link
              id="reg-goto-login-link"
              to="/login"
              className="font-bold text-accent-gold underline hover:text-[#C5A059] transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
