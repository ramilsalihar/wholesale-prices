import React from 'react';

export const NotificationContext = React.createContext(null);
export const useNotification = () => React.useContext(NotificationContext);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);
  const show = (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { id, msg, type }]);
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 2400);
  };
  return (
    <NotificationContext.Provider value={{ toasts, show }}>
      {children}
    </NotificationContext.Provider>
  );
}
