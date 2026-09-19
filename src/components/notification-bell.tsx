'use client';

import { useState, useEffect, useRef } from 'react';
import { useNotifications, AppNotification, NotificationType } from '@/lib/notification-context';

// ============================================
// ICONS
// ============================================
function BellIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function XIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TrashIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

// ============================================
// TYPE METADATA
// ============================================
const TYPE_META: Record<NotificationType, { color: string; bg: string; border: string; icon: string }> = {
  info:         { color: 'text-cyan-400',     bg: 'bg-cyan-500/10',     border: 'border-cyan-500/30',     icon: 'ℹ️' },
  success:      { color: 'text-emerald-400',  bg: 'bg-emerald-500/10',  border: 'border-emerald-500/30',  icon: '✅' },
  warning:      { color: 'text-amber-400',    bg: 'bg-amber-500/10',    border: 'border-amber-500/30',    icon: '⚠️' },
  error:        { color: 'text-rose-400',     bg: 'bg-rose-500/10',     border: 'border-rose-500/30',     icon: '❌' },
  achievement:  { color: 'text-violet-400',   bg: 'bg-violet-500/10',   border: 'border-violet-500/30',   icon: '🏆' },
  announcement: { color: 'text-indigo-400',   bg: 'bg-indigo-500/10',   border: 'border-indigo-500/30',   icon: '📢' },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ============================================
// MAIN
// ============================================
export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-950">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-12 sm:top-14 z-[100] w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-black text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <XIcon />
            </button>
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-1.5 font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <CheckIcon />
                Mark all read
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="flex items-center gap-1.5 font-bold text-slate-500 hover:text-rose-400 transition"
              >
                <TrashIcon />
                Clear all
              </button>
            </div>
          )}

          <div className="max-h-[440px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-500 text-xs">
                <div className="flex flex-col items-center gap-3">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="font-bold uppercase tracking-widest">Loading...</span>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4">
                  <BellIcon className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">You're all caught up</p>
                <p className="text-xs text-slate-500 mt-1">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {notifications.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    onMarkRead={() => markAsRead(n.id)}
                    onDelete={() => deleteNotification(n.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-500">
                Showing {notifications.length} of latest
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationRow({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: AppNotification;
  onMarkRead: () => void;
  onDelete: () => void;
}) {
  const meta = TYPE_META[notification.type] || TYPE_META.info;

  const handleClick = () => {
    if (!notification.is_read) onMarkRead();
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <div
      className={`group relative px-4 py-3 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
        notification.is_read ? '' : 'bg-slate-50/50 dark:bg-slate-800/20'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-9 h-9 rounded-xl ${meta.bg} border ${meta.border} flex items-center justify-center text-base`}>
          {meta.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className={`text-sm font-bold truncate ${notification.is_read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
              {notification.title}
            </p>
            {!notification.is_read && (
              <span className="shrink-0 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </div>

          {notification.message && (
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-1.5">
              {notification.message}
            </p>
          )}

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <span>{relativeTime(notification.created_at)}</span>
            {notification.link && (
              <>
                <span>·</span>
                <span className={meta.color}>View →</span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-400 hover:bg-rose-500/10 transition"
          aria-label="Delete notification"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}