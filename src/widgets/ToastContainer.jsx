import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useNotification } from '../features/notification.jsx';

export function ToastContainer() {
  const t = useTheme();
  const notify = useNotification();
  if (!notify || notify.toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none',
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
