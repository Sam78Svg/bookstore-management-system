import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import BookCard from '../components/BookCard';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export default function Books() {
  const { fetchBooks } = useApp();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Available Genres for filtering
  const genres = ['Sci-Fi', 'Technology', 'Mystery', 'Self-Help', 'Fantasy', 'History'];
  // List of publication years
  const years = ['2018', '2021', '2023', '2024', '2025', '2026'];

  // Load books whenever filters modify
  const loadBooks = () => {
    setLoading(true);
    fetchBooks({
      search,
      genre,
      year,
      page,
      limit: 8
    }).then((data) => {
      setBooks(data.books);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.total);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadBooks();
  }, [genre, year, page]);

  // Handle immediate search triggers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // reset to page 1 on fresh search query
    loadBooks();
  };

  const resetAllFilters = () => {
    setSearch('');
    setGenre('');
    setYear('');
    setPage(1);
    setLoading(true);
    fetchBooks({ page: 1, limit: 8 }).then((data) => {
      setBooks(data.books);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.total);
      setLoading(false);
    });
  };

  return (
    <div id="books-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Title Header area */}
      <div className="border-b border-subtle-border pb-6">
        <h1 className="serif text-3xl font-bold text-white tracking-tight">
          The Catalogue
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Explore and query our refined bookshelf list of exclusive physical copies.
        </p>
      </div>

      {/* Control Panel: search and filters */}
      <div className="bg-card-bg p-5 rounded-2xl border border-subtle-border flex flex-col gap-4">
        {/* Search input and select Row */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              id="catalogue-search-input"
              type="text"
              placeholder="Search by title, author, or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-subtle-border bg-card-dark text-sm text-white placeholder:text-zinc-550 focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-transparent transition-all"
            />
          </div>

          {/* Publication Year Selector dropdown */}
          <div className="flex gap-2 shrink-0">
            <select
              id="publication-year-filter"
              value={year}
              onChange={(e) => { setYear(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-xl border border-subtle-border bg-card-dark text-xs sm:text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-accent-gold cursor-pointer"
            >
              <option value="">All Publication Years</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            
            <button
              id="catalogue-search-submit-btn"
              type="submit"
              className="px-5 py-2.5 bg-accent-gold text-black rounded-xl text-sm font-bold hover:bg-accent-gold-hover transition-colors shadow-md cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters Quick select line */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 mr-2">
              <Filter className="h-3.5 w-3.5 text-[#C5A059]" />
              Genres:
            </span>
            <button
              id="genre-filter-all"
              onClick={() => { setGenre(''); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                genre === ''
                  ? 'bg-accent-gold text-black shadow-md'
                  : 'bg-card-dark border border-subtle-border text-zinc-300 hover:bg-card-light hover:text-white'
              }`}
            >
              All Genres
            </button>
            {genres.map((g) => (
              <button
                key={g}
                id={`genre-filter-${g.toLowerCase()}`}
                onClick={() => { setGenre(g); setPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  genre === g
                    ? 'bg-accent-gold text-black shadow-md'
                    : 'bg-card-dark border border-subtle-border text-zinc-300 hover:bg-card-light hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <button
            id="filters-reset-btn"
            onClick={resetAllFilters}
            className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors hover:underline cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            Reset all
          </button>
        </div>
      </div>

      {/* Main Content Area: Books display OR Not Found feedback */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col gap-3">
              <div className="bg-card-bg rounded-2xl aspect-[4/5] w-full" />
              <div className="h-4 bg-card-bg rounded w-2/3" />
              <div className="h-3 bg-card-dark rounded w-1/2" />
              <div className="h-8 bg-card-light rounded w-full mt-2" />
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div id="no-books-found" className="text-center py-16 border border-dashed border-subtle-border rounded-3xl bg-card-bg max-w-lg mx-auto w-full mt-4">
          <BookOpen className="h-12 w-12 text-[#C5A059] opacity-70 mx-auto mb-4" />
          <h3 className="serif text-xl font-bold text-white">No books found</h3>
          <p className="text-sm text-zinc-400 mt-2 max-w-xs mx-auto">
            We couldn't find matches for "{search}" {genre && `under the ${genre} category`}. Try broadening your search.
          </p>
          <button
            id="notfound-reset-btn"
            onClick={resetAllFilters}
            className="mt-5 px-5 py-2.5 bg-accent-gold text-black text-xs font-bold rounded-xl hover:bg-accent-gold-hover shadow-md transition-colors cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Books Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book.id}>
                <BookCard book={book} />
              </div>
            ))}
          </div>

          {/* Pagination Controllers */}
          {totalPages > 1 && (
            <div id="catalogue-pagination" className="flex items-center justify-between border-t border-subtle-border pt-6 mt-4">
              <span className="text-xs font-mono text-zinc-400">
                Showing page <span className="font-semibold text-white">{page}</span> of <span className="font-semibold text-white">{totalPages}</span> ({totalItems} total books)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                   id="pagination-prev"
                   onClick={() => setPage(prev => Math.max(1, prev - 1))}
                   disabled={page === 1}
                   className="p-2 border border-subtle-border rounded-xl bg-card-dark text-zinc-300 hover:bg-card-light hover:border-zinc-700 disabled:opacity-30 disabled:hover:bg-card-dark disabled:hover:border-subtle-border transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      id={`pagination-page-${pNum}`}
                      onClick={() => setPage(pNum)}
                      className={`h-9 w-9 text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        page === pNum
                          ? 'bg-accent-gold text-black shadow-md'
                          : 'border border-subtle-border bg-card-dark text-zinc-400 hover:bg-card-light hover:text-white'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
                <button
                  id="pagination-next"
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-subtle-border rounded-xl bg-card-dark text-zinc-300 hover:bg-card-light hover:border-zinc-700 disabled:opacity-30 disabled:hover:bg-card-dark disabled:hover:border-subtle-border transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
