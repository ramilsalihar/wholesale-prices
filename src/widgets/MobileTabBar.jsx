import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useAuth } from '../features/auth.jsx';
import { Icon } from '../shared/ui/Icon.jsx';

function PriceTagIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}

function OrdersIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

export function MobileTabBar() {
  const t = useTheme();
  const router = useRouter();
  const { user, openLogin } = useAuth();

  const tabs = [
    { id: 'home',      label: 'Главная',   icon: Icon.menu,   action: () => router.go({ screen: 'home' }) },
    { id: 'catalog',   label: 'Каталог',   icon: Icon.search, action: () => router.go({ screen: 'catalog' }), badge: null },
    {
      id: user ? 'my_orders' : 'profile',
      label: user ? 'Заказы' : 'Войти',
      icon: user ? () => <OrdersIcon /> : Icon.user,
      action: user ? () => router.go({ screen: 'my_orders' }) : openLogin,
    },
    { id: 'pricing', label: 'Тарифы', icon: () => <PriceTagIcon />, action: () => router.go({ screen: 'pricing' }) },
  ];

  const active = router.route.screen;

  return (
    <div style={{
      background: t.surface, borderTop: `1px solid ${t.border}`,
      display: 'flex', padding: '8px 4px 22px', flexShrink: 0, gap: 2,
    }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button key={tab.id} onClick={tab.action} style={{
            flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '6px 4px', color: isActive ? t.primary : t.muted, position: 'relative',
          }}>
            <div style={{ position: 'relative' }}>
              {tab.icon()}
              {tab.badge > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -8,
                  minWidth: 16, height: 16, padding: '0 4px', borderRadius: 4,
                  background: t.discountBg, color: t.primaryDark,
                  fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{tab.badge}</span>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.02em' }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
