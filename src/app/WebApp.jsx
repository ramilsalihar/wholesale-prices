import React from 'react';
import { ThemeContext, THEMES, useTheme } from '../shared/theme.jsx';
import { RouterProvider, useRouter } from '../shared/router.jsx';
import { CartProvider } from '../features/cart.jsx';
import { FavoritesProvider } from '../features/favorites.jsx';
import { NotificationProvider } from '../features/notification.jsx';
import { MobileHeader } from '../widgets/MobileHeader.jsx';
import { MobileTabBar } from '../widgets/MobileTabBar.jsx';
import { NavSidebar } from '../widgets/NavSidebar.jsx';
import { TopBar } from '../widgets/TopBar.jsx';
import { RightPanel } from '../widgets/RightPanel.jsx';
import { ToastContainer } from '../widgets/ToastContainer.jsx';
import { ThemeSwitcher, SWATCHES } from '../widgets/ThemeSwitcher.jsx';
import { HomeScreen } from '../pages/home.jsx';
import { CatalogScreen } from '../pages/catalog.jsx';
import { PDPScreen } from '../pages/pdp.jsx';
import { CartScreen } from '../pages/cart.jsx';
import { CheckoutScreen } from '../pages/checkout.jsx';
import { OrderDoneScreen } from '../pages/order-done.jsx';
import { FavoritesScreen } from '../pages/favorites.jsx';
import { GiftsScreen } from '../pages/gifts.jsx';
import { AboutScreen } from '../pages/about.jsx';
import { ShopsScreen } from '../pages/shops.jsx';

const MOBILE_BP = 900;
const HIDE_RIGHT_PANEL_BP = 1280;

function useViewportWidth() {
  const [w, setW] = React.useState(() => window.innerWidth);
  React.useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

function ScreenContent({ screen, device }) {
  if (screen === 'home')       return <HomeScreen device={device} />;
  if (screen === 'catalog')    return <CatalogScreen device={device} />;
  if (screen === 'pdp')        return <PDPScreen device={device} />;
  if (screen === 'cart')       return <CartScreen device={device} />;
  if (screen === 'checkout')   return <CheckoutScreen device={device} />;
  if (screen === 'order_done') return <OrderDoneScreen device={device} />;
  if (screen === 'favorites')  return <FavoritesScreen device={device} />;
  if (screen === 'gifts')      return <GiftsScreen device={device} />;
  if (screen === 'about')      return <AboutScreen device={device} />;
  if (screen === 'shops')      return <ShopsScreen device={device} />;
  return <HomeScreen device={device} />;
}

function DesktopShell({ themeKey, setThemeKey }) {
  const t = useTheme();
  const router = useRouter();
  const vw = useViewportWidth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { screen } = router.route;
  const showRightPanel = ['home', 'catalog'].includes(screen) && vw >= HIDE_RIGHT_PANEL_BP;

  return (
    <div style={{
      display: 'flex', minHeight: '100dvh',
      background: t.bg, color: t.ink,
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <NavSidebar open={sidebarOpen} setOpen={setSidebarOpen} themeKey={themeKey} setThemeKey={setThemeKey} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <ScreenContent screen={screen} device="desktop" />
          </div>
          {showRightPanel && <RightPanel />}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

function MobileShell({ themeKey, setThemeKey }) {
  const t = useTheme();
  const router = useRouter();
  const { screen } = router.route;

  const headerCfg = ({
    home:       { title: null,         showBack: false, hide: false },
    catalog:    { title: 'Каталог',    showBack: false, hide: false },
    pdp:        { title: 'Товар',      showBack: true,  hide: false },
    cart:       { title: 'Корзина',    showBack: false, hide: false },
    favorites:  { title: 'Избранное',  showBack: false, hide: false },
    gifts:      { title: 'Подарки',    showBack: false, hide: false },
    about:      { title: 'О нас',       showBack: true,  hide: false },
    shops:      { title: 'Магазины',    showBack: false, hide: false },
    checkout:   { title: 'Оформление', showBack: true,  hide: false },
    order_done: { title: null,         showBack: false, hide: true  },
  })[screen] || { title: null, showBack: false, hide: false };

  const showTabBar = !['checkout', 'order_done'].includes(screen);

  return (
    <div style={{
      height: '100dvh', display: 'flex', flexDirection: 'column',
      background: t.bg, color: t.ink,
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      overflow: 'hidden',
    }}>
      {!headerCfg.hide && <MobileHeader title={headerCfg.title} showBack={headerCfg.showBack} />}
      {screen === 'home' && (
        <div style={{
          background: t.surface, borderBottom: `1px solid ${t.border}`,
          padding: '5px 16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: t.muted, letterSpacing: '0.06em' }}>ТЕМА</span>
          <div style={{ display: 'flex', gap: 5 }}>
            {SWATCHES.map((s) => (
              <button key={s.key} onClick={() => setThemeKey(s.key)} style={{
                width: 16, height: 16, borderRadius: '50%', border: 'none',
                cursor: 'pointer', padding: 0, background: s.dot,
                boxShadow: s.key === themeKey
                  ? '0 0 0 2px #fff, 0 0 0 3.5px #E6097A'
                  : s.outline ? 'inset 0 0 0 1.5px rgba(0,0,0,0.2)' : 'none',
              }} />
            ))}
          </div>
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, WebkitOverflowScrolling: 'touch' }}>
        <ScreenContent screen={screen} device="mobile" />
      </div>
      {showTabBar && <MobileTabBar />}
      <ToastContainer />
    </div>
  );
}

function AppShell({ themeKey, setThemeKey }) {
  const vw = useViewportWidth();
  return vw < MOBILE_BP
    ? <MobileShell themeKey={themeKey} setThemeKey={setThemeKey} />
    : <DesktopShell themeKey={themeKey} setThemeKey={setThemeKey} />;
}

export default function WebApp() {
  const [themeKey, setThemeKey] = React.useState('magnit');
  return (
    <ThemeContext.Provider value={THEMES[themeKey]}>
      <NotificationProvider>
        <FavoritesProvider>
          <CartProvider>
            <RouterProvider initial={{ screen: 'home' }}>
              <AppShell themeKey={themeKey} setThemeKey={setThemeKey} />
            </RouterProvider>
          </CartProvider>
        </FavoritesProvider>
      </NotificationProvider>
    </ThemeContext.Provider>
  );
}
