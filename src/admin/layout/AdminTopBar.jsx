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

export function AdminTopBar({ screen, session, onSignOut }) {
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
      padding: '0 24px',
      zIndex: 20,
      gap: 16,
    }}>
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

      <div style={{ flex: 1, fontSize: 16, fontWeight: 700, color: AT.ink, letterSpacing: '-0.01em' }}>
        {SCREEN_TITLES[screen] ?? screen}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {email && (
          <span style={{ fontSize: 13, color: AT.muted, fontWeight: 500 }}>
            {email}
          </span>
        )}
        <button
          onClick={onSignOut}
          style={{
            padding: '7px 16px',
            background: 'transparent',
            border: `1.5px solid ${AT.border}`,
            borderRadius: AT.radius,
            fontSize: 13,
            fontWeight: 600,
            color: AT.inkLight,
            fontFamily: 'Manrope, sans-serif',
            cursor: 'pointer',
            transition: 'border-color 0.12s, color 0.12s',
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
