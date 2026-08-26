import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useCart } from '../features/cart.jsx';
import { useFavorites } from '../features/favorites.jsx';
import { Icon } from '../shared/ui/Icon.jsx';
import { Logo } from '../shared/ui/Logo.jsx';

export function MobileHeader({ title, showBack = false }) {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();
  const favs = useFavorites();
  return (
    <div style={{
      background: t.headerBg, color: t.headerInk,
      padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: `1px solid ${t.border}`, position: 'sticky', top: 0, zIndex: 10,
      flexShrink: 0,
    }}>
      {showBack ? (
        <button onClick={() => router.back()} style={{
          background: t.surfaceAlt, border: `1px solid ${t.border}`, cursor: 'pointer',
          width: 36, height: 36, borderRadius: '50%', color: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icon.back()}</button>
      ) : (
        <Logo size={36} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? (
          <div style={{ fontWeight: 600, fontSize: 16, letterSpacing: '0.02em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        ) : (
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: '0.06em' }}>FLOWO</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: -1 }}>выбор · живые цветы · доставка от 1 часа</div>
          </div>
        )}
      </div>
      <button onClick={() => router.go({ screen: 'favorites' })} style={{
        background: t.surfaceAlt, border: `1px solid ${t.border}`, cursor: 'pointer',
        width: 40, height: 40, borderRadius: '50%', color: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        {Icon.heart({ fill: favs?.count > 0 ? 'currentColor' : 'none' })}
        {favs?.count > 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            minWidth: 20, height: 20, padding: '0 5px',
            borderRadius: 4, background: t.discountBg, color: t.primaryDark,
            fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{favs.count}</span>
        )}
      </button>
      <button onClick={() => router.go({ screen: 'cart' })} style={{
        background: t.surfaceAlt, border: `1px solid ${t.border}`, cursor: 'pointer',
        width: 40, height: 40, borderRadius: '50%', color: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        {Icon.cart()}
        {cart.count > 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            minWidth: 20, height: 20, padding: '0 5px',
            borderRadius: 4, background: t.discountBg, color: t.primaryDark,
            fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{cart.count}</span>
        )}
      </button>
    </div>
  );
}
