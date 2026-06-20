import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Orders() {
  const { fetchOrders, user } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders().then((data) => {
        setOrders(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="mx-auto h-14 w-14 bg-[#161618] border border-subtle-border text-[#C5A059] rounded-2xl flex items-center justify-center mb-6 shadow-md">
          <Clock className="h-6 w-6" />
        </div>
        <h2 className="serif text-xl font-bold text-white">Access Denied</h2>
        <p className="text-sm text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
          You must authorize first with your collector credentials to search historical order receipts.
        </p>
        <Link
          id="orders-signin-now-btn"
          to="/login?redirect=orders"
          className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent-gold hover:bg-accent-gold-hover text-black font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse flex flex-col gap-6">
        <div className="h-8 bg-card-bg rounded w-1/3"></div>
        <div className="h-44 bg-card-dark rounded-2xl"></div>
        <div className="h-44 bg-card-dark rounded-2xl"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-zinc-950/60 text-zinc-300 border-subtle-border';
      case 'Processing':
        return 'bg-blue-950/45 text-blue-300 border-blue-900/50';
      case 'Shipped':
        return 'bg-indigo-950/45 text-indigo-300 border-indigo-900/50';
      case 'Delivered':
        return 'bg-emerald-950/45 text-emerald-300 border-emerald-900/50';
      case 'Cancelled':
        return 'bg-rose-950/45 text-rose-300 border-rose-900/50';
      default:
        return 'bg-zinc-950/30 text-zinc-400 border-subtle-border';
    }
  };

  return (
    <div id="orders-page-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Title block */}
      <div className="border-b border-subtle-border pb-6">
        <h1 className="serif text-3xl font-bold text-white tracking-tight">
          Your Acquisitions History
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Monitor shipment status, delivery tracking coordinates, and historic receipt totals.
        </p>
      </div>

      {orders.length === 0 ? (
        <div id="customer-orders-empty-state" className="text-center py-16 border border-dashed border-subtle-border rounded-3xl bg-card-bg max-w-lg mx-auto w-full">
          <ShoppingBag className="h-12 w-12 text-[#C5A059] opacity-70 mx-auto mb-4" />
          <h3 className="serif text-lg font-bold text-white">No Orders Registered</h3>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-xs mx-auto">
            You haven't initiated any checkout orders yet. Your beautiful books will appear right here when ordered!
          </p>
          <Link
            id="orders-shop-now-btn"
            to="/books"
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 bg-accent-gold hover:bg-accent-gold-hover text-black text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Start Fine Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              id={`customer-order-receipt-${order.id}`}
              className="bg-card-bg border border-subtle-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col"
            >
              {/* Header block with date, status, shipment details */}
              <div className="bg-card-dark/70 p-4 border-b border-subtle-border flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-zinc-400">
                  <span className="text-white font-bold block sm:inline">
                    Order ID: <span className="text-[11px] text-accent-gold bg-card-dark border border-subtle-border px-1.5 py-0.5 rounded">{order.id}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-accent-gold" />
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {/* Visual Status Flag badge */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Body items list */}
              <div className="p-5 flex-1 flex flex-col gap-4">
                {order.books.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-sm justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-10 overflow-hidden rounded border border-subtle-border bg-card-dark shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate max-w-[240px] sm:max-w-md">
                          {item.title}
                        </span>
                        <span className="text-xs text-zinc-400 italic block">
                          by {item.author} — {item.quantity} x ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <span className="font-bold text-accent-gold font-mono text-right shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping and Receipt footer summary block */}
              <div className="bg-card-dark/40 p-4 border-t border-subtle-border flex flex-col sm:flex-row justify-between gap-4 text-xs">
                <div className="flex gap-2 text-zinc-350 max-w-sm leading-relaxed">
                  <MapPin className="h-4 w-4 text-accent-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-[#C5A059] uppercase text-[9px] tracking-widest block mb-0.5">Shipping Address</span>
                    <span className="text-zinc-300">{order.shippingAddress}</span>
                  </div>
                </div>

                <div className="text-right flex flex-col justify-end">
                  <span className="text-zinc-400 text-[10px] font-mono leading-none tracking-widest uppercase block">Total checkout paid</span>
                  <span className="text-lg font-black text-accent-gold font-mono mt-1">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
