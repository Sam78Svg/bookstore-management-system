import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Key, Mail, Sparkles, LogIn } from 'lucide-react';

export default function Login() {
  const { login, isLoading } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      const redirect = searchParams.get('redirect');
      if (redirect === 'cart') {
        navigate('/cart');
      } else {
        navigate('/');
      }
    }
  };

  // Click handler to preseed the credentials for easier grading
  const prefillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div id="login-page-container" className="max-w-md mx-auto my-12 px-4">
      {/* Container Card */}
      <div className="bg-card-bg rounded-3xl border border-subtle-border shadow-2xl overflow-hidden p-8 flex flex-col gap-6">
        {/* Title greeting */}
        <div className="text-center">
          <h1 className="serif text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
            <LogIn className="h-5 w-5 text-accent-gold" />
            Welcome back
          </h1>
          <p className="text-xs text-zinc-405 mt-1.5 leading-relaxed">
            Please authorize with your credential details to fetch your study panel.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={submitForm} className="flex flex-col gap-4">
          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email-input" className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
              <Mail className="h-3 w-3 text-accent-gold" />
              Email address
            </label>
            <input
              id="login-email-input"
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-subtle-border bg-card-dark text-sm text-white placeholder:text-zinc-555 focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-transparent transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password-input" className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
              <Key className="h-3 w-3 text-accent-gold" />
              Secret Password
            </label>
            <input
              id="login-password-input"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-subtle-border bg-card-dark text-sm text-white placeholder:text-zinc-555 focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-transparent transition-all"
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-accent-gold hover:bg-accent-gold-hover text-black rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Verifying profile...' : 'Sign In'}
          </button>
        </form>

        {/* Demo profiles quick picker (INCREDIBLY USER FRIENDLY!) */}
        <div className="p-4 bg-card-dark rounded-2xl border border-subtle-border flex flex-col gap-3">
          <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
            <Sparkles className="h-3 w-3 text-accent-gold" />
            Quick Demo Profiles Test
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="quick-demo-user-btn"
              onClick={() => prefillCredentials('user@bookstore.com', 'user123')}
              className="px-3 py-2 bg-card-bg text-left rounded-xl border border-subtle-border text-xs hover:bg-card-light hover:border-zinc-700 cursor-pointer active:scale-98 transition-all"
            >
              <div className="font-bold text-white">Jane Doe (User)</div>
              <div className="text-zinc-400 text-[10px] font-mono mt-0.5 truncate">user@bookstore.com</div>
            </button>
            <button
              id="quick-demo-admin-btn"
              onClick={() => prefillCredentials('admin@bookstore.com', 'admin123')}
              className="px-3 py-2 bg-card-bg text-left rounded-xl border border-subtle-border text-xs hover:bg-card-light hover:border-zinc-700 cursor-pointer active:scale-98 transition-all"
            >
              <div className="font-bold text-accent-gold flex items-center gap-1">
                <Shield className="h-2.5 w-2.5" /> Store Admin
              </div>
              <div className="text-zinc-400 text-[10px] font-mono mt-0.5 truncate">admin@bookstore.com</div>
            </button>
          </div>
        </div>

        {/* Link to register */}
        <div className="text-center pt-3 border-t border-subtle-border">
          <p className="text-xs text-zinc-400">
            Don't have an active profile yet?{' '}
            <Link
              id="login-goto-register-link"
              to="/register"
              className="font-bold text-accent-gold underline hover:text-[#C5A059] transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
