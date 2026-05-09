import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { Logo } from '../shared/ui/Logo.jsx';

const LINKS = {
  'О нас':    { screen: 'about' },
  'Магазины': { screen: 'shops' },
};

const IgIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

export function DesktopFooter() {
  const t = useTheme();
  const router = useRouter();
  return (
    <div style={{ background: t.headerBg, color: t.headerInk, padding: '40px 40px 24px', marginTop: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 32, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Logo size={48} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: '0.04em' }}>ОПТОВЫЕ ЦЕНЫ</div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>САМЫЙ БОЛЬШОЙ МАГАЗИН КОСМЕТИКИ В КР</div>
            </div>
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.6, maxWidth: 320, marginBottom: 16 }}>
            Косметика и парфюмерия по оптовым ценам. Прямые поставки от производителей. 100% оригинал, гарантия качества.
          </div>
          <a
            href="https://www.instagram.com/optovye_ceny01_/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.12)', borderRadius: 8,
              padding: '7px 12px', color: 'inherit', textDecoration: 'none',
              fontSize: 13, fontWeight: 700,
            }}
          >
            <IgIcon /> @optovye_ceny01_
          </a>
        </div>
        {[
          { h: 'Покупателям', l: ['Доставка и оплата', 'Возврат', 'Гарантия', 'Программа лояльности'] },
          { h: 'Компания',    l: ['О нас', 'Магазины', 'Вакансии', 'Контакты'] },
          { h: 'Контакты',    l: ['Instagram: @optovye_ceny01_', 'Бишкек, Кыргызстан', 'пн-вс · 9:00–22:00'] },
        ].map((col) => (
          <div key={col.h}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.7 }}>{col.h}</div>
            {col.l.map((x) => {
              const isIg = x.startsWith('Instagram:');
              return (
                <div
                  key={x}
                  onClick={() => {
                    if (LINKS[x]) router.go(LINKS[x]);
                    if (isIg) window.open('https://www.instagram.com/optovye_ceny01_/', '_blank');
                  }}
                  style={{
                    fontSize: 13, opacity: 0.9, marginBottom: 6,
                    cursor: (LINKS[x] || isIg) ? 'pointer' : 'default',
                    textDecoration: (LINKS[x] || isIg) ? 'underline' : 'none',
                    textUnderlineOffset: 3,
                  }}
                >{x}</div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 16, display: 'flex',
        justifyContent: 'space-between', fontSize: 12, opacity: 0.7 }}>
        <span>© 2026 Оптовые Цены. Все права защищены.</span>
        <span>Политика конфиденциальности · Оферта</span>
      </div>
    </div>
  );
}
