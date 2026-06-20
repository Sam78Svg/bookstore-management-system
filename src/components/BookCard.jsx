import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';

export default function BookCard({ book }) {
  const { addToCart } = useApp();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to details page when clicking cart button
    addToCart(book, 1);
  };

  // Dynamic colors for different genres to make layout visual and elegant
  const getGenreColor = (genre) => {
    switch (genre ? genre.toLowerCase() : '') {
      case 'sci-fi':
        return 'bg-purple-950/45 text-purple-300 border-purple-900/50';
      case 'technology':
        return 'bg-blue-950/45 text-blue-300 border-blue-900/50';
      case 'mystery':
        return 'bg-amber-950/45 text-amber-300 border-amber-900/50';
      case 'self-help':
        return 'bg-emerald-950/45 text-emerald-300 border-emerald-900/50';
      case 'fantasy':
        return 'bg-rose-950/45 text-rose-300 border-rose-900/50';
      case 'history':
        return 'bg-zinc-850 text-zinc-300 border-zinc-750';
      default:
        return 'bg-zinc-900 text-zinc-400 border-subtle-border';
    }
  };

  return (
    <div
      id={`book-card-${book.id}`}
      className="group bg-card-bg rounded-2xl border border-subtle-border overflow-hidden shadow-md hover:shadow-xl hover:border-accent-gold/30 transition-all duration-300 flex flex-col h-full"
    >
      <Link id={`book-detail-link-${book.id}`} to={`/books/${book.id}`} className="block relative aspect-[4/5] overflow-hidden bg-card-dark shrink-0">
        {/* Book Ribbon Badge if featured */}
        {book.featured && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-black uppercase bg-accent-gold rounded-lg shadow-md">
            Featured
          </span>
        )}

        {/* Book image */}
        <img
          src={book.imageUrl}
          alt={book.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
          onError={(e) => {
            // Fallback Cover If Image fails to load
            e.target.src = 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600&auto=format&fit=crop';
          }}
        />

        {/* Quick view transparent card backdrop */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-4 py-2 bg-accent-gold text-black text-xs font-bold rounded-xl shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5">
            View Details
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {/* Genre & Stock Row */}
        <div className="flex items-center justify-between gap-2 mb-2.5 shrink-0">
          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${getGenreColor(book.genre)}`}>
            {book.genre}
          </span>
          <div>
            {book.stock <= 0 ? (
              <span className="text-[10px] bg-rose-950/45 border border-rose-900/50 text-rose-300 font-semibold px-2 py-0.5 rounded-md">
                Out of Stock
              </span>
            ) : book.stock <= 5 ? (
              <span className="text-[10px] bg-amber-950/45 border border-amber-900/50 text-amber-300 font-semibold px-2 py-0.5 rounded-md text-glow">
                Only {book.stock} left!
              </span>
            ) : (
              <span className="text-[10px] bg-emerald-950/45 border border-emerald-900/50 text-emerald-300 font-semibold px-2 py-0.5 rounded-md">
                In Stock
              </span>
            )}
          </div>
        </div>

        {/* Title & Author */}
        <div className="flex-1 mb-3">
          <h3 className="serif font-bold text-white line-clamp-1 group-hover:text-accent-gold transition-colors leading-tight text-base">
            <Link id={`book-title-link-${book.id}`} to={`/books/${book.id}`}>{book.title}</Link>
          </h3>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
            by {book.author}
          </p>
        </div>

        {/* Price & Action button */}
        <div className="flex items-center justify-between gap-2 border-t border-subtle-border pt-3 mt-auto shrink-0">
          <span className="text-lg font-bold text-accent-gold font-mono">
            ${book.price.toFixed(2)}
          </span>

          <button
            id={`book-card-add-to-cart-${book.id}`}
            onClick={handleAddToCart}
            disabled={book.stock <= 0}
            className={`flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer ${
              book.stock <= 0
                ? 'bg-card-dark text-zinc-600 border border-subtle-border shadow-none cursor-not-allowed'
                : 'bg-accent-gold hover:bg-accent-gold-hover text-black hover:shadow-lg'
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
