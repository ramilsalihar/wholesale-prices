import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useCart } from '../features/cart.jsx';
import { Icon } from '../shared/ui/Icon.jsx';

export function TopBar() {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();

  const NAV_SCREENS = ['home', 'catalog', 'gifts', 'cart', 'favorites'];
  const canGoBack = !NAV_SCREENS.includes(router.route.screen);

  return (
    <div style={{
      background: t.surface, borderBottom: `1px solid ${t.border}`,
      padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16,
      position: 'sticky', top: 0, zIndex: 10, flexShrink: 0,
    }}>
      {canGoBack && (
        <button onClick={() => router.back()} style={{
          background: t.surfaceAlt, border: 'none', cursor: 'pointer',
          width: 38, height: 38, borderRadius: 10, color: t.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>{Icon.back()}</button>
      )}
      <div
        onClick={() => router.go({ screen: 'catalog' })}
        style={{
          flex: 1, maxWidth: 520,
          background: t.bg, borderRadius: 12, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: `inset 0 0 0 1.5px ${t.border}`, cursor: 'text',
        }}
      >
        <span style={{ color: t.muted, display: 'flex' }}>{Icon.search()}</span>
        <span style={{ flex: 1, fontSize: 14, color: t.muted }}>Поиск косметики, брендов…</span>
      </div>

      <div style={{ flex: 1 }} />

<div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: t.surfaceAlt, borderRadius: 12, padding: '8px 14px',
      }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: t.muted, fontWeight: 600 }}>Добро пожаловать</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: t.ink }}>Бишкек</div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: t.primary, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {Icon.user({ width: 18, height: 18 })}
        </div>
      </div>

      <button
        onClick={() => router.go({ screen: 'cart' })}
        style={{
          background: cart.count > 0 ? t.primary : t.surfaceAlt,
          color: cart.count > 0 ? '#fff' : t.ink,
          border: 'none', cursor: 'pointer', borderRadius: 12,
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'inherit', fontWeight: 700, fontSize: 13, flexShrink: 0,
        }}
      >
        {Icon.cart({ width: 18, height: 18 })}
        {cart.count > 0 ? `${cart.count} товара` : 'Корзина'}
      </button>
    </div>
  );
}
