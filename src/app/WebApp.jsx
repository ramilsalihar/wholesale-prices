import React from 'react';
import { ThemeContext, THEMES, useTheme } from '../shared/theme.jsx';
import { RouterProvider, useRouter } from '../shared/router.jsx';
import { CartProvider } from '../features/cart.jsx';
import { FavoritesProvider } from '../features/favorites.jsx';
import { NotificationProvider } from '../features/notification.jsx';
import { DataProvider } from '../features/data.jsx';
import { AuthProvider } from '../features/auth.jsx';
import { MobileHeader } from '../widgets/MobileHeader.jsx';
import { MobileTabBar } from '../widgets/MobileTabBar.jsx';
import { NavSidebar } from '../widgets/NavSidebar.jsx';
import { TopBar } from '../widgets/TopBar.jsx';
import { RightPanel } from '../widgets/RightPanel.jsx';
import { ToastContainer } from '../widgets/ToastContainer.jsx';
import { LoginModal } from '../widgets/LoginModal.jsx';
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
import { MyOrdersScreen } from '../pages/my-orders.jsx';
import { GiftBuilderScreen } from '../pages/gift-builder.jsx';
import { MyGiftsScreen } from '../pages/my-gifts.jsx';
import { ProfileScreen } from '../pages/profile.jsx';
import { PricingScreen } from '../pages/pricing.jsx';

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
  if (screen === 'my_orders')    return <MyOrdersScreen device={device} />;
  if (screen === 'gift_builder') return <GiftBuilderScreen device={device} />;
  if (screen === 'my_gifts')    return <MyGiftsScreen device={device} />;
  if (screen === 'profile')     return <ProfileScreen device={device} />;
  if (screen === 'pricing')     return <PricingScreen device={device} />;
  return <HomeScreen device={device} />;
}

function DesktopShell() {
  const t = useTheme();
  const router = useRouter();
  const vw = useViewportWidth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { screen } = router.route;
  const showRightPanel = false;
  const scrollRef = React.useRef(null);

  React.useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [router.route]);

  return (
    <div style={{
      display: 'flex', minHeight: '100dvh',
      background: t.bg, color: t.ink,
      fontFamily: "'Lora', Georgia, 'Times New Roman', serif",
    }}>
      <NavSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto' }}>
            <ScreenContent screen={screen} device="desktop" />
          </div>
          {showRightPanel && <RightPanel />}
        </div>
      </div>
      <ToastContainer />
      <LoginModal />
    </div>
  );
}

function MobileShell() {
  const t = useTheme();
  const router = useRouter();
  const { screen } = router.route;
  const scrollRef = React.useRef(null);

  React.useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [router.route]);

  const headerCfg = ({
    home:       { title: null,         showBack: false, hide: false },
    catalog:    { title: 'Каталог',    showBack: false, hide: false },
    pdp:        { title: 'Товар',      showBack: true,  hide: false },
    cart:       { title: 'Корзина',    showBack: false, hide: false },
    favorites:  { title: 'Избранное',  showBack: false, hide: false },
    gifts:      { title: 'Подарки',    showBack: false, hide: false },
    about:      { title: 'О нас',       showBack: true,  hide: false },
    shops:      { title: 'Магазины',    showBack: false, hide: false },
    my_orders:  { title: 'Мои заказы', showBack: false, hide: false },
    checkout:     { title: 'Оформление',       showBack: true,  hide: false },
    gift_builder: { title: 'Подарочный набор', showBack: true,  hide: false },
    my_gifts:     { title: 'Мои подарки',      showBack: true,  hide: false },
    profile:      { title: 'Профиль',          showBack: true,  hide: false },
    pricing:      { title: 'Тарифы',           showBack: false, hide: false },
    order_done: { title: null,         showBack: false, hide: true  },
  })[screen] || { title: null, showBack: false, hide: false };

  const showTabBar = !['checkout', 'order_done'].includes(screen);

  return (
    <div style={{
      height: '100dvh', display: 'flex', flexDirection: 'column',
      background: t.bg, color: t.ink,
      fontFamily: "'Lora', Georgia, 'Times New Roman', serif",
      overflow: 'hidden',
    }}>
      {!headerCfg.hide && <MobileHeader title={headerCfg.title} showBack={headerCfg.showBack} />}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', minHeight: 0, WebkitOverflowScrolling: 'touch' }}>
        <ScreenContent screen={screen} device="mobile" />
      </div>
      {showTabBar && <MobileTabBar />}
      <ToastContainer />
      <LoginModal />
    </div>
  );
}

function AppShell() {
  const vw = useViewportWidth();
  return vw < MOBILE_BP ? <MobileShell /> : <DesktopShell />;
}

export default function WebApp() {
  return (
    <ThemeContext.Provider value={THEMES.classical}>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <FavoritesProvider>
              <CartProvider>
                <RouterProvider initial={{ screen: 'home' }}>
                  <AppShell />
                </RouterProvider>
              </CartProvider>
            </FavoritesProvider>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}
