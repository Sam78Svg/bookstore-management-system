import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, ShoppingCart, ShieldAlert, BadgeInfo, 
  Truck, Award, FileText, Sparkles, UploadCloud, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, user, showToast, updateBook } = useApp();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fetchBookDetails = () => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBook(data.book);
        } else {
          showToast('Book not found', 'error');
          navigate('/books');
        }
        setLoading(false);
      })
      .catch(() => {
        showToast('Error retrieving book details.', 'error');
        navigate('/books');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book, qty);
    }
  };

  // Drag and Drop handlers for PDF
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        processPdfFile(file);
      } else {
        showToast("Please drop an authentic PDF document file.", "error");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        processPdfFile(file);
      } else {
        showToast("Please select a PDF document file.", "error");
      }
    }
  };

  // Convert PDF file to base64 and send to backend Gemini extractor
  const processPdfFile = (file) => {
    setIsExtracting(true);
    showToast(`Analyzing PDF: "${file.name}"...`, "info");
    
    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result.split(',')[1];
      try {
        const response = await fetch('/api/pdf-extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pdfBase64: base64String,
            fileName: file.name,
            bookId: book.id
          })
        });

        const data = await response.json();
        if (data.success) {
          showToast("PDF metadata extracted successfully with Gemini AI!", "success");
          
          // Persist the extracted properties into the book record via AppContext
          // Backend automatically persists extracted data on book records when bookId is specified,
          // so we simply invoke fetchBookDetails to refresh the UI immediately.
          fetchBookDetails();
        } else {
          showToast(data.error || "Failed to extract metadata from the PDF", "error");
        }
      } catch (err) {
        showToast("Server communication error while analyzing PDF", "error");
        console.error(err);
      } finally {
        setIsExtracting(false);
      }
    };

    reader.onerror = () => {
      showToast("Failed to read the PDF file block.", "error");
      setIsExtracting(false);
    };

    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse flex flex-col gap-8">
        <div className="h-6 bg-card-bg rounded w-24"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-card-bg aspect-[4/5] rounded-3xl"></div>
          <div className="flex flex-col gap-4">
            <div className="h-10 bg-card-bg rounded w-3/4"></div>
            <div className="h-6 bg-card-bg rounded w-1/2"></div>
            <div className="h-24 bg-card-dark rounded mt-4"></div>
            <div className="h-12 bg-card-light rounded w-1/3 mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      id="book-detail-page-container" 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8"
    >
      {/* Back button link */}
      <div>
        <Link
          id="detail-back-link"
          to="/books"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-accent-gold transition-colors uppercase tracking-widest cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalogue
        </Link>
      </div>

      {/* Book details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-subtle-border pb-12">
        {/* Cover image area */}
        <div className="lg:col-span-4 flex flex-col items-center gap-4">
          <div className="relative rounded-3xl overflow-hidden border border-subtle-border shadow-2xl bg-card-dark max-w-[320px] w-full aspect-[4/5]">
            <img
              src={book.imageUrl}
              alt={book.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover animate-fade-in"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600&auto=format&fit=crop';
              }}
            />
          </div>

          <div className="text-zinc-500 font-mono text-[10px] uppercase text-center tracking-wider">
            Cover ID: {book.ISBN}
          </div>
        </div>

        {/* Detailed textual fields column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div>
            {/* Genre Badge */}
            <span className="text-[10px] bg-accent-gold text-black font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-lg shadow-sm">
              {book.genre}
            </span>

            {/* Title / Author */}
            <h1 className="serif text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight leading-tight">
              {book.title}
            </h1>
            <p className="text-zinc-400 text-sm mt-1 sm:text-base">
              Written by <span className="text-white font-semibold">{book.author}</span>
            </p>
          </div>

          {/* Pricing / Stock Status Banner */}
          <div className="flex flex-wrap items-baseline gap-4 py-4 border-y border-subtle-border">
            <span className="text-3xl font-bold text-accent-gold font-mono">
              ${book.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              {book.stock <= 0 ? (
                <span className="text-xs font-semibold bg-rose-950/45 border border-rose-900/50 text-rose-300 px-3 py-1 rounded-full animate-pulse">
                  Currently Out of Stock
                </span>
              ) : book.stock <= 5 ? (
                <span className="text-xs font-semibold bg-amber-950/45 border border-amber-900/50 text-amber-300 px-3 py-1 rounded-full text-glow animate-pulse">
                  Only {book.stock} units left in store!
                </span>
              ) : (
                <span className="text-xs font-semibold bg-emerald-950/45 border border-emerald-900/50 text-emerald-300 px-3 py-1 rounded-full">
                  In Stock (Ready to dispatch)
                </span>
              )}
            </div>
          </div>

          {/* Core metadata: Publication date & ISBN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-card-bg rounded-xl border border-subtle-border">
              <span className="block text-[10px] font-semibold text-[#C5A059] uppercase tracking-wider">
                Publication Date
              </span>
              <span id="detail-pub-date" className="text-sm font-semibold text-white block mt-1">
                {book.publicationDate || 'June 19, 2026'}
              </span>
            </div>
            <div className="p-3.5 bg-card-bg rounded-xl border border-subtle-border">
              <span className="block text-[10px] font-semibold text-[#C5A059] uppercase tracking-wider">
                ISBN Code
              </span>
              <span className="text-sm font-mono text-white block mt-1 font-bold">
                {book.ISBN}
              </span>
            </div>
            <div className="p-3.5 bg-card-bg rounded-xl border border-subtle-border">
              <span className="block text-[10px] font-semibold text-[#C5A059] uppercase tracking-wider">
                Catalog Format
              </span>
              <span className="text-sm font-semibold text-white block mt-1">
                Hardcover Edition
              </span>
            </div>
          </div>

          {/* Rich Short Summary section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase text-[#C5A059] tracking-wider flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              Short Summary
            </h3>
            <p id="detail-short-summary" className="text-zinc-300 text-sm italic leading-relaxed bg-card-dark p-4 rounded-xl border border-subtle-border border-dashed">
              "{book.summary || 'A rare composition containing brilliant insights into its respective field.'}"
            </p>
          </div>

          {/* Overview description text */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase text-[#C5A059] tracking-wider">
              Bibliophile Description
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
              {book.description}
            </p>
          </div>

          {/* Add-to-cart controls Row */}
          {book.stock > 0 && (
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 max-w-md">
              {/* Stepper Counter */}
              <div className="flex items-center border border-subtle-border rounded-xl bg-card-dark p-1 shrink-0 w-full sm:w-auto justify-between">
                <button
                  id="stepper-decrement-btn"
                  onClick={() => setQty(prev => Math.max(1, prev - 1))}
                  className="font-bold h-9 w-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-card-light rounded-lg transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="font-semibold text-sm w-12 text-center text-white font-mono">
                  {qty}
                </span>
                <button
                  id="stepper-increment-btn"
                  onClick={() => setQty(prev => Math.min(book.stock, prev + 1))}
                  className="font-bold h-9 w-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-card-light rounded-lg transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Action purchase trigger */}
              <button
                id="details-add-to-cart-btn"
                onClick={handleAddToCart}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-gold hover:bg-accent-gold-hover text-black font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
              >
                <ShoppingCart className="h-4 w-4" />
                Add {qty} {qty === 1 ? 'item' : 'items'} to Cart
              </button>
            </div>
          )}

          {/* PDF Metadata Extractor Zone */}
          <div className="mt-4 p-5 rounded-2xl border border-dashed border-subtle-border bg-card-bg/25 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent-gold shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">PDF Intelligence Scan</h4>
                  <p className="text-[11px] text-zinc-405 mt-0.5">Parse cover pages or introductory sections to auto-fetch details from a local PDF file.</p>
                </div>
              </div>
            </div>

            {/* Drag and drop area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                dragActive 
                  ? 'border-accent-gold bg-accent-gold/5' 
                  : 'border-subtle-border bg-card-dark hover:border-zinc-700'
              }`}
              onClick={() => document.getElementById("pdf-file-selector").click()}
            >
              <input
                id="pdf-file-selector"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              
              {isExtracting ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <RefreshCw className="h-8 w-8 text-accent-gold animate-spin" />
                  <span className="text-xs font-semibold text-white">Gemini Extracting Bibliographics...</span>
                  <span className="text-[10px] text-zinc-400">Decompressing and parsing layout sheets</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-1">
                  <UploadCloud className="h-8 w-8 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">
                    Drag & Drop PDF or <span className="text-accent-gold underline">Browse file</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">Supports standard compiled PDF documents</span>
                </div>
              )}
            </div>
          </div>

          {/* Admin panel Shortcut link */}
          {user && user.role === 'admin' && (
            <div className="p-4 rounded-xl border border-subtle-border bg-card-bg flex items-center justify-between gap-4 max-w-3xl mt-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-accent-gold shrink-0" />
                <span className="text-xs font-semibold text-zinc-300">
                  Authorized Admin Profile: Modify prices or inventory status inside dashboard.
                </span>
              </div>
              <Link
                id="admin-dashboard-link"
                to="/admin"
                className="text-xs bg-accent-gold hover:bg-accent-gold-hover text-black font-bold px-3 py-2 rounded-lg transition-all shadow"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Aesthetic service metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-accent-gold shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-semibold">Premium Courier</h4>
            <p className="text-xs text-zinc-400 mt-1">Insured parcel dispatch with tracking coordinates sent directly.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Award className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-semibold">Pristine Grading</h4>
            <p className="text-xs text-zinc-400 mt-1">Guaranteed authentic first-edition standard prints with archival wrappers.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <BadgeInfo className="h-5 w-5 text-accent-gold shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-semibold">Full Return Policy</h4>
            <p className="text-xs text-zinc-400 mt-1">Full protection policy on any transit scuffs and returns processing.</p>
          </div>
        </div>
      </section>

    </motion.div>
  );
}
