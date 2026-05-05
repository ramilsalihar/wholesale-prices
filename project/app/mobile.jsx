// Mobile shell — wraps screens in iOS device frame
// Renders the screen body with sticky header + bottom tab bar.

const DEVICE_W = 390;
const DEVICE_H = 844;

function MobileApp({ initial }) {
  return (
    <CartProvider>
      <RouterProvider initial={initial}>
        <MobileShell />
      </RouterProvider>
    </CartProvider>
  );
}

function MobileShell() {
  const t = useTheme();
  const router = useRouter();
  const { screen } = router.route;

  // Title and back-button rules per screen
  const headerCfg = {
    home:        { title: null,            showBack: false, hideHeader: false },
    catalog:     { title: 'Каталог',       showBack: true,  hideHeader: false },
    pdp:         { title: 'Товар',         showBack: true,  hideHeader: false },
    cart:        { title: 'Корзина',       showBack: true,  hideHeader: false },
    checkout:    { title: 'Оформление',    showBack: true,  hideHeader: false },
    order_done:  { title: null,            showBack: false, hideHeader: true  },
  }[screen] || { title: null, showBack: false };

  const showTabBar = !['checkout', 'order_done'].includes(screen);

  let content;
  if (screen === 'home')        content = <HomeScreen device="mobile" />;
  else if (screen === 'catalog') content = <CatalogScreen device="mobile" />;
  else if (screen === 'pdp')     content = <PDPScreen device="mobile" />;
  else if (screen === 'cart')    content = <CartScreen device="mobile" />;
  else if (screen === 'checkout') content = <CheckoutScreen device="mobile" />;
  else if (screen === 'order_done') content = <OrderDoneScreen device="mobile" />;

  return (
    <IOSDevice width={DEVICE_W} height={DEVICE_H} dark={false}>
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        background: t.bg, color: t.ink,
        fontFamily: 'inherit',
        overflow: 'hidden',
      }}>
        <IOSStatusBar dark={isHeaderDark(t)} />
        {!headerCfg.hideHeader && <MobileHeader title={headerCfg.title} showBack={headerCfg.showBack} />}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
          {content}
        </div>
        {showTabBar && <MobileTabBar />}
      </div>
    </IOSDevice>
  );
}

// Status bar should be light-on-dark for dark / carnival headers
function isHeaderDark(t) {
  // Sample the first character of the header bg's lightness — quick heuristic.
  // For our 4 themes: magnit pink → dark bg; noir black → dark; boutique white → light; carnival black → dark.
  return t.headerBg !== '#FFFFFF';
}

Object.assign(window, { MobileApp, MobileShell, DEVICE_W, DEVICE_H });
