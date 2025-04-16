'use client';

import { createContext, useContext, useState } from 'react';

export const NotificationContext = createContext<{
  notification: boolean;
  notify: () => void;
  closeNotification: () => void; // ← 追加
}>({
  notification: false,
  notify: () => {},
  closeNotification: () => {}, // ← 追加
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState(false);

  const notify = () => {
    setNotification(true);
    setTimeout(() => setNotification(false), 10000);
  };

  const closeNotification = () => {
    setNotification(false); // ← 手動で閉じたいときに使う
  };

  return (
    <NotificationContext.Provider value={{ notification, notify, closeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
