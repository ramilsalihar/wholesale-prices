import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useCart } from '../features/cart.jsx';
import { useFavorites } from '../features/favorites.jsx';
import { Icon } from '../shared/ui/Icon.jsx';

export function MobileTabBar() {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();
  const favs = useFavorites();
  const tabs = [
    { id: 'home',      label: 'Главная',   icon: Icon.menu,   screen: { screen: 'home' } },
    { id: 'catalog',   label: 'Каталог',   icon: Icon.search, screen: { screen: 'catalog' } },
    { id: 'favorites', label: 'Избранное', icon: Icon.heart,  screen: { screen: 'favorites' }, badge: favs?.count },
    { id: 'cart',      label: 'Корзина',   icon: Icon.cart,   screen: { screen: 'cart' }, badge: cart.count },
    { id: 'me',        label: 'Профиль',   icon: Icon.user,   screen: { screen: 'home' } },
  ];
  const active = router.route.screen;
  return (
    <div style={{
      background: t.surface, borderTop: `1px solid ${t.border}`,
      display: 'flex', padding: '8px 4px 22px', flexShrink: 0, gap: 2,
    }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id || (tab.id === 'home' && active === 'home');
        return (
          <button key={tab.id} onClick={() => router.go(tab.screen)} style={{
            flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '6px 4px', color: isActive ? t.primary : t.muted, position: 'relative',
          }}>
            <div style={{ position: 'relative' }}>
              {tab.icon()}
              {tab.badge > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -8,
                  minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8,
                  background: t.primary, color: '#fff',
                  fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{tab.badge}</span>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.02em' }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
