import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useCart } from '../features/cart.jsx';
import { useAuth } from '../features/auth.jsx';
import { Icon } from '../shared/ui/Icon.jsx';

function UserChip({ t, user, onClick }) {
  const avatar = user?.user_metadata?.avatar_url;
  const name = user?.user_metadata?.full_name || user?.email || '';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: t.surfaceAlt, borderRadius: 12, padding: '6px 12px 6px 8px',
        border: `1.5px solid ${t.border}`, cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {user ? (
        avatar ? (
          <img src={avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        ) : (
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: t.primary, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 800, flexShrink: 0,
          }}>
            {initials}
          </div>
        )
      ) : (
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: t.primary, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {Icon.user({ width: 14, height: 14 })}
        </div>
      )}
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, lineHeight: 1 }}>
          {user ? 'Профиль' : 'Войти'}
        </div>
        <div style={{ fontSize: 12, fontWeight: 800, color: t.ink, lineHeight: 1.2, marginTop: 2, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user ? (name.split(' ')[0] || 'Пользователь') : 'Бишкек'}
        </div>
      </div>
    </button>
  );
}

export function TopBar() {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();
  const { user, openLogin } = useAuth();

  const NAV_SCREENS = ['home', 'catalog', 'gifts', 'shops', 'cart', 'favorites', 'pricing'];
  const canGoBack = !NAV_SCREENS.includes(router.route.screen);

  return (
    <div style={{
      background: t.surface, borderBottom: `1px solid ${t.border}`,
      padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16,
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
      {router.route.screen !== 'catalog' && (
        <div
          onClick={() => router.go({ screen: 'catalog', search: true })}
          style={{
            flex: 1, maxWidth: 520,
            background: t.bg, borderRadius: 12, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: `inset 0 0 0 1.5px ${t.border}`, cursor: 'text',
          }}
        >
          <span style={{ color: t.muted, display: 'flex' }}>{Icon.search()}</span>
          <span style={{ flex: 1, fontSize: 14, color: t.muted }}>Поиск цветов, букетов…</span>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {user && (
        <button
          onClick={() => router.go({ screen: 'my_orders' })}
          style={{
            background: router.route.screen === 'my_orders' ? `${t.primary}14` : 'transparent',
            border: `1.5px solid ${router.route.screen === 'my_orders' ? t.primary : t.border}`,
            borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
            fontSize: 13, fontWeight: 700,
            color: router.route.screen === 'my_orders' ? t.primary : t.muted,
            fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          Мои заказы
        </button>
      )}

      <UserChip t={t} user={user} onClick={openLogin} />

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
