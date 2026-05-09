import React from 'react';
import { AT } from '../adminTheme.js';

const NAV = [
  {
    key: 'dashboard',
    label: 'Дашборд',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    key: 'orders',
    label: 'Заказы',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="2" />
        <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
  {
    key: 'products',
    label: 'Товары',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    key: 'categories',
    label: 'Категории',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    key: 'banners',
    label: 'Баннеры',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    key: 'stores',
    label: 'Магазины',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    key: 'settings',
    label: 'Настройки',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export function AdminSidebar({ screen, go, mobile, drawerOpen }) {
  const visible = !mobile || drawerOpen;

  return (
    <aside style={{
      position: 'fixed',
      top: AT.topbarH,
      left: 0,
      bottom: 0,
      width: AT.sidebarW,
      background: AT.surface,
      borderRight: `1px solid ${AT.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      zIndex: 16,
      transform: visible ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.22s ease',
      boxShadow: mobile && drawerOpen ? '4px 0 24px rgba(0,0,0,0.12)' : 'none',
    }}>
      {mobile && (
        <div style={{
          padding: '16px 16px 8px',
          fontSize: 15,
          fontWeight: 800,
          color: AT.primary,
          letterSpacing: '-0.02em',
          borderBottom: `1px solid ${AT.border}`,
          marginBottom: 4,
        }}>
          Оптовые Цены
        </div>
      )}

      <nav style={{ padding: '12px 8px', flex: 1 }}>
        {NAV.map(item => {
          const active = screen === item.key;
          return (
            <button
              key={item.key}
              onClick={() => go(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 12px',
                borderRadius: AT.radius,
                border: 'none',
                background: active ? AT.primaryBg : 'transparent',
                color: active ? AT.primary : AT.inkLight,
                fontFamily: 'Manrope, sans-serif',
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: 2,
                transition: 'background 0.12s, color 0.12s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = AT.surfaceAlt; e.currentTarget.style.color = AT.ink; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = AT.inkLight; } }}
            >
              <span style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{
        padding: '12px 16px',
        borderTop: `1px solid ${AT.border}`,
        fontSize: 11,
        color: AT.muted,
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}>
        ОПТОВЫЕ ЦЕНЫ · ADMIN
      </div>
    </aside>
  );
}
