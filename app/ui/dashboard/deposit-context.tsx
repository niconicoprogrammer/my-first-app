'use client';

import { createContext, useContext, useState } from 'react';

export const DepositContext = createContext<{
  deposited: boolean;
  notifyDeposit: () => void;
  closeDepositNotification: () => void; // ← 追加
}>({
  deposited: false,
  notifyDeposit: () => {},
  closeDepositNotification: () => {}, // ← 追加
});

export function DepositProvider({ children }: { children: React.ReactNode }) {
  const [deposited, setDeposited] = useState(false);

  const notifyDeposit = () => {
    setDeposited(true);
    setTimeout(() => setDeposited(false), 10000);
  };

  const closeDepositNotification = () => {
    setDeposited(false); // ← 手動で閉じたいときに使う
  };

  return (
    <DepositContext.Provider value={{ deposited, notifyDeposit, closeDepositNotification }}>
      {children}
    </DepositContext.Provider>
  );
}

export const useDeposit = () => useContext(DepositContext);
