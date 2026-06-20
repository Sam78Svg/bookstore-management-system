import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BookCard from '../components/BookCard';
import { ArrowRight, Star, Sparkles, BookMarked, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const { fetchBooks } = useApp();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks({ featured: true, limit: 4 }).then((data) => {
      setFeaturedBooks(data.books);
      setLoading(false);
    });
  }, []);

  return (
    <div id="home-page-container" className="flex flex-col gap-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-card-bg to-dark-bg border-b border-subtle-border py-16 sm:py-24">
        {/* Decorative ambient background mesh */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-accent-gold/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent-gold/3 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            {/* Fine tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent-gold text-black text-[10px] font-extrabold tracking-widest uppercase mb-6 shadow-md"
            >
              <Sparkles className="h-3 w-3 fill-black" />
              Curated Masterpieces
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="serif text-4xl sm:text-6.5xl font-bold text-white tracking-tight leading-[1.1] mb-6"
            >
              For those who cherish the <span className="underline decoration-[#C5A059] decoration-wavy underline-offset-8">written word</span>.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mb-8"
            >
              Welcome to Bibliotheca. We curate refined collections of sci-fi epics, modern history, critical technologies, mystery masterpieces, and soul-affirming self-help journals. Pristinely produced and delivered straight to your study.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                id="hero-explore-btn"
                to="/books"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent-gold text-black font-bold hover:bg-accent-gold-hover rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-sm"
              >
                Browse Catalogue
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </Link>
              <a
                id="hero-featured-anchor"
                href="#featured-section"
                className="inline-flex items-center gap-1 px-5 py-3.5 bg-card-dark border border-subtle-border hover:border-zinc-755 text-zinc-300 hover:text-white rounded-xl font-medium transition-all text-sm shadow-sm"
              >
                Featured Books
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Indicators (Aesthetic grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card-bg rounded-2xl border border-subtle-border flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-card-dark border border-subtle-border flex items-center justify-center text-accent-gold shrink-0 shadow-md">
              <BookMarked className="h-6 w-6" />
            </div>
            <div>
              <h4 className="serif font-bold text-white text-base tracking-tight mb-1">Curation First</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">No clutter. Every book in our directory is hand-selected by editorial professionals for profound impact.</p>
            </div>
          </div>

          <div className="p-6 bg-card-bg rounded-2xl border border-subtle-border flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-card-dark border border-subtle-border flex items-center justify-center text-accent-gold shrink-0 shadow-md">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h4 className="serif font-bold text-white text-base tracking-tight mb-1">Eco-Conscious</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">We source directly from sustainable printing guilds and coordinate carbon-neutral standard delivery.</p>
            </div>
          </div>

          <div className="p-6 bg-card-bg rounded-2xl border border-subtle-border flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-card-dark border border-subtle-border flex items-center justify-center text-accent-gold shrink-0 shadow-md">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h4 className="serif font-bold text-white text-base tracking-tight mb-1">Collector Benefits</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">Register your free account to unlock automated order tracking, pre-orders, and active status dashboards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section id="featured-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-8">
          <div>
            <h2 className="serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Featured Acquisitions
            </h2>
            <p className="text-sm text-zinc-400 mt-1.5">
              Refined masterpieces trending this season.
            </p>
          </div>
          <Link
            id="featured-see-all"
            to="/books"
            className="text-sm font-semibold text-accent-gold hover:text-accent-gold-hover flex items-center gap-1 group pb-1 border-b border-accent-gold/45 hover:border-accent-gold transition-colors"
          >
            See all books
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-3">
                <div className="bg-card-bg rounded-2xl aspect-[4/5] w-full" />
                <div className="h-4 bg-card-bg rounded w-2/3" />
                <div className="h-3 bg-card-dark rounded w-1/2" />
                <div className="h-8 bg-card-light rounded w-full mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <div key={book.id}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Literary Quote / Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-card-bg border border-subtle-border rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-accent-gold/5 blur-2xl pointer-events-none" />
          <div className="max-w-xl text-center sm:text-left">
            <h3 className="serif text-xl sm:text-2xl italic text-zinc-200 font-light mb-4 leading-relaxed">
              "A room without books is like a body without a soul."
            </h3>
            <p className="text-xs text-accent-gold font-mono tracking-widest uppercase">
              – Marcus Tullius Cicero
            </p>
          </div>
          <div className="shrink-0">
            <Link
              id="quote-cta-btn"
              to="/books"
              className="px-6 py-3.5 bg-accent-gold text-black font-bold rounded-xl text-sm transition-all hover:bg-accent-gold-hover shadow-lg transform hover:-translate-y-0.5 block text-center"
            >
              Explore and Read
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
