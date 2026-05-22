import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useNotification } from '../features/notification.jsx';

export function ToastContainer() {
  const t = useTheme();
  const notify = useNotification();
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < 900);

  React.useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  if (!notify || notify.toasts.length === 0) return null;

  const pos = isMobile
    ? { top: 72, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' }
    : { bottom: 24, right: 24, alignItems: 'flex-end' };

  return (
    <div style={{
      position: 'fixed', zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none',
      ...pos,
    }}>
      {notify.toasts.map((toast) => (
        <div key={toast.id} style={{
          background: toast.type === 'fav' ? t.primary : t.ink,
          color: '#fff', borderRadius: 12,
          padding: '10px 16px', fontSize: 13, fontWeight: 700,
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', gap: 8,
          maxWidth: 280,
        }}>
          <span style={{ fontSize: 16 }}>{toast.type === 'fav' ? '🤍' : '🛒'}</span>
          {toast.msg}
        </div>
      ))}
    </div>
  );
}
