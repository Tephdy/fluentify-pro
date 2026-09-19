'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications, AppNotification } from '@/lib/notification-context';

// ⬇️ NEW: accept an optional callback prop
export function NotificationBell({
  onNotificationClick,
}: {
  onNotificationClick?: (notification: AppNotification) => void;
} = {}) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleClick = async (n: AppNotification) => {
    if (!n.is_read) {
      await markAsRead(n.id);
    }

    // ⬇️ NEW: delegate to parent if provided
    if (onNotificationClick) {
      onNotificationClick(n);
    } else if (n.link && !n.link.startsWith('#')) {
      // Only navigate for non-anchor links, avoid reload for `#...` anchors
      window.location.href = n.link;
    }

    setIsOpen(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all border"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-xl border bg-slate-900 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-white text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-b flex items-center justify-between text-[11px]">
              <button
                onClick={markAllAsRead}
                className="font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                ✓ Mark all read
              </button>
              <button
                onClick={clearAll}
                className="font-bold text-slate-400 hover:text-rose-400 flex items-center gap-1.5"
              >
                🗑 Clear all
              </button>
            </div>
          )}

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left p-4 border-b last:border-b-0 transition hover:bg-slate-800/50 ${
                    !n.is_read ? 'bg-slate-800/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-lg">🎯</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-white leading-snug">
                          {n.title}
                        </p>
                        {!n.is_read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        )}
                      </div>
                      {n.message && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                          {n.message}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                        <span>Just now</span>
                        <span>·</span>
                        <span className="text-emerald-400 font-bold">View →</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t text-center text-[10px] text-slate-500">
              Showing {notifications.length} of latest
            </div>
          )}
        </div>
      )}
    </div>
  );
}