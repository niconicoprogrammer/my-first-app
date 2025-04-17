'use client';

import { createContext, useContext, useState } from 'react';

type Notification = {
  type: 'success' | 'error' | 'info';
  message: string;
} | null;

export const NotificationContext = createContext<{
  notification: Notification;
  notify: (type: 'success' | 'error' | 'info', message: string) => void;
  closeNotification: () => void; // ← 追加
}>({
  notification: null,
  notify: () => {},
  closeNotification: () => {}, // ← 追加
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<Notification>(null);

  const notify = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 10000);
  };

  const closeNotification = () => {
    setNotification(null); // ✅ 手動でも非表示にできるように
  };

  return (
    <NotificationContext.Provider value={{ notification, notify, closeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
