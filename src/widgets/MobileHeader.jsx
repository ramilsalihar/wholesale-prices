import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useCart } from '../features/cart.jsx';
import { Icon } from '../shared/ui/Icon.jsx';
import { Logo } from '../shared/ui/Logo.jsx';

export function MobileHeader({ title, showBack = false }) {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();
  return (
    <div style={{
      background: t.headerBg, color: t.headerInk,
      padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: `1px solid ${t.border}`, position: 'sticky', top: 0, zIndex: 10,
      flexShrink: 0,
    }}>
      {showBack ? (
        <button onClick={() => router.back()} style={{
          background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
          width: 36, height: 36, borderRadius: '50%', color: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icon.back()}</button>
      ) : (
        <Logo size={36} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? (
          <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.02em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        ) : (
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: '0.06em' }}>ОПТОВЫЕ ЦЕНЫ</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: -1 }}>выбор · косметика · доставка от 1 дня</div>
          </div>
        )}
      </div>
      <button onClick={() => router.go({ screen: 'cart' })} style={{
        background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
        width: 40, height: 40, borderRadius: '50%', color: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        {Icon.cart()}
        {cart.count > 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            minWidth: 20, height: 20, padding: '0 5px',
            borderRadius: 10, background: t.accent, color: '#1A0A14',
            fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}>{cart.count}</span>
        )}
      </button>
    </div>
  );
}
