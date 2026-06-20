import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'info',
  children
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div id="modal-wrapper" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            id="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
          />

          {/* Modal Content Box */}
          <motion.div
            id="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-card-bg rounded-2xl border border-subtle-border shadow-2xl p-6 max-w-md w-full overflow-hidden"
          >
            {/* Header / Title */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                {type === 'danger' && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-955/45 border border-rose-900/50 text-rose-400">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                )}
                <h3 className="serif text-lg font-bold text-white leading-tight">
                  {title}
                </h3>
              </div>
              <button
                id="modal-close-btn"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-card-light text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description/Body message */}
            {message && (
              <p className="text-sm text-zinc-404 leading-relaxed mb-6">
                {message}
              </p>
            )}

            {/* Optional Custom Children Block */}
            {children && <div className="mb-6">{children}</div>}

            {/* Actions Buttons Footer */}
            <div className="flex items-center justify-end gap-2 px-1">
              <button
                id="modal-cancel-btn"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white bg-card-dark hover:bg-card-light border border-subtle-border rounded-xl transition-all cursor-pointer"
              >
                {cancelLabel}
              </button>
              {onConfirm && (
                <button
                  id="modal-confirm-btn"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-4 py-2 text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer ${
                    type === 'danger'
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-accent-gold hover:bg-accent-gold-hover text-black'
                  }`}
                >
                  {confirmLabel}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
