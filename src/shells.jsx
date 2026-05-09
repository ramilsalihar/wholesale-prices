import React from 'react';
import { useTheme } from './shared/theme.jsx';
import { useRouter, RouterProvider } from './shared/router.jsx';
import { useCart, CartProvider } from './features/cart.jsx';
import { CATEGORIES } from './entities/category/model.js';
import { Icon } from './shared/ui/Icon.jsx';
import { Logo } from './shared/ui/Logo.jsx';
import { SearchField } from './shared/ui/SearchField.jsx';
import { MobileHeader } from './widgets/MobileHeader.jsx';
import { MobileTabBar } from './widgets/MobileTabBar.jsx';
import { HomeScreen } from './pages/home.jsx';
import { CatalogScreen } from './pages/catalog.jsx';
import { PDPScreen } from './pages/pdp.jsx';
import { CartScreen } from './pages/cart.jsx';
import { CheckoutScreen } from './pages/checkout.jsx';
import { OrderDoneScreen } from './pages/order-done.jsx';
import { IOSDevice, IOSStatusBar } from './IOSFrame.jsx';
import { ChromeWindow } from './BrowserWindow.jsx';

export const DEVICE_W = 390;
export const DEVICE_H = 844;
export const DESKTOP_W = 1280;
export const DESKTOP_H = 820;

// ── Mobile shell ───────────────────────────────────────────────
export function MobileShell() {
  const t = useTheme();
  const router = useRouter();
  const { screen } = router.route;

  const headerCfg = {
    home:       { title: null,         showBack: false, hideHeader: false },
    catalog:    { title: 'Каталог',    showBack: true,  hideHeader: false },
    pdp:        { title: 'Товар',      showBack: true,  hideHeader: false },
    cart:       { title: 'Корзина',    showBack: true,  hideHeader: false },
    checkout:   { title: 'Оформление', showBack: true,  hideHeader: false },
    order_done: { title: null,         showBack: false,  hideHeader: true },
  }[screen] || { title: null, showBack: false };

  const showTabBar = !['checkout', 'order_done'].includes(screen);

  let content;
  if (screen === 'home')        content = <HomeScreen device="mobile" />;
  else if (screen === 'catalog') content = <CatalogScreen device="mobile" />;
  else if (screen === 'pdp')     content = <PDPScreen device="mobile" />;
  else if (screen === 'cart')    content = <CartScreen device="mobile" />;
  else if (screen === 'checkout') content = <CheckoutScreen device="mobile" />;
  else if (screen === 'order_done') content = <OrderDoneScreen device="mobile" />;

  const isDark = t.headerBg !== '#FFFFFF';

  return (
    <IOSDevice width={DEVICE_W} height={DEVICE_H} dark={false}>
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        background: t.bg, color: t.ink,
        fontFamily: 'inherit', overflow: 'hidden',
      }}>
        <IOSStatusBar dark={isDark} />
        {!headerCfg.hideHeader && <MobileHeader title={headerCfg.title} showBack={headerCfg.showBack} />}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
          {content}
        </div>
        {showTabBar && <MobileTabBar />}
      </div>
    </IOSDevice>
  );
}

export function MobileApp({ initial }) {
  return (
    <CartProvider>
      <RouterProvider initial={initial}>
        <MobileShell />
      </RouterProvider>
    </CartProvider>
  );
}

export function MobileAppWithSeed({ initial, seed }) {
  return (
    <CartProvider>
      <RouterProvider initial={initial}>
        <SeedCart ids={seed} />
        <MobileShell />
      </RouterProvider>
    </CartProvider>
  );
}

// ── Desktop shell ──────────────────────────────────────────────
export function DesktopShell() {
  const t = useTheme();
  const router = useRouter();
  const { screen } = router.route;

  let content;
  if (screen === 'home')         content = <HomeScreen device="desktop" />;
  else if (screen === 'catalog') content = <CatalogScreen device="desktop" />;
  else if (screen === 'pdp')     content = <PDPScreen device="desktop" />;
  else if (screen === 'cart')    content = <CartScreen device="desktop" />;
  else if (screen === 'checkout') content = <CheckoutScreen device="desktop" />;
  else if (screen === 'order_done') content = <OrderDoneScreen device="desktop" />;

  const url = ({
    home: 'optcen.ru',
    catalog: 'optcen.ru/catalog',
    pdp: 'optcen.ru/p/' + (router.route.id || ''),
    cart: 'optcen.ru/cart',
    checkout: 'optcen.ru/checkout',
    order_done: 'optcen.ru/order/thanks',
  })[screen] || 'optcen.ru';

  return (
    <ChromeWindow
      width={DESKTOP_W} height={DESKTOP_H}
      url={url}
      tabs={[{ title: 'Оптовые Цены — косметика по выгодным ценам' }]}
    >
      <div style={{ width: '100%', height: '100%', overflow: 'auto', background: t.bg, color: t.ink, fontFamily: 'inherit' }}>
        <DesktopHeader />
        {content}
      </div>
    </ChromeWindow>
  );
}

export function DesktopApp({ initial }) {
  return (
    <CartProvider>
      <RouterProvider initial={initial}>
        <DesktopShell />
      </RouterProvider>
    </CartProvider>
  );
}

export function DesktopAppWithSeed({ initial, seed }) {
  return (
    <CartProvider>
      <RouterProvider initial={initial}>
        <SeedCart ids={seed} />
        <DesktopShell />
      </RouterProvider>
    </CartProvider>
  );
}

// ── Desktop site header ────────────────────────────────────────
function DesktopHeader() {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();
  return (
    <div style={{ background: t.headerBg, color: t.headerInk, borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 20 }}>
      <div style={{ padding: '14px 40px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <div onClick={() => router.go({ screen: 'home' })} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', flexShrink: 0 }}>
          <Logo size={48} />
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: '0.04em', lineHeight: 1 }}>ОПТОВЫЕ ЦЕНЫ</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 3, letterSpacing: '0.04em' }}>выбор · косметика · доставка</div>
          </div>
        </div>

        <button onClick={() => router.go({ screen: 'catalog' })} style={{
          background: t.primary, color: '#fff', border: 'none', cursor: 'pointer',
          padding: '12px 22px', borderRadius: 12, fontWeight: 800, fontSize: 14,
          display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', letterSpacing: '0.02em',
        }}>
          {Icon.menu()} Каталог
        </button>

        <div style={{ flex: 1, maxWidth: 640 }}>
          <div style={{
            background: '#fff', color: '#1A0A14', borderRadius: 12, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10, boxShadow: `0 0 0 2px ${t.accent}`,
          }}>
            <span style={{ color: '#7A6A72', display: 'flex' }}>{Icon.search()}</span>
            <input placeholder="Шампунь, тушь, крем для лица…" style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 14,
              background: 'transparent', color: '#1A0A14', fontFamily: 'inherit',
            }} />
            <button onClick={() => router.go({ screen: 'catalog' })} style={{
              background: t.primary, color: '#fff', border: 'none', cursor: 'pointer',
              padding: '6px 14px', borderRadius: 8, fontWeight: 800, fontSize: 13, fontFamily: 'inherit',
            }}>Найти</button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <HeaderIconBtn icon={Icon.user()} label="Войти" />
          <HeaderIconBtn icon={Icon.heart()} label="Избранное" />
          <HeaderIconBtn icon={Icon.cart()} label={`Корзина · ${cart.count}`} highlight={cart.count > 0}
            onClick={() => router.go({ screen: 'cart' })} />
        </div>
      </div>

      <div style={{ padding: '0 40px 12px', display: 'flex', gap: 20, overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center' }}>
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => router.go({ screen: 'catalog', cat: c.id })} style={{
            background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit',
            fontSize: 13, fontWeight: 700, padding: '4px 0', whiteSpace: 'nowrap',
            display: 'inline-flex', alignItems: 'center', gap: 6, opacity: 0.95, fontFamily: 'inherit',
          }}>
            <span>{c.emoji}</span>{c.ru}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, opacity: 0.85, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {Icon.truck({ width: 14, height: 14 })} Доставка завтра по Москве
        </span>
      </div>
    </div>
  );
}

function HeaderIconBtn({ icon, label, highlight, onClick }) {
  const t = useTheme();
  return (
    <button onClick={onClick} style={{
      background: highlight ? t.accent : 'transparent',
      color: highlight ? '#1A0A14' : 'inherit',
      border: 'none', cursor: 'pointer',
      padding: '8px 12px', borderRadius: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      fontFamily: 'inherit', minWidth: 76,
    }}>
      {icon}
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.02em' }}>{label}</span>
    </button>
  );
}

// ── Cart seeder ────────────────────────────────────────────────
function SeedCart({ ids }) {
  const cart = useCart();
  const seeded = React.useRef(false);
  React.useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    ids.forEach((id, i) => cart.add(id, i === 1 ? 2 : 1));
  }, []);
  return null;
}
