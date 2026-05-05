// Shared visual atoms — icons, product images, header/footer, cards.
// All consume `useTheme()` for colors.

// ───────────────────────────────────────────────
// Icons (line, 24×24, currentColor)
// ───────────────────────────────────────────────
const Icon = {
  search: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  ),
  cart: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 4h2l2.4 12.5a2 2 0 0 0 2 1.5h8.2a2 2 0 0 0 2-1.4L22 8H6" />
      <circle cx="9" cy="21" r="1.5" />
      <circle cx="18" cy="21" r="1.5" />
    </svg>
  ),
  user: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  ),
  heart: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20.8 5.6a5.5 5.5 0 0 0-8.8.7 5.5 5.5 0 0 0-8.8-.7 5.7 5.7 0 0 0 0 7.9L12 22.4l8.8-8.9a5.7 5.7 0 0 0 0-7.9z" />
    </svg>
  ),
  back: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  menu: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  ),
  star: (filled = true, p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...p}>
      <polygon points="12 2 15.1 8.6 22 9.5 17 14.4 18.2 21.4 12 18 5.8 21.4 7 14.4 2 9.5 8.9 8.6 12 2" />
    </svg>
  ),
  truck: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="1" y="6" width="13" height="11" rx="1" />
      <path d="M14 9h4l3 4v4h-7" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  ),
  shield: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5l-8-3z" />
    </svg>
  ),
  plus: (p = {}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  minus: (p = {}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  trash: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  check: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  filter: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="3 4 21 4 14 13 14 20 10 22 10 13 3 4" />
    </svg>
  ),
  flame: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2c1 4-2 5-2 8a4 4 0 0 0 8 0c0-1-.4-2-1-3 .5 4-3 5-3 2 0-2 2-3-2-7zM6 14a4 4 0 0 0 8 0c0-2-2-4-2-5-1 1-1 2-2 2-2 0-2-2-2-2-1 1-2 3-2 5z" />
    </svg>
  ),
};

// ───────────────────────────────────────────────
// Logo lockup — uses uploaded avatar
// ───────────────────────────────────────────────
function Logo({ size = 40 }) {
  return (
    <img src="assets/logo.png" alt="Оптовые цены" width={size} height={size}
      style={{ borderRadius: '50%', display: 'block', flexShrink: 0 }} />
  );
}

// ───────────────────────────────────────────────
// Product placeholder image — illustrated bottle/jar/tube on tinted card
// ───────────────────────────────────────────────
function ProductImage({ p, size = 160, padding = 20 }) {
  const [h, s, l] = p.hue;
  const tint = `hsl(${h}, ${s}%, ${l}%)`;
  const tintDark = `hsl(${h}, ${Math.min(s + 5, 100)}%, ${Math.max(l - 25, 25)}%)`;
  const bgFar = `hsl(${h}, ${Math.max(s - 30, 20)}%, 96%)`;
  const bgNear = `hsl(${h}, ${Math.max(s - 20, 25)}%, 90%)`;

  // Different silhouettes
  const Bottle = () => (
    <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%' }}>
      <rect x="42" y="6" width="16" height="14" rx="2" fill={tintDark} />
      <path d="M30 28 Q50 22 70 28 L72 130 Q50 138 28 130 Z" fill={tint} />
      <rect x="32" y="58" width="36" height="32" rx="4" fill="white" opacity="0.9" />
      <text x="50" y="76" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="800" fill={tintDark}>{p.brand.split(' ')[0].toUpperCase()}</text>
      <text x="50" y="86" textAnchor="middle" fontFamily="system-ui" fontSize="6" fill={tintDark}>{p.vol}</text>
      <ellipse cx="40" cy="38" rx="6" ry="14" fill="white" opacity="0.25" />
    </svg>
  );
  const Jar = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="50" cy="22" rx="34" ry="6" fill={tintDark} />
      <rect x="16" y="22" width="68" height="60" fill={tint} />
      <ellipse cx="50" cy="82" rx="34" ry="6" fill={tintDark} opacity="0.6" />
      <rect x="22" y="38" width="56" height="32" rx="3" fill="white" opacity="0.92" />
      <text x="50" y="56" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="800" fill={tintDark}>{p.brand.split(' ')[0].toUpperCase()}</text>
      <text x="50" y="66" textAnchor="middle" fontFamily="system-ui" fontSize="6" fill={tintDark}>{p.vol}</text>
      <ellipse cx="32" cy="34" rx="8" ry="3" fill="white" opacity="0.4" />
    </svg>
  );
  const Tube = () => (
    <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%' }}>
      <path d="M30 14 Q50 6 70 14 L66 124 Q50 132 34 124 Z" fill={tint} />
      <rect x="34" y="124" width="32" height="8" fill={tintDark} />
      <rect x="38" y="40" width="24" height="60" rx="2" fill="white" opacity="0.92" />
      <text x="50" y="62" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="800" fill={tintDark}>{p.brand.split(' ')[0].toUpperCase()}</text>
      <text x="50" y="74" textAnchor="middle" fontFamily="system-ui" fontSize="5" fill={tintDark}>{p.vol}</text>
      <ellipse cx="40" cy="34" rx="4" ry="14" fill="white" opacity="0.3" />
    </svg>
  );
  const Lipstick = () => (
    <svg viewBox="0 0 80 140" style={{ width: '100%', height: '100%' }}>
      <path d="M28 10 L52 10 L48 50 L32 50 Z" fill={tintDark} />
      <rect x="22" y="50" width="36" height="14" fill="#222" />
      <rect x="20" y="64" width="40" height="68" rx="3" fill={tint} />
      <rect x="24" y="80" width="32" height="32" rx="2" fill="white" opacity="0.9" />
      <text x="40" y="96" textAnchor="middle" fontFamily="system-ui" fontSize="7" fontWeight="800" fill={tintDark}>{p.brand.split(' ')[0].toUpperCase()}</text>
      <text x="40" y="106" textAnchor="middle" fontFamily="system-ui" fontSize="5" fill={tintDark}>№643</text>
      <ellipse cx="28" cy="80" rx="3" ry="20" fill="white" opacity="0.3" />
    </svg>
  );
  const Flask = () => (
    <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%' }}>
      <rect x="42" y="6" width="16" height="20" rx="1" fill="#333" />
      <path d="M22 28 L78 28 L82 130 Q50 138 18 130 Z" fill={tint} stroke={tintDark} strokeWidth="1.5" />
      <rect x="30" y="60" width="40" height="36" rx="2" fill="white" opacity="0.95" />
      <text x="50" y="78" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="800" fill={tintDark}>{p.brand.toUpperCase()}</text>
      <text x="50" y="88" textAnchor="middle" fontFamily="system-ui" fontSize="5" fill={tintDark}>{p.vol}</text>
      <rect x="36" y="36" width="6" height="60" fill="white" opacity="0.35" />
    </svg>
  );
  const Stick = () => (
    <svg viewBox="0 0 80 140" style={{ width: '100%', height: '100%' }}>
      <rect x="20" y="6" width="40" height="14" rx="2" fill={tintDark} />
      <rect x="16" y="20" width="48" height="112" rx="6" fill={tint} />
      <rect x="22" y="50" width="36" height="42" rx="2" fill="white" opacity="0.95" />
      <text x="40" y="70" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="800" fill={tintDark}>{p.brand.toUpperCase()}</text>
      <text x="40" y="82" textAnchor="middle" fontFamily="system-ui" fontSize="5" fill={tintDark}>{p.vol}</text>
    </svg>
  );
  const Palette = () => (
    <svg viewBox="0 0 140 100" style={{ width: '100%', height: '100%' }}>
      <rect x="6" y="14" width="128" height="76" rx="6" fill="#1a1a1a" />
      <rect x="6" y="6" width="128" height="14" rx="6" fill={tintDark} />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={20 + (i % 6) * 18} cy={36 + Math.floor(i / 6) * 22} r="7"
          fill={`hsl(${(h + i * 30) % 360}, 70%, ${50 + (i % 3) * 10}%)`} />
      ))}
    </svg>
  );
  const Bar = () => (
    <svg viewBox="0 0 120 100" style={{ width: '100%', height: '100%' }}>
      <rect x="12" y="20" width="96" height="60" rx="10" fill={tint} />
      <rect x="20" y="32" width="80" height="36" rx="4" fill="white" opacity="0.9" />
      <text x="60" y="52" textAnchor="middle" fontFamily="system-ui" fontSize="11" fontWeight="800" fill={tintDark}>{p.brand.toUpperCase()}</text>
      <text x="60" y="64" textAnchor="middle" fontFamily="system-ui" fontSize="6" fill={tintDark}>{p.vol}</text>
    </svg>
  );
  const Spray = () => (
    <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%' }}>
      <rect x="38" y="6" width="24" height="10" fill="#333" />
      <rect x="34" y="16" width="32" height="6" fill={tintDark} />
      <rect x="22" y="22" width="56" height="110" rx="3" fill={tint} />
      <rect x="28" y="50" width="44" height="44" rx="2" fill="white" opacity="0.92" />
      <text x="50" y="70" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="800" fill={tintDark}>{p.brand.toUpperCase()}</text>
      <text x="50" y="82" textAnchor="middle" fontFamily="system-ui" fontSize="5" fill={tintDark}>{p.vol}</text>
    </svg>
  );
  const Pencil = () => (
    <svg viewBox="0 0 60 160" style={{ width: '100%', height: '100%' }}>
      <path d="M20 6 L40 6 L36 18 L24 18 Z" fill="#333" />
      <rect x="18" y="18" width="24" height="120" fill={tint} />
      <rect x="20" y="60" width="20" height="40" fill="white" opacity="0.9" />
      <text x="30" y="80" textAnchor="middle" fontFamily="system-ui" fontSize="6" fontWeight="800" fill={tintDark}>{p.brand.toUpperCase()}</text>
      <path d="M18 138 L42 138 L30 156 Z" fill={tintDark} />
    </svg>
  );

  const shape = {
    bottle: Bottle, jar: Jar, tube: Tube, lipstick: Lipstick, flask: Flask,
    stick: Stick, palette: Palette, bar: Bar, spray: Spray, pencil: Pencil,
  }[p.shape] || Bottle;

  return (
    <div style={{
      width: '100%', aspectRatio: '1 / 1',
      background: `radial-gradient(circle at 30% 20%, ${bgFar}, ${bgNear})`,
      borderRadius: 12, position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: `calc(100% - ${padding * 2}px)`, height: `calc(100% - ${padding * 2}px)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {React.createElement(shape)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Price tag — sticker-style badge
// ───────────────────────────────────────────────
function PriceTag({ price, old, big = false, size = 'md' }) {
  const t = useTheme();
  const fs = big ? 28 : (size === 'lg' ? 22 : 16);
  const oldFs = big ? 14 : (size === 'lg' ? 12 : 11);
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
      <span style={{
        fontWeight: 900, fontSize: fs, color: t.primary, letterSpacing: '-0.02em',
        whiteSpace: 'nowrap',
      }}>{fmtRub(price)}</span>
      {old && old > price && (
        <span style={{
          fontSize: oldFs, color: t.muted, textDecoration: 'line-through', fontWeight: 500,
        }}>{fmtRub(old)}</span>
      )}
    </div>
  );
}

function DiscountBadge({ pct, style }) {
  const t = useTheme();
  return (
    <div style={{
      background: t.discountBg, color: t.discountInk,
      padding: '3px 8px', borderRadius: 6, fontWeight: 800, fontSize: 12,
      letterSpacing: '0.02em', whiteSpace: 'nowrap',
      ...style,
    }}>−{pct}%</div>
  );
}

function HitBadge({ style }) {
  const t = useTheme();
  return (
    <div style={{
      background: t.accent, color: '#1A0A14',
      padding: '3px 8px', borderRadius: 6, fontWeight: 800, fontSize: 11,
      letterSpacing: '0.04em', textTransform: 'uppercase',
      display: 'inline-flex', alignItems: 'center', gap: 4,
      ...style,
    }}>
      {Icon.flame()} ХИТ
    </div>
  );
}

// ───────────────────────────────────────────────
// Star rating
// ───────────────────────────────────────────────
function StarRating({ rating, reviews, compact = false }) {
  const t = useTheme();
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: t.accent2 }}>
      {Icon.star(true)}
      <span style={{ fontSize: compact ? 12 : 13, fontWeight: 700, color: t.ink }}>{rating}</span>
      {reviews != null && (
        <span style={{ fontSize: compact ? 11 : 12, color: t.muted, fontWeight: 500 }}>· {reviews}</span>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────
// Button
// ───────────────────────────────────────────────
function Button({ onClick, children, variant = 'primary', size = 'md', block = false, icon, style = {} }) {
  const t = useTheme();
  const base = {
    border: 'none', cursor: 'pointer', fontWeight: 700, letterSpacing: '0.01em',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'inherit', transition: 'transform .06s, box-shadow .12s, filter .12s',
    width: block ? '100%' : 'auto', whiteSpace: 'nowrap',
  };
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 13, borderRadius: 8 },
    md: { padding: '12px 20px', fontSize: 14, borderRadius: 10 },
    lg: { padding: '16px 28px', fontSize: 16, borderRadius: 12 },
  };
  const variants = {
    primary: { background: t.btnBg, color: t.btnInk },
    accent:  { background: t.accent, color: '#1A0A14' },
    ghost:   { background: 'transparent', color: t.ink, boxShadow: `inset 0 0 0 1.5px ${t.border}` },
    light:   { background: t.surfaceAlt, color: t.ink },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
      onMouseUp={(e) => e.currentTarget.style.transform = ''}
      onMouseLeave={(e) => e.currentTarget.style.transform = ''}
    >
      {icon}{children}
    </button>
  );
}

// ───────────────────────────────────────────────
// Mobile header — logo + cart + back navigation
// ───────────────────────────────────────────────
function MobileHeader({ title, showBack = false }) {
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

// ───────────────────────────────────────────────
// Mobile bottom tab bar
// ───────────────────────────────────────────────
function MobileTabBar() {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();
  const tabs = [
    { id: 'home',    label: 'Главная',  icon: Icon.menu, screen: { screen: 'home' } },
    { id: 'catalog', label: 'Каталог',  icon: Icon.search, screen: { screen: 'catalog' } },
    { id: 'fav',     label: 'Избранное', icon: Icon.heart, screen: { screen: 'home' } },
    { id: 'cart',    label: 'Корзина',  icon: Icon.cart, screen: { screen: 'cart' }, badge: cart.count },
    { id: 'me',      label: 'Профиль',  icon: Icon.user, screen: { screen: 'home' } },
  ];
  const active = router.route.screen;
  return (
    <div style={{
      background: t.surface, borderTop: `1px solid ${t.border}`,
      display: 'flex', padding: '8px 4px 22px',
      flexShrink: 0, gap: 2,
    }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id || (tab.id === 'home' && active === 'home');
        return (
          <button key={tab.id} onClick={() => router.go(tab.screen)} style={{
            flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '6px 4px', color: isActive ? t.primary : t.muted,
            position: 'relative',
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

// ───────────────────────────────────────────────
// Search field
// ───────────────────────────────────────────────
function SearchField({ placeholder = 'Поиск косметики, брендов…', onFocus }) {
  const t = useTheme();
  return (
    <div onClick={onFocus} style={{
      background: t.surface, color: t.ink,
      borderRadius: 12, padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: `inset 0 0 0 1.5px ${t.border}`, cursor: 'text',
    }}>
      <span style={{ color: t.muted, display: 'flex' }}>{Icon.search()}</span>
      <span style={{ flex: 1, color: t.muted, fontSize: 14 }}>{placeholder}</span>
      <span style={{ color: t.primary, display: 'flex' }}>{Icon.filter()}</span>
    </div>
  );
}

// ───────────────────────────────────────────────
// Product card (mobile/grid)
// ───────────────────────────────────────────────
function ProductCard({ p, onClick, layout = 'grid' }) {
  const t = useTheme();
  const cart = useCart();
  const inCart = cart.items[p.id] > 0;

  if (layout === 'list') {
    return (
      <div onClick={onClick} style={{
        background: t.cardBg, borderRadius: 14, padding: 12,
        display: 'flex', gap: 12, cursor: 'pointer',
        boxShadow: `0 1px 0 ${t.border}`,
      }}>
        <div style={{ width: 96, flexShrink: 0 }}>
          <ProductImage p={p} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, color: t.muted, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{p.brand}</div>
          <div style={{ fontSize: 14, color: t.ink, fontWeight: 600, lineHeight: 1.25, marginTop: 2,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
            <PriceTag price={p.price} old={p.old} />
            <button onClick={(e) => { e.stopPropagation(); cart.add(p.id); }} style={{
              background: inCart ? t.accent : t.btnBg, color: inCart ? '#1A0A14' : t.btnInk,
              border: 'none', cursor: 'pointer', borderRadius: 10, padding: '8px 12px',
              fontWeight: 800, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>{inCart ? Icon.check() : Icon.plus()} {inCart ? 'В корзине' : 'В корзину'}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} style={{
      background: t.cardBg, borderRadius: 14, padding: 10,
      cursor: 'pointer', position: 'relative',
      boxShadow: `0 1px 0 ${t.border}`,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ position: 'relative' }}>
        <ProductImage p={p} />
        <div style={{ position: 'absolute', top: 6, left: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {p.old && p.old > p.price && <DiscountBadge pct={pctOff(p.price, p.old)} />}
          {p.hit && <HitBadge />}
        </div>
        <button onClick={(e) => { e.stopPropagation(); }} style={{
          position: 'absolute', top: 6, right: 6,
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: t.muted,
        }}>{Icon.heart()}</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 2px' }}>
        <StarRating rating={p.rating} reviews={p.reviews} compact />
        <div style={{ fontSize: 11, color: t.muted, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{p.brand}</div>
        <div style={{ fontSize: 13, color: t.ink, fontWeight: 600, lineHeight: 1.25,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 32 }}>{p.name}</div>
        <div style={{ fontSize: 11, color: t.muted }}>{p.vol}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: '0 2px 2px' }}>
        <PriceTag price={p.price} old={p.old} />
        <button onClick={(e) => { e.stopPropagation(); cart.add(p.id); }} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: inCart ? t.accent : t.btnBg, color: inCart ? '#1A0A14' : t.btnInk,
          border: 'none', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        }}>{inCart ? Icon.check() : Icon.plus()}</button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Hero promo banner
// ───────────────────────────────────────────────
function PromoBanner({ b, onClick, height = 140 }) {
  const t = useTheme();
  const palette = {
    primary: { bg: t.primary, ink: '#FFFFFF', accent: t.accent },
    accent:  { bg: t.accent, ink: '#1A0A14', accent: t.primary },
    orange:  { bg: t.accent2, ink: '#FFFFFF', accent: t.accent },
  }[b.accent || 'primary'];
  return (
    <div onClick={onClick} style={{
      height, borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden',
      background: palette.bg, color: palette.ink, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85 }}>{b.kicker}</div>
        <div style={{ fontSize: 20, fontWeight: 900, marginTop: 6, letterSpacing: '-0.01em', lineHeight: 1.15, maxWidth: '70%' }}>{b.title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>{b.sub}</div>
        <div style={{
          padding: '6px 12px', borderRadius: 999,
          background: palette.accent, color: palette.bg === t.accent ? '#1A0A14' : (palette.bg === t.primary ? '#1A0A14' : '#1A0A14'),
          fontSize: 12, fontWeight: 800,
        }}>{b.cta} →</div>
      </div>
      {/* big floating "blob" decoration */}
      <svg style={{ position: 'absolute', right: -30, top: -30, opacity: 0.2 }} width="180" height="180" viewBox="0 0 100 100">
        <path fill={palette.accent} d="M50 0 Q70 20 100 30 Q90 60 100 100 Q60 90 30 100 Q40 60 0 50 Q30 40 50 0 Z" />
      </svg>
    </div>
  );
}

Object.assign(window, {
  Icon, Logo, ProductImage, PriceTag, DiscountBadge, HitBadge, StarRating, Button,
  MobileHeader, MobileTabBar, SearchField, ProductCard, PromoBanner,
});
