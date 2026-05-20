import React, { useState, useMemo } from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { pctOff } from '../entities/product/model.js';
import { useData } from '../features/data.jsx';
import { Icon } from '../shared/ui/Icon.jsx';
import { SearchField } from '../shared/ui/SearchField.jsx';
import { Section, Carousel } from '../shared/ui/Section.jsx';
import { ProductCard } from '../entities/product/ProductCard.jsx';
import { PromoBanner } from '../entities/banner/PromoBanner.jsx';
import { DesktopFooter } from '../widgets/DesktopFooter.jsx';

function FilterBar({ products, categories, activeCats, activeBrands, onCat, onBrand, onClear, isDesk }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);

  const uniqueBrands = useMemo(
    () => [...new Set(products.map(p => p.brand).filter(Boolean))].sort(),
    [products]
  );

  const activeCount = activeCats.length + activeBrands.length;

  const chipBase = (active) => ({
    padding: '6px 14px',
    borderRadius: 999,
    border: `1.5px solid ${active ? t.primary : t.border}`,
    background: active ? t.primary : t.surface,
    color: active ? '#fff' : t.ink,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    fontFamily: 'Manrope, sans-serif',
    transition: 'background 0.12s, border-color 0.12s, color 0.12s',
  });

  return (
    <div style={{
      background: t.surface,
      borderBottom: `1px solid ${t.border}`,
      padding: isDesk ? '0 40px' : '0 16px',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 0',
          background: 'none', border: 'none', cursor: 'pointer',
          color: t.ink, fontFamily: 'Manrope, sans-serif',
          fontSize: 14, fontWeight: 700,
        }}
      >
        {Icon.filter()}
        Фильтры
        {activeCount > 0 && (
          <span style={{
            background: t.primary, color: '#fff',
            borderRadius: 999, fontSize: 11, fontWeight: 800,
            padding: '1px 7px', lineHeight: '18px',
          }}>
            {activeCount}
          </span>
        )}
        <span style={{ marginLeft: 2, fontSize: 10, opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.18s' }}>▼</span>
      </button>

      {!open && activeCount > 0 && (
        <div style={{ display: 'flex', gap: 6, paddingBottom: 10, flexWrap: 'wrap' }}>
          {activeCats.map(id => {
            const c = categories.find(x => x.id === id);
            return (
              <button key={id} onClick={() => onCat(id)} style={chipBase(true)}>
                {c?.emoji} {c?.ru} ×
              </button>
            );
          })}
          {activeBrands.map(b => (
            <button key={b} onClick={() => onBrand(b)} style={chipBase(true)}>
              {b} ×
            </button>
          ))}
        </div>
      )}

      {open && (
        <div style={{ paddingBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: '0.06em', marginBottom: 8 }}>
            КАТЕГОРИИ
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {categories.map(c => {
              const active = activeCats.includes(c.id);
              return (
                <button key={c.id} onClick={() => onCat(c.id)} style={chipBase(active)}>
                  {c.emoji} {c.ru}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: '0.06em', marginBottom: 8 }}>
            БРЕНДЫ
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {uniqueBrands.map(b => {
              const active = activeBrands.includes(b);
              return (
                <button key={b} onClick={() => onBrand(b)} style={chipBase(active)}>
                  {b}
                </button>
              );
            })}
          </div>

          {activeCount > 0 && (
            <button
              onClick={onClear}
              style={{
                padding: '7px 16px', background: 'none',
                border: `1.5px solid ${t.border}`, borderRadius: 999,
                fontSize: 13, fontWeight: 700, color: t.muted,
                cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
              }}
            >
              Сбросить всё
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function HomeScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const { products, categories, banners } = useData();
  const isDesk = device === 'desktop';

  const [activeCats, setActiveCats] = useState([]);
  const [activeBrands, setActiveBrands] = useState([]);

  function toggleCat(id) {
    setActiveCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function toggleBrand(b) {
    setActiveBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  }
  function clearFilters() {
    setActiveCats([]);
    setActiveBrands([]);
  }

  const filtered = useMemo(() => {
    return products.filter(p => {
      const catOk = activeCats.length === 0 || activeCats.includes(p.cat);
      const brandOk = activeBrands.length === 0 || activeBrands.includes(p.brand);
      return catOk && brandOk;
    });
  }, [products, activeCats, activeBrands]);

  const hasFilters = activeCats.length > 0 || activeBrands.length > 0;
  const hits = hasFilters ? filtered.filter(p => p.hit) : products.filter(p => p.hit);
  const sale = (hasFilters ? filtered : products).filter(p => p.old && pctOff(p.price, p.old) >= 30).slice(0, 6);
  const newArrivals = hasFilters ? filtered.slice(0, 6) : products.slice(8, 14);

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
          <SearchField onFocus={() => router.go({ screen: 'catalog', search: true })} />
        </div>
      )}

      <FilterBar
        products={products}
        categories={categories}
        activeCats={activeCats}
        activeBrands={activeBrands}
        onCat={toggleCat}
        onBrand={toggleBrand}
        onClear={clearFilters}
        isDesk={isDesk}
      />

      <div style={{
        padding: isDesk ? '16px 40px' : '8px 16px',
        display: 'grid',
        gridTemplateColumns: isDesk ? '2fr 1fr' : '1fr',
        gap: 12,
      }}>
        <PromoBanner b={banners[0]} height={isDesk ? 280 : 180} onClick={() => router.go({ screen: 'catalog' })} />
        {isDesk && <PromoBanner b={banners[1]} height={280} onClick={() => {}} />}
        {!isDesk && <PromoBanner b={banners[1]} height={120} onClick={() => {}} />}
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

      {hits.length > 0 && (
        <Section title="Хиты продаж" sub="Покупают чаще всего" device={device} onSeeAll={() => router.go({ screen: 'catalog' })}>
          <Carousel device={device}>
            {hits.map((p) => (
              <div key={p.id} style={{ width: isDesk ? 240 : 168, flexShrink: 0 }}>
                <ProductCard p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
              </div>
            ))}
          </Carousel>
        </Section>
      )}

      {sale.length > 0 && (
        <Section title="Скидки до 60%" sub="Только сегодня" device={device} onSeeAll={() => router.go({ screen: 'catalog' })}>
          <Carousel device={device}>
            {sale.map((p) => (
              <div key={p.id} style={{ width: isDesk ? 240 : 168, flexShrink: 0 }}>
                <ProductCard p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
              </div>
            ))}
          </Carousel>
        </Section>
      )}

      {newArrivals.length > 0 && (
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
      )}

      {hasFilters && filtered.length === 0 && (
        <div style={{ padding: '40px 16px', textAlign: 'center', color: t.muted, fontSize: 14 }}>
          Нет товаров по выбранным фильтрам
        </div>
      )}

      {isDesk && <DesktopFooter />}
    </div>
  );
}
