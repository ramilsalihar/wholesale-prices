import React from 'react';
import { ThemeContext, THEMES, CartProvider, RouterProvider, useCart } from './store.jsx';
import { DesignCanvas, DCSection, DCArtboard } from './DesignCanvas.jsx';
import { MobileApp, MobileAppWithSeed, DesktopApp, DesktopAppWithSeed, DEVICE_W, DEVICE_H, DESKTOP_W, DESKTOP_H } from './shells.jsx';
import { Logo } from './components.jsx';

const VARIANTS = [
  { key: 'magnit',   label: 'А · Магнит',  desc: 'Магента + жёлтый — рыночная энергия' },
  { key: 'noir',     label: 'B · Чёрный',  desc: 'Тёмный фон, неоновые карточки' },
  { key: 'boutique', label: 'C · Светлый', desc: 'Белый ведущий, магента акцент' },
  { key: 'carnival', label: 'D · Карнавал', desc: 'Жёлтый ведущий, максимум игры' },
];

function Themed({ theme, children }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

function ArtboardCenter({ children }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
      {children}
    </div>
  );
}

function Preface() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '28px 32px', width: 640,
        boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 12px 36px rgba(0,0,0,0.05)', lineHeight: 1.55,
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <img src="/assets/logo.png" alt="" width={70} height={70}
            style={{ borderRadius: '50%', boxShadow: '0 4px 14px rgba(230,9,122,0.3)', flexShrink: 0 }} />
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, letterSpacing: '-0.02em', color: '#1a0a14' }}>Оптовые Цены 01</h1>
            <div style={{ color: '#5a4a52', fontSize: 14, fontWeight: 600, letterSpacing: '0.02em', marginTop: 4 }}>
              B2C · косметика и парфюмерия · доставка по РФ
            </div>
          </div>
        </div>
        <p style={{ color: '#29261b', fontSize: 14, margin: '0 0 8px' }}>
          Палитра взята с аватара: <b style={{ color: '#E6097A' }}>магента</b> доминирует, <b style={{ color: '#E6097A' }}>жёлтый</b> цветок — главный акцент, <b style={{ color: '#E6097A' }}>оранжевый</b> ободок — вторичный, чёрный фон. Дальше — четыре направления, в которых можно нести этот код в e-commerce.
        </p>
        <div style={{ display: 'flex', gap: 6, margin: '16px 0 8px' }}>
          {[
            { bg: '#E6097A', label: '#E6097A', dark: false },
            { bg: '#0A0A0A', label: '#0A0A0A', dark: false },
            { bg: '#F4D423', label: '#F4D423', dark: true },
            { bg: '#F89020', label: '#F89020', dark: false },
            { bg: '#FFFFFF', label: '#FFFFFF', dark: true, outline: true },
          ].map(({ bg, label, dark, outline }) => (
            <div key={bg} style={{
              height: 36, flex: 1, borderRadius: 10,
              background: bg, display: 'flex', alignItems: 'flex-end', padding: '6px 8px',
              fontSize: 10, fontWeight: 800, color: dark ? '#1a0a14' : '#fff',
              boxShadow: outline ? 'inset 0 0 0 1px rgba(0,0,0,0.08)' : undefined,
            }}>{label}</div>
          ))}
        </div>
        <p style={{ color: '#29261b', fontSize: 14, margin: '16px 0 8px' }}>
          Каждый артборд — это <b style={{ color: '#E6097A' }}>живой кликабельный прототип</b>. Нажимайте на товар, добавляйте в корзину, переходите к оформлению.
        </p>
        <p style={{ color: '#7a6a72', fontSize: 13, margin: 0 }}>
          Шрифт интерфейса — <b style={{ color: '#1a0a14' }}>Manrope</b>.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DesignCanvas>
      {/* Brief */}
      <DCSection id="intro" title="Оптовые Цены 01" subtitle="E-commerce косметики · 4 визуальных направления · мобильный + десктоп">
        <DCArtboard id="brief" label="Бриф · палитра" width={720} height={420}>
          <Preface />
        </DCArtboard>
      </DCSection>

      {/* Mobile — Home */}
      <DCSection id="mobile-home" title="Мобильный · Главная" subtitle="Свайпайте, тапайте, проходите путь до оформления заказа">
        {VARIANTS.map((v) => (
          <DCArtboard key={v.key} id={'m-home-' + v.key} label={v.label} width={DEVICE_W + 24} height={DEVICE_H + 24}>
            <ArtboardCenter>
              <Themed theme={THEMES[v.key]}>
                <MobileApp initial={{ screen: 'home' }} />
              </Themed>
            </ArtboardCenter>
          </DCArtboard>
        ))}
      </DCSection>

      {/* Mobile — PDP */}
      <DCSection id="mobile-pdp" title="Мобильный · Карточка товара" subtitle="Тушь Maybelline Lash Sensational">
        {VARIANTS.map((v) => (
          <DCArtboard key={v.key} id={'m-pdp-' + v.key} label={v.label} width={DEVICE_W + 24} height={DEVICE_H + 24}>
            <ArtboardCenter>
              <Themed theme={THEMES[v.key]}>
                <MobileApp initial={{ screen: 'pdp', id: 'p03' }} />
              </Themed>
            </ArtboardCenter>
          </DCArtboard>
        ))}
      </DCSection>

      {/* Mobile — Cart */}
      <DCSection id="mobile-cart" title="Мобильный · Корзина и оформление" subtitle="Превью с заполненной корзиной">
        {VARIANTS.map((v) => (
          <DCArtboard key={v.key} id={'m-cart-' + v.key} label={v.label} width={DEVICE_W + 24} height={DEVICE_H + 24}>
            <ArtboardCenter>
              <Themed theme={THEMES[v.key]}>
                <MobileAppWithSeed initial={{ screen: 'cart' }} seed={['p01', 'p03', 'p08', 'p13']} />
              </Themed>
            </ArtboardCenter>
          </DCArtboard>
        ))}
      </DCSection>

      {/* Desktop — Home */}
      <DCSection id="desktop-home" title="Десктоп · Главная" subtitle="Полная версия для веба">
        {VARIANTS.map((v) => (
          <DCArtboard key={v.key} id={'d-home-' + v.key} label={v.label} width={DESKTOP_W + 24} height={DESKTOP_H + 60}>
            <Themed theme={THEMES[v.key]}>
              <DesktopApp initial={{ screen: 'home' }} />
            </Themed>
          </DCArtboard>
        ))}
      </DCSection>

      {/* Desktop — Catalog */}
      <DCSection id="desktop-catalog" title="Десктоп · Каталог" subtitle="Категория «Макияж» · фильтры и сетка">
        {VARIANTS.map((v) => (
          <DCArtboard key={v.key} id={'d-cat-' + v.key} label={v.label} width={DESKTOP_W + 24} height={DESKTOP_H + 60}>
            <Themed theme={THEMES[v.key]}>
              <DesktopApp initial={{ screen: 'catalog', cat: 'makeup' }} />
            </Themed>
          </DCArtboard>
        ))}
      </DCSection>

      {/* Desktop — PDP */}
      <DCSection id="desktop-pdp" title="Десктоп · Карточка товара">
        {VARIANTS.map((v) => (
          <DCArtboard key={v.key} id={'d-pdp-' + v.key} label={v.label} width={DESKTOP_W + 24} height={DESKTOP_H + 60}>
            <Themed theme={THEMES[v.key]}>
              <DesktopApp initial={{ screen: 'pdp', id: 'p03' }} />
            </Themed>
          </DCArtboard>
        ))}
      </DCSection>

      {/* Desktop — Cart */}
      <DCSection id="desktop-cart" title="Десктоп · Корзина и оформление">
        {VARIANTS.map((v) => (
          <DCArtboard key={v.key} id={'d-cart-' + v.key} label={v.label} width={DESKTOP_W + 24} height={DESKTOP_H + 60}>
            <Themed theme={THEMES[v.key]}>
              <DesktopAppWithSeed initial={{ screen: 'cart' }} seed={['p01', 'p03', 'p08', 'p13', 'p15']} />
            </Themed>
          </DCArtboard>
        ))}
      </DCSection>
    </DesignCanvas>
  );
}
