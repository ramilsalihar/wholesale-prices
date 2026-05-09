import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { PRODUCTS } from '../entities/product/model.js';
import { CATEGORIES } from '../entities/category/model.js';
import { BANNERS } from '../entities/banner/model.js';
import { pctOff } from '../entities/product/model.js';
import { Icon } from '../shared/ui/Icon.jsx';
import { SearchField } from '../shared/ui/SearchField.jsx';
import { Section, Carousel } from '../shared/ui/Section.jsx';
import { ProductCard } from '../entities/product/ProductCard.jsx';
import { PromoBanner } from '../entities/banner/PromoBanner.jsx';
import { DesktopFooter } from '../widgets/DesktopFooter.jsx';

export function HomeScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const isDesk = device === 'desktop';
  const hits = PRODUCTS.filter((p) => p.hit);
  const newArrivals = PRODUCTS.slice(8, 14);
  const sale = PRODUCTS.filter((p) => p.old && pctOff(p.price, p.old) >= 30).slice(0, 6);

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%', paddingBottom: isDesk ? 0 : 16 }}>
      {isDesk && (
        <div style={{
          background: t.headerBg, color: t.headerInk,
          padding: '8px 40px', fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '0.02em',
        }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: 0.95 }}>
              {Icon.truck({ width: 14, height: 14 })} Доставка по КР от 1 дня
            </span>
            <span style={{ opacity: 0.95 }}>📞 8 (312) 123-45-67</span>
            <span style={{ opacity: 0.95 }}>Бишкек</span>
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <span style={{ opacity: 0.95, cursor: 'pointer' }}>Доставка и оплата</span>
            <span style={{ opacity: 0.95, cursor: 'pointer' }}>Помощь</span>
          </div>
        </div>
      )}

      {!isDesk && (
        <div style={{ padding: '12px 16px 8px', background: t.headerBg }}>
          <SearchField onFocus={() => router.go({ screen: 'catalog' })} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, padding: isDesk ? '24px 40px 8px' : '12px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => router.go({ screen: 'catalog', cat: c.id })} style={{
            background: t.surface, color: t.ink,
            border: `1.5px solid ${t.border}`, cursor: 'pointer',
            padding: isDesk ? '10px 16px' : '8px 14px', borderRadius: 999,
            fontSize: isDesk ? 14 : 13, fontWeight: 700, whiteSpace: 'nowrap',
            display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}>
            <span>{c.emoji}</span>{c.ru}
          </button>
        ))}
      </div>

      <div style={{
        padding: isDesk ? '16px 40px' : '8px 16px',
        display: 'grid',
        gridTemplateColumns: isDesk ? '2fr 1fr' : '1fr',
        gap: 12,
      }}>
        <PromoBanner b={BANNERS[0]} height={isDesk ? 280 : 180} onClick={() => router.go({ screen: 'catalog' })} />
        {isDesk && <PromoBanner b={BANNERS[1]} height={280} onClick={() => {}} />}
        {!isDesk && <PromoBanner b={BANNERS[1]} height={120} onClick={() => {}} />}
      </div>

      <div style={{
        padding: isDesk ? '8px 40px' : '8px 16px',
        display: 'grid', gap: 8,
        gridTemplateColumns: 'repeat(2, 1fr)',
      }}>
        {[
          { icon: Icon.truck,   t: 'Доставка завтра',     s: 'по Бишкеку' },
          { icon: Icon.shield,  t: 'Гарантия оригинала',  s: 'возврат 14 дней' },
          { icon: Icon.flame,   t: 'Цена дня',             s: 'до −60% ежедневно' },
          { icon: Icon.heart,   t: '12 000+ отзывов',      s: 'настоящие покупатели' },
        ].map((u, i) => (
          <div key={i} style={{
            background: t.surfaceAlt, padding: isDesk ? '14px 16px' : '10px 12px',
            borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ color: t.primary, display: 'flex' }}>{u.icon()}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: t.ink, lineHeight: 1.2 }}>{u.t}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>{u.s}</div>
            </div>
          </div>
        ))}
      </div>

      <Section title="Хиты продаж" sub="Покупают чаще всего" device={device} onSeeAll={() => router.go({ screen: 'catalog' })}>
        <Carousel device={device}>
          {hits.map((p) => (
            <div key={p.id} style={{ width: isDesk ? 240 : 168, flexShrink: 0 }}>
              <ProductCard p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
            </div>
          ))}
        </Carousel>
      </Section>

      <Section title="Категории" device={device}>
        <div style={{
          display: 'grid', gap: 10,
          gridTemplateColumns: isDesk ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
          padding: isDesk ? '0 40px' : '0 16px',
        }}>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => router.go({ screen: 'catalog', cat: c.id })} style={{
              border: 'none', cursor: 'pointer', textAlign: 'left',
              background: c.id === 'face' ? t.primary : (c.id === 'makeup' ? t.accent : t.surface),
              color: c.id === 'face' ? '#fff' : t.ink,
              padding: isDesk ? '20px 16px' : '16px 14px',
              borderRadius: 14, position: 'relative', overflow: 'hidden',
              minHeight: isDesk ? 130 : 90,
              boxShadow: `0 1px 0 ${t.border}`,
            }}>
              <div style={{ fontSize: isDesk ? 36 : 28 }}>{c.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: isDesk ? 14 : 13, marginTop: 4, letterSpacing: '-0.01em' }}>{c.ru}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Скидки до 60%" sub="Только сегодня" device={device} onSeeAll={() => router.go({ screen: 'catalog' })}>
        <Carousel device={device}>
          {sale.map((p) => (
            <div key={p.id} style={{ width: isDesk ? 240 : 168, flexShrink: 0 }}>
              <ProductCard p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
            </div>
          ))}
        </Carousel>
      </Section>

      <Section title="Новинки" sub="Свежий завоз" device={device}>
        <div style={{
          display: 'grid', gap: isDesk ? 16 : 10,
          gridTemplateColumns: isDesk ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
          padding: isDesk ? '0 40px' : '0 16px',
        }}>
          {newArrivals.map((p) => (
            <ProductCard key={p.id} p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
          ))}
        </div>
      </Section>

      <Section title="Любимые бренды" device={device}>
        <div style={{
          display: 'grid', gap: 8,
          gridTemplateColumns: 'repeat(4, 1fr)',
          padding: isDesk ? '0 40px' : '0 16px',
        }}>
          {['Nivea', 'Pantene', 'Loreal', 'Garnier', 'Dove', 'Maybelline', 'Schwarzkopf', 'Vichy'].map((b) => (
            <div key={b} style={{
              background: t.surface, color: t.ink, border: `1.5px solid ${t.border}`,
              padding: isDesk ? '20px 12px' : '14px 8px', borderRadius: 12,
              fontWeight: 800, fontSize: isDesk ? 14 : 12, textAlign: 'center', letterSpacing: '0.02em',
            }}>{b}</div>
          ))}
        </div>
      </Section>

      {isDesk && <DesktopFooter />}
    </div>
  );
}
