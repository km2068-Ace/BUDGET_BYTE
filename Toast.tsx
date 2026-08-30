import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-16 right-4 z-50 max-w-md pointer-events-none"
        >
          <div
            className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 ${
              toast.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/60 text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.25)]'
                : toast.type === 'alert'
                ? 'bg-slate-900/95 border-amber-500/60 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.25)]'
                : 'bg-slate-900/95 border-violet-500/60 text-violet-300 shadow-[0_0_25px_rgba(139,92,246,0.25)]'
            }`}
          >
            <div
              className={`p-2 rounded-xl flex-shrink-0 ${
                toast.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : toast.type === 'alert'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-violet-500/20 text-violet-400'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : toast.type === 'alert' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>

            <p className="text-xs font-semibold text-white leading-snug">{toast.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
