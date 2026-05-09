import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useCart } from '../features/cart.jsx';
import { useFavorites } from '../features/favorites.jsx';
import { Icon } from '../shared/ui/Icon.jsx';
import { Logo } from '../shared/ui/Logo.jsx';
import { SWATCHES } from './ThemeSwitcher.jsx';

const NI = {
  home: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  grid: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  heart: (filled = false, p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20.8 5.6a5.5 5.5 0 0 0-8.8.7 5.5 5.5 0 0 0-8.8-.7 5.7 5.7 0 0 0 0 7.9L12 22.4l8.8-8.9a5.7 5.7 0 0 0 0-7.9z" />
    </svg>
  ),
  gift: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" rx="1" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  ),
  user: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  ),
  settings: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  globe: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  palette: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="13.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="12.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  logout: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  left: (p = {}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  right: (p = {}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  close: (p = {}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const LANGS = ['RU', 'KG', 'EN'];

function SidebarItem({ item, active, open, onClick }) {
  const t = useTheme();
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center',
        justifyContent: open ? 'flex-start' : 'center',
        gap: 12, padding: open ? '10px 12px' : '10px 0',
        background: active ? t.primary : 'transparent',
        color: active ? '#fff' : (item.to == null ? t.muted : t.ink),
        border: 'none', cursor: item.to ? 'pointer' : 'default',
        borderRadius: 10, width: '100%', textAlign: 'left',
        fontFamily: 'inherit', position: 'relative',
        transition: 'background 0.12s',
      }}
    >
      <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon()}</span>
      {open && (
        <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flex: 1 }}>{item.label}</span>
      )}
      {item.badge > 0 && (
        <span style={{
          position: 'absolute', top: 6,
          ...(open ? { right: 10 } : { right: 4, top: 4 }),
          minWidth: 18, height: 18, padding: '0 4px', borderRadius: 9,
          background: active ? '#fff' : t.primary,
          color: active ? t.primary : '#fff',
          border: `2px solid ${t.surface}`,
          fontSize: 10, fontWeight: 900,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{item.badge}</span>
      )}
    </button>
  );
}

const SETTINGS_PANEL = ['theme', 'login', 'lang'];

function SettingsPanel({ open: sidebarOpen, themeKey, setThemeKey, lang, setLang, visibleCount }) {
  const t = useTheme();

  const items = [
    {
      key: 'theme',
      icon: NI.palette,
      label: 'Тема',
      content: (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {SWATCHES.map((s) => (
            <button
              key={s.key}
              onClick={() => setThemeKey(s.key)}
              title={s.key}
              style={{
                width: 22, height: 22, borderRadius: '50%', border: 'none',
                cursor: 'pointer', padding: 0, background: s.dot, flexShrink: 0,
                boxShadow: s.key === themeKey
                  ? '0 0 0 2px #fff, 0 0 0 4px #E6097A'
                  : s.outline ? 'inset 0 0 0 1.5px rgba(0,0,0,0.2)' : 'none',
                transition: 'box-shadow 0.15s',
              }}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'login',
      icon: NI.user,
      label: 'Войти',
      content: (
        <button style={{
          background: t.primary, color: '#fff', border: 'none', cursor: 'pointer',
          borderRadius: 8, padding: '6px 14px', fontWeight: 800, fontSize: 12,
          fontFamily: 'inherit', whiteSpace: 'nowrap',
        }}>
          Войти
        </button>
      ),
    },
    {
      key: 'lang',
      icon: NI.globe,
      label: 'Язык',
      content: (
        <div style={{ display: 'flex', gap: 4 }}>
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                background: lang === l ? t.primary : t.surfaceAlt,
                color: lang === l ? '#fff' : t.muted,
                border: 'none', cursor: 'pointer',
                borderRadius: 6, padding: '4px 8px',
                fontWeight: 800, fontSize: 11, fontFamily: 'inherit',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {l}
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item, i) => {
        const visible = i < visibleCount;
        return (
          <div
            key={item.key}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-18px)',
              transition: `opacity 0.22s ease, transform 0.22s ease`,
              pointerEvents: visible ? 'auto' : 'none',
              background: t.surfaceAlt,
              borderRadius: 10,
              padding: sidebarOpen ? '10px 12px' : '10px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: 10,
              minHeight: 44,
            }}
          >
            <span style={{ display: 'flex', flexShrink: 0, color: t.primary }}>{item.icon()}</span>
            {sidebarOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {item.label}
                </span>
                {item.content}
              </div>
            )}
            {!sidebarOpen && item.content}
          </div>
        );
      })}
    </div>
  );
}

export function NavSidebar({ open, setOpen, themeKey, setThemeKey }) {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();
  const favs = useFavorites();
  const screen = router.route.screen;

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(0);
  const [lang, setLang] = React.useState('RU');
  const timersRef = React.useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const openSettings = (expandSidebar = false) => {
    clearTimers();
    if (expandSidebar) setOpen(true);
    setSettingsOpen(true);
    setVisibleCount(0);
    SETTINGS_PANEL.forEach((_, i) => {
      timersRef.current.push(setTimeout(() => setVisibleCount(i + 1), i * 110));
    });
  };

  const closeSettings = () => {
    clearTimers();
    for (let i = 0; i < SETTINGS_PANEL.length; i++) {
      const next = SETTINGS_PANEL.length - 1 - i;
      timersRef.current.push(setTimeout(() => setVisibleCount(next), i * 90));
    }
    timersRef.current.push(
      setTimeout(() => { setSettingsOpen(false); setVisibleCount(0); }, SETTINGS_PANEL.length * 90 + 220)
    );
  };

  React.useEffect(() => {
    if (!open && settingsOpen) closeSettings();
  }, [open]);

  const mainItems = [
    { id: 'home',      icon: () => NI.home(),         label: 'Главная',     to: { screen: 'home' } },
    { id: 'catalog',   icon: () => NI.grid(),         label: 'Каталог',     to: { screen: 'catalog' } },
    { id: 'gifts',     icon: () => NI.gift(),         label: 'Подарки',     to: { screen: 'gifts' } },
    { id: 'cart',      icon: () => Icon.cart(),       label: 'Корзина',     to: { screen: 'cart' },      badge: cart.count },
    { id: 'favorites', icon: () => NI.heart(favs?.count > 0), label: 'Избранное', to: { screen: 'favorites' }, badge: favs?.count },
  ];

  const w = open ? 220 : 72;

  return (
    <div style={{
      width: w, flexShrink: 0,
      background: t.surface, borderRight: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
      position: 'sticky', top: 0, height: '100dvh',
    }}>
      <div style={{
        height: 72, flexShrink: 0, padding: open ? '0 20px' : '0',
        display: 'flex', alignItems: 'center',
        justifyContent: open ? 'flex-start' : 'center', gap: 12,
        borderBottom: `1px solid ${t.border}`,
      }}>
        <Logo size={36} />
        {open && (
          <div style={{ color: t.ink, lineHeight: 1.25 }}>
            <div style={{ fontWeight: 900, fontSize: 12, letterSpacing: '0.06em' }}>ОПТОВЫЕ</div>
            <div style={{ fontWeight: 900, fontSize: 12, letterSpacing: '0.06em', color: t.primary }}>ЦЕНЫ</div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '12px 8px', overflowY: 'auto' }}>
        {mainItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={item.to != null && screen === item.id}
            open={open}
            onClick={() => { item.to && router.go(item.to); setSettingsOpen(false); }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px', borderTop: `1px solid ${t.border}` }}>
        {settingsOpen && (
          <div style={{ padding: '0 0 6px' }}>
            <SettingsPanel
              open={open}
              themeKey={themeKey}
              setThemeKey={setThemeKey}
              lang={lang}
              setLang={setLang}
              visibleCount={visibleCount}
            />
          </div>
        )}

        <button
          onClick={() => settingsOpen ? closeSettings() : openSettings(!open)}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: open ? 'flex-start' : 'center',
            gap: 12, padding: open ? '10px 12px' : '10px 0',
            background: settingsOpen ? t.primary : 'transparent',
            color: settingsOpen ? '#fff' : t.ink,
            border: 'none', cursor: 'pointer',
            borderRadius: 10, width: '100%', fontFamily: 'inherit',
            transition: 'background 0.15s, color 0.15s',
          }}
        >
          <span style={{ display: 'flex', flexShrink: 0 }}>
            {settingsOpen ? NI.close() : NI.settings()}
          </span>
          {open && (
            <span style={{ fontSize: 13, fontWeight: 700, flex: 1, textAlign: 'left' }}>
              {settingsOpen ? 'Закрыть' : 'Настройки'}
            </span>
          )}
        </button>

        <button
          onClick={() => setOpen(!open)}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
            padding: open ? '10px 12px' : '10px 0',
            background: 'transparent', border: 'none', cursor: 'pointer',
            borderRadius: 10, color: t.muted, width: '100%', fontFamily: 'inherit',
            gap: 8,
          }}
        >
          {open ? (
            <>
              <span style={{ display: 'flex' }}>{NI.logout()}</span>
              <span style={{ fontSize: 13, fontWeight: 700, flex: 1, textAlign: 'left' }}>Свернуть</span>
              <span style={{ display: 'flex' }}>{NI.left()}</span>
            </>
          ) : (
            <span style={{ display: 'flex' }}>{NI.right()}</span>
          )}
        </button>
      </div>
    </div>
  );
}
