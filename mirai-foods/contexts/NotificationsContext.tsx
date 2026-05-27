import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where, writeBatch, doc } from "firebase/firestore";
import {
  AppNotification,
  createInitialNotifications,
} from "@/constants/notificationsFeed";
import { COLLECTIONS } from "@/constants/firestoreSchema";
import { firebaseAuth, firestoreDb } from "@/lib/firebase";

type NotificationsContextType = {
  notifications: AppNotification[];
  unreadCount: number;
  /** Clears bell badge as soon as the inbox is opened */
  markInboxSeen: () => void;
  /** Marks every notification read (updates card styling) */
  markAllAsRead: () => void;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(
  undefined
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    createInitialNotifications()
  );
  const [inboxSeen, setInboxSeen] = useState(false);
  const [activeUid, setActiveUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(firebaseAuth, (user) => {
      setActiveUid(user?.uid ?? null);
      setInboxSeen(false);

      if (!user) {
        setNotifications(createInitialNotifications());
      }
    });

    return unsubAuth;
  }, []);

  useEffect(() => {
    if (!activeUid) return;

    const notificationsQuery = query(
      collection(firestoreDb, COLLECTIONS.notifications),
      where("userId", "==", activeUid)
    );

    const unsubSnapshot = onSnapshot(notificationsQuery, (snapshot) => {
      const remoteNotifications: AppNotification[] = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data() as {
            id: string;
            productId: string;
            vendor?: string;
            title: string;
            image?: string;
            tag?: string;
            body?: string;
            type: "discount" | "upcoming";
            oldPrice?: number | null;
            newPrice?: number | null;
            read: boolean;
            createdAt: number;
          };

          return {
            id: data.id ?? docSnap.id,
            productId: data.productId ?? "1",
            vendor: data.vendor ?? "LOCAL ARTISAN",
            title: data.title ?? "Fresh update",
            image: data.image ?? "",
            tag: data.tag ?? (data.type === "discount" ? "SPECIAL" : "UPCOMING"),
            note: data.type === "upcoming" ? data.body ?? "Available soon" : undefined,
            isDiscount: data.type === "discount",
            oldPrice: data.oldPrice ?? undefined,
            newPrice: data.newPrice ?? undefined,
            cta: "Notify",
            read: Boolean(data.read),
            createdAt: data.createdAt ?? Date.now(),
          };
        })
        .sort((a, b) => b.createdAt - a.createdAt);

      setNotifications(remoteNotifications);
    });

    return unsubSnapshot;
  }, [activeUid]);

  const unreadCount = useMemo(() => {
    if (inboxSeen) return 0;
    return notifications.filter((n) => !n.read).length;
  }, [inboxSeen, notifications]);

  const markInboxSeen = useCallback(() => {
    setInboxSeen(true);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      if (prev.every((n) => n.read)) return prev;
      return prev.map((n) => ({ ...n, read: true }));
    });

    if (!activeUid) return;

    const unread = notifications.filter((n) => !n.read);
    if (!unread.length) return;

    const batch = writeBatch(firestoreDb);
    for (const item of unread) {
      const ref = doc(firestoreDb, COLLECTIONS.notifications, item.id);
      batch.update(ref, { read: true });
    }
    void batch.commit();
  }, [activeUid, notifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markInboxSeen,
      markAllAsRead,
    }),
    [notifications, unreadCount, markInboxSeen, markAllAsRead]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useAppNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useAppNotifications must be used within NotificationsProvider");
  }
  return ctx;
}
