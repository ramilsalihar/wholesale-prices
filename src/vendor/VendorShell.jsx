import React, { useState } from 'react';
import { VT } from './vendorTheme.js';

export function VendorShell({
  screen,
  onGoScreen,
  vendor,
  onSignOut,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'dashboard', label: 'Дашборд', icon: '📊' },
    { key: 'products', label: 'Мои букеты', icon: '💐' },
    { key: 'settings', label: 'Профиль магазина', icon: '🏪' },
  ];

  return (
    <div style={{
      minHeight: '100dvh',
      background: VT.bg,
      fontFamily: 'Manrope, sans-serif',
      color: VT.ink,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top Navbar */}
      <header style={{
        background: VT.surface,
        borderBottom: `1px solid ${VT.border}`,
        height: VT.topbarH,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxShadow: VT.shadowSm,
      }}>
        {/* Brand & Store */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🌸</span>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: VT.ink }}>
              FLOWO <span style={{ color: VT.primary, fontWeight: 700, fontSize: 12 }}>Вендор</span>
            </span>
          </div>

          <div style={{
            height: 20,
            width: 1,
            background: VT.border,
            display: 'none',
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 10px',
            background: VT.surfaceAlt,
            borderRadius: 999,
            border: `1px solid ${VT.border}`,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: VT.ink }}>
              {vendor?.name || 'Мой магазин'}
            </span>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: vendor?.status === 'blocked' ? VT.danger : VT.success,
            }} />
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          {navItems.map(item => {
            const active = screen === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onGoScreen(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: VT.radius,
                  border: 'none',
                  background: active ? VT.primaryBg : 'transparent',
                  color: active ? VT.primaryDark : VT.inkLight,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.12s, color 0.12s',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: VT.radius,
              border: `1px solid ${VT.border}`,
              background: VT.surface,
              color: VT.inkLight,
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            ← На сайт Flowo
          </a>

          <button
            onClick={onSignOut}
            title="Выйти из кабинета"
            style={{
              padding: '6px 12px',
              borderRadius: VT.radius,
              border: `1px solid ${VT.border}`,
              background: VT.surfaceAlt,
              color: VT.muted,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Выйти
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        maxWidth: 1200,
        width: '100%',
        margin: '0 auto',
        padding: '24px 20px 48px',
        boxSizing: 'border-box',
      }}>
        {children}
      </main>
    </div>
  );
}
