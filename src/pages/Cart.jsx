import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, MapPin, Truck } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, clearCart, createOrder, user } = useApp();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const subtotal = cart.reduce((total, item) => total + item.book.price * item.quantity, 0);
  
  // Free Shipping Threshold limit ($50)
  const FREE_SHIPPING_LIMIT = 50;
  const shippingFee = subtotal >= FREE_SHIPPING_LIMIT || subtotal === 0 ? 0 : 5.99;
  const totalPrice = subtotal + shippingFee;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=cart');
      return;
    }

    if (!shippingAddress.trim()) {
      return;
    }

    setCheckingOut(true);
    const success = await createOrder(shippingAddress);
    setCheckingOut(false);
    if (success) {
      navigate('/orders');
    }
  };

  if (cart.length === 0) {
    return (
      <div id="cart-page-container" className="max-w-xl mx-auto text-center py-24 px-4">
        <div className="mx-auto h-16 w-16 bg-[#161618] border border-subtle-border text-[#C5A059] rounded-2xl flex items-center justify-center shadow-md mb-6">
          <ShoppingCart className="h-8 w-8" />
        </div>
        <h2 className="serif text-2xl font-bold text-white tracking-tight">Your shopping cart is empty</h2>
        <p className="text-sm text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
          You haven't added any items to your bag yet. Head over to our curated catalogue to discover new reads.
        </p>
        <Link
          id="cart-goto-catalog-btn"
          to="/books"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 bg-accent-gold hover:bg-accent-gold-hover text-black font-bold text-sm rounded-xl shadow-lg transition-all"
        >
          Browse Books
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </Link>
      </div>
    );
  }

  return (
    <div id="cart-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Page Title */}
      <div className="border-b border-subtle-border pb-6">
        <h1 className="serif text-3xl font-bold text-white tracking-tight">
          Your Cart
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Review acquisitions and finalize your secured shipment details below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart items list left column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex justify-between items-baseline shrink-0">
            <span className="text-sm font-semibold font-mono text-zinc-400">
              {cart.length} unique {cart.length === 1 ? 'book' : 'books'} in bag
            </span>
            <button
              id="clear-bag-btn"
              onClick={clearCart}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              Clear all items
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={item.book.id}
                id={`cart-item-${item.book.id}`}
                className="flex items-start sm:items-center gap-4 p-4 border border-subtle-border rounded-2xl bg-card-bg"
              >
                {/* Product Cover image representation */}
                <div className="h-20 w-16 overflow-hidden rounded-lg border border-subtle-border bg-card-dark shrink-0">
                  <img
                    src={item.book.imageUrl}
                    alt={item.book.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Title / Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="serif text-sm font-bold text-white truncate">
                    {item.book.title}
                  </h3>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    by {item.book.author}
                  </p>
                  <p className="text-xs font-mono font-bold text-accent-gold mt-1.5 sm:hidden">
                    ${item.book.price.toFixed(2)} each
                  </p>
                </div>

                {/* Pricing / quantity handlers */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-6 ml-auto shrink-0">
                  <span className="hidden sm:block text-sm font-semibold text-zinc-400 font-mono">
                    ${item.book.price.toFixed(2)}
                  </span>

                  {/* Quantity Stepper widget */}
                  <div className="flex items-center border border-subtle-border bg-card-dark p-0.5 rounded-lg">
                    <button
                      id={`cart-qty-dec-${item.book.id}`}
                      onClick={() => updateCartQuantity(item.book.id, item.quantity - 1)}
                      className="h-7 w-7 flex items-center justify-center font-bold text-zinc-400 hover:text-white transition-colors hover:bg-card-light rounded cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-semibold font-mono text-white">
                      {item.quantity}
                    </span>
                    <button
                      id={`cart-qty-inc-${item.book.id}`}
                      onClick={() => updateCartQuantity(item.book.id, item.quantity + 1)}
                      className="h-7 w-7 flex items-center justify-center font-bold text-zinc-400 hover:text-white transition-colors hover:bg-card-light rounded cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total Price display */}
                  <span className="text-sm font-bold text-accent-gold font-mono w-20 text-right">
                    ${(item.book.price * item.quantity).toFixed(2)}
                  </span>

                  {/* Delete button */}
                  <button
                    id={`cart-item-remove-${item.book.id}`}
                    onClick={() => removeFromCart(item.book.id)}
                    className="p-1 rounded-lg text-zinc-550 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove from bag"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Free Shipping Incentive meter bar */}
          <div className="p-4 bg-card-bg rounded-2xl border border-subtle-border flex items-center gap-4">
            <div className="h-10 w-10 flex items-center justify-center bg-card-dark border border-subtle-border rounded-xl shrink-0 text-accent-gold">
              <Truck className="h-5 w-5" />
            </div>
            <div className="flex-1">
              {subtotal >= FREE_SHIPPING_LIMIT ? (
                <div>
                  <span className="text-xs font-bold text-emerald-400">You unlocked Free shipping!</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Complimentary express shipping applied automatically.</p>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-semibold text-zinc-300">
                    Add <span className="font-bold text-white">${(FREE_SHIPPING_LIMIT - subtotal).toFixed(2)}</span> more to unlock Free Standard Shipping!
                  </span>
                  <div className="w-full bg-card-dark h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-accent-gold h-full rounded-full transition-all duration-300"
                      style={{ width: `${(subtotal / FREE_SHIPPING_LIMIT) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order checkout details form - right column */}
        <div className="lg:col-span-5 bg-card-bg rounded-2xl border border-subtle-border p-6 shadow-lg">
          <h2 className="serif text-lg font-bold text-white mb-4 pb-3 border-b border-subtle-border">
            Summary
          </h2>

          <div className="flex flex-col gap-3.5 mb-6 font-mono text-sm text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Standard Shipment</span>
              <span className="text-white font-semibold">
                {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-subtle-border pt-4 flex justify-between text-white font-bold text-base">
              <span>Grand Total</span>
              <span className="text-lg text-accent-gold">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipment Address Input Form */}
          <form onSubmit={handleCheckout} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="shipping-address-input" className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-accent-gold" />
                Shipping Address
              </label>
              <textarea
                id="shipping-address-input"
                required
                rows={3}
                placeholder="Enter complete postal code, suite number, and street address..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full p-3 rounded-xl border border-subtle-border bg-card-dark text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-transparent transition-all"
              />
            </div>

            {/* Warning if user not authenticated */}
            {!user && (
              <div className="p-3 bg-amber-950/45 border border-amber-900/50 rounded-xl text-xs text-amber-300 leading-relaxed font-semibold">
                Authorization check: You must sign in or register first before executing checkout orders.
              </div>
            )}

            <button
              id="checkout-checkout-submit-btn"
              type="submit"
              disabled={checkingOut}
              className="w-full h-12 inline-flex items-center justify-center gap-2 bg-accent-gold hover:bg-accent-gold-hover text-black font-extrabold text-sm rounded-xl shadow border border-transparent transition-all disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
              {user ? (checkingOut ? 'Placing Order...' : 'Secure Order Checkout') : 'Sign In to Checkout'}
            </button>
          </form>

          {/* Security seal info */}
          <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-zinc-500">
            <ShieldCheck className="h-3.5 w-3.5 text-accent-gold" />
            <span>Encrypted Checkout Security guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
