'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (payload: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (payload: Omit<Toast, 'id'>) => {
      const id = `${Date.now()}-${Math.random()}`;
      const toast: Toast = { id, duration: 4000, ...payload };
      setToasts((prev) => [...prev, toast]);

      if (toast.duration && toast.duration > 0) {
        setTimeout(() => dismissToast(id), toast.duration);
      }
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const TOAST_META: Record<ToastType, { icon: string; accent: string; border: string }> = {
  info:    { icon: 'ℹ️', accent: 'text-cyan-400',    border: 'border-cyan-500/40' },
  success: { icon: '✅', accent: 'text-emerald-400', border: 'border-emerald-500/40' },
  warning: { icon: '⚠️', accent: 'text-amber-400',   border: 'border-amber-500/40' },
  error:   { icon: '❌', accent: 'text-rose-400',    border: 'border-rose-500/40' },
};

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-[360px] max-w-[calc(100vw-3rem)] pointer-events-none">
      {toasts.map((t) => {
        const meta = TOAST_META[t.type];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-2xl border ${meta.border} bg-slate-900 shadow-2xl overflow-hidden animate-slide-in`}
          >
            <div className="flex items-start gap-3 p-4">
              <div className="text-xl shrink-0">{meta.icon}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${meta.accent}`}>{t.title}</p>
                {t.message && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(t.id)}
                className="shrink-0 text-slate-500 hover:text-white transition text-lg leading-none"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}