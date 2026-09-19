'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================
export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'achievement'
  | 'announcement';

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  link: string | null;
  icon: string;
  is_read: boolean;
  read_at: string | null;
  metadata: Record<string, any> | null;   // ⬅️ UPDATED: DB allows null
  created_at: string;
}

export interface CreateNotificationPayload {
  user_id: string;
  type?: NotificationType;
  title: string;
  message?: string;
  link?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

// ⬅️ NEW: payload type for batch inserts (broadcast)
export interface CreateNotificationBatchPayload {
  user_ids: string[];
  type?: NotificationType;
  title: string;
  message?: string;
  link?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  createNotification: (payload: CreateNotificationPayload) => Promise<AppNotification | null>;
  createNotificationBatch: (payload: CreateNotificationBatchPayload) => Promise<number>;   // ⬅️ NEW
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// ============================================
// PROVIDER
// ============================================
export function NotificationProvider({
  userId,
  children,
}: {
  userId: string | null;
  children: ReactNode;
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FETCH
  // ============================================
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // ⬅️ UPDATED: normalize metadata null → {}
      const normalized: AppNotification[] = ((data as AppNotification[]) || []).map((n) => ({
        ...n,
        metadata: n.metadata ?? {},
      }));

      setNotifications(normalized);
    } catch (err: any) {
      console.error('Error fetching notifications:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ============================================
  // CREATE (single)
  // ============================================
  const createNotification = useCallback(
    async (payload: CreateNotificationPayload): Promise<AppNotification | null> => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .insert([
            {
              user_id: payload.user_id,
              type: payload.type || 'info',
              title: payload.title,
              message: payload.message || null,
              link: payload.link || null,
              icon: payload.icon || 'bell',
              metadata: payload.metadata || {},
            },
          ])
          .select()
          .single();

        if (error) throw error;

        const inserted = {
          ...(data as AppNotification),
          metadata: (data as AppNotification).metadata ?? {},
        };

        // ⬅️ NEW: Optimistically merge into local state if it's for this user
        if (userId && inserted.user_id === userId) {
          setNotifications((prev) =>
            prev.some((n) => n.id === inserted.id) ? prev : [inserted, ...prev]
          );
        }

        return inserted;
      } catch (err: any) {
        console.error('Error creating notification:', err.message);
        setError(err.message);
        return null;
      }
    },
    [userId]
  );

  // ============================================
  // CREATE BATCH — used by admin broadcast
  // ⬅️ NEW
  // ============================================
  const createNotificationBatch = useCallback(
    async (payload: CreateNotificationBatchPayload): Promise<number> => {
      if (!payload.user_ids || payload.user_ids.length === 0) return 0;

      try {
        const rows = payload.user_ids.map((uid) => ({
          user_id: uid,
          type: payload.type || 'info',
          title: payload.title,
          message: payload.message || null,
          link: payload.link || null,
          icon: payload.icon || 'bell',
          metadata: payload.metadata || {},
        }));

        const { data, error } = await supabase
          .from('notifications')
          .insert(rows)
          .select();

        if (error) throw error;

        const inserted = ((data as AppNotification[]) || []).map((n) => ({
          ...n,
          metadata: n.metadata ?? {},
        }));

        // Merge any rows that belong to the current signed-in user
        if (userId) {
          const mine = inserted.filter((n) => n.user_id === userId);
          if (mine.length > 0) {
            setNotifications((prev) => {
              const existingIds = new Set(prev.map((n) => n.id));
              const fresh = mine.filter((n) => !existingIds.has(n.id));
              return [...fresh, ...prev];
            });
          }
        }

        return inserted.length;
      } catch (err: any) {
        console.error('Error creating notification batch:', err.message);
        setError(err.message);
        return 0;
      }
    },
    [userId]
  );

  // ============================================
  // MARK ONE AS READ
  // ============================================
  const markAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        )
      );

      try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
      } catch (err: any) {
        console.error('Error marking as read:', err.message);
        await fetchNotifications();
      }
    },
    [fetchNotifications]
  );

  // ============================================
  // MARK ALL AS READ
  // ============================================
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
    );

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error marking all as read:', err.message);
      await fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  // ============================================
  // DELETE ONE
  // ============================================
  const deleteNotification = useCallback(
    async (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      try {
        const { error } = await supabase.from('notifications').delete().eq('id', id);
        if (error) throw error;
      } catch (err: any) {
        console.error('Error deleting notification:', err.message);
        await fetchNotifications();
      }
    },
    [fetchNotifications]
  );

  // ============================================
  // CLEAR ALL
  // ============================================
  const clearAll = useCallback(async () => {
    if (!userId) return;

    setNotifications([]);

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error clearing notifications:', err.message);
      await fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  // ============================================
  // INITIAL LOAD + RE-FETCH ON USER CHANGE
  // ============================================
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ============================================
  // REALTIME SUBSCRIPTION
  // ============================================
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          const newNotif = {
            ...(payload.new as AppNotification),
            metadata: (payload.new as AppNotification).metadata ?? {},
          };
          // ⬅️ UPDATED: dedupe — avoid double-adding if optimistic insert already ran
          setNotifications((prev) =>
            prev.some((n) => n.id === newNotif.id) ? prev : [newNotif, ...prev]
          );
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          const updated = {
            ...(payload.new as AppNotification),
            metadata: (payload.new as AppNotification).metadata ?? {},
          };
          setNotifications((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          const deleted = payload.old as { id: string };
          setNotifications((prev) => prev.filter((n) => n.id !== deleted.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // ============================================
  // DERIVED STATE
  // ============================================
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    createNotification,
    createNotificationBatch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return ctx;
}