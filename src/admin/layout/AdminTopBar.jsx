import React from 'react';
import { AT } from '../adminTheme.js';

const SCREEN_TITLES = {
  dashboard: 'Дашборд',
  orders: 'Заказы',
  products: 'Товары',
  categories: 'Категории',
  banners: 'Баннеры',
  stores: 'Магазины',
  settings: 'Настройки',
};

function HamburgerIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      {open
        ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
        : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
      }
    </svg>
  );
}

export function AdminTopBar({ screen, session, onSignOut, mobile, drawerOpen, onToggleDrawer }) {
  const email = session?.user?.email ?? '';

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: AT.topbarH,
      background: AT.surface,
      borderBottom: `1px solid ${AT.border}`,
      display: 'flex',
      alignItems: 'center',
      padding: mobile ? '0 16px' : '0 24px',
      zIndex: 20,
      gap: 12,
    }}>
      {mobile ? (
        <button
          onClick={onToggleDrawer}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            border: 'none',
            background: 'transparent',
            color: AT.ink,
            cursor: 'pointer',
            borderRadius: AT.radius,
            flexShrink: 0,
          }}
        >
          <HamburgerIcon open={drawerOpen} />
        </button>
      ) : (
        <div style={{
          width: AT.sidebarW - 24,
          flexShrink: 0,
          fontSize: 16,
          fontWeight: 800,
          color: AT.primary,
          letterSpacing: '-0.02em',
        }}>
          Оптовые Цены
        </div>
      )}

      <div style={{ flex: 1, fontSize: mobile ? 15 : 16, fontWeight: 700, color: AT.ink, letterSpacing: '-0.01em' }}>
        {SCREEN_TITLES[screen] ?? screen}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {!mobile && email && (
          <span style={{ fontSize: 13, color: AT.muted, fontWeight: 500 }}>
            {email}
          </span>
        )}
        <button
          onClick={onSignOut}
          style={{
            padding: mobile ? '6px 12px' : '7px 16px',
            background: 'transparent',
            border: `1.5px solid ${AT.border}`,
            borderRadius: AT.radius,
            fontSize: 13,
            fontWeight: 600,
            color: AT.inkLight,
            fontFamily: 'Manrope, sans-serif',
            cursor: 'pointer',
            transition: 'border-color 0.12s, color 0.12s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = AT.danger; e.currentTarget.style.color = AT.danger; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = AT.border; e.currentTarget.style.color = AT.inkLight; }}
        >
          Выйти
        </button>
      </div>
    </header>
  );
}
