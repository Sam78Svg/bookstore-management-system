import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, dismissToast } = useApp();

  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all ${
                isSuccess
                  ? 'bg-[#122b1c]/95 border-emerald-900/40 text-emerald-200'
                  : isError
                  ? 'bg-[#2d1216]/95 border-rose-900/40 text-rose-200'
                  : 'bg-card-bg/95 border-subtle-border text-white'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : isError ? (
                  <AlertCircle className="h-5 w-5 text-rose-400" />
                ) : (
                  <Info className="h-5 w-5 text-accent-gold" />
                )}
              </div>
              <div className="flex-1 text-sm font-medium pr-1 whitespace-pre-line leading-snug">
                {t.message}
              </div>
              <button
                id={`dismiss-toast-${t.id}`}
                onClick={() => dismissToast(t.id)}
                className="shrink-0 text-zinc-400 hover:text-white rounded-lg p-0.5 transition-colors focus:ring-1 focus:ring-accent-gold focus:outline-none cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
