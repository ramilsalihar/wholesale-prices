import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { PRODUCTS, pctOff } from '../entities/product/model.js';
import { CATEGORIES } from '../entities/category/model.js';
import { Icon } from '../shared/ui/Icon.jsx';
import { ProductCard } from '../entities/product/ProductCard.jsx';
import { DesktopFooter } from '../widgets/DesktopFooter.jsx';

function Chip({ children, active, onClick }) {
  const t = useTheme();
  return (
    <button onClick={onClick} style={{
      background: active ? t.primary : t.surface, color: active ? '#fff' : t.ink,
      border: `1.5px solid ${active ? t.primary : t.border}`, cursor: 'pointer',
      padding: '8px 14px', borderRadius: 999,
      fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
      display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
      fontFamily: 'inherit',
    }}>{children}</button>
  );
}

export function CatalogScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const isDesk = device === 'desktop';
  const cat = router.route.cat;
  const [sort, setSort] = React.useState('popular');
  const [filter, setFilter] = React.useState({ onlySale: false, hitsOnly: false });
  const [query, setQuery] = React.useState('');
  const focusSearch = !!router.route.search;

  const q = query.trim().toLowerCase();
  let products = PRODUCTS.filter((p) => !cat || p.cat === cat);
  if (q) products = products.filter((p) =>
    p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
  );
  if (filter.onlySale) products = products.filter((p) => p.old && pctOff(p.price, p.old) >= 20);
  if (filter.hitsOnly) products = products.filter((p) => p.hit);
  products = [...products];
  if (sort === 'price_asc') products.sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);
  if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
  if (sort === 'discount') products.sort((a, b) => pctOff(b.price, b.old || b.price) - pctOff(a.price, a.old || a.price));

  const catName = CATEGORIES.find((c) => c.id === cat)?.ru || 'Весь каталог';

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
      <div style={{ background: t.surfaceAlt, padding: isDesk ? '24px 40px 20px' : '12px 16px 14px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Главная · Каталог{cat && ` · ${catName}`}
        </div>
        <div style={{ fontSize: isDesk ? 36 : 24, fontWeight: 900, marginTop: 6, letterSpacing: '-0.02em' }}>{catName}</div>
        <div style={{ fontSize: isDesk ? 14 : 12, color: t.muted, marginTop: 4 }}>
          {products.length} товаров{q ? ` по запросу «${query.trim()}»` : ''}
        </div>
      </div>

      <div style={{
        padding: isDesk ? '12px 40px' : '10px 16px',
        position: 'sticky', top: 0, background: t.bg, zIndex: 6, borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: t.surface, borderRadius: 12, padding: '10px 14px',
          boxShadow: `inset 0 0 0 1.5px ${t.border}`,
        }}>
          <span style={{ color: t.muted, display: 'flex', flexShrink: 0 }}>{Icon.search()}</span>
          <input
            autoFocus={focusSearch}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию или бренду…"
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 14,
              background: 'transparent', color: t.ink, fontFamily: 'inherit',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: t.muted, display: 'flex', padding: 0,
            }}>{Icon.close()}</button>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 8, padding: isDesk ? '10px 40px' : '8px 16px',
        overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center',
        position: 'sticky', top: isDesk ? 57 : 53, background: t.bg, zIndex: 5, borderBottom: `1px solid ${t.border}`,
      }}>
        <Chip active={filter.onlySale} onClick={() => setFilter((f) => ({ ...f, onlySale: !f.onlySale }))}>🔥 Со скидкой</Chip>
        <Chip active={filter.hitsOnly} onClick={() => setFilter((f) => ({ ...f, hitsOnly: !f.hitsOnly }))}>⭐ Хиты</Chip>
        <Chip onClick={() => {}}>До 500 с</Chip>
        <Chip onClick={() => {}}>500–1500 с</Chip>
        <Chip onClick={() => {}}>Бренды</Chip>
        <div style={{ flex: 1 }} />
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
          background: t.surface, color: t.ink, border: `1.5px solid ${t.border}`,
          padding: '8px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          <option value="popular">По популярности</option>
          <option value="discount">Сначала скидка</option>
          <option value="price_asc">Цена ↑</option>
          <option value="price_desc">Цена ↓</option>
          <option value="rating">По рейтингу</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div style={{ padding: '60px 24px', textAlign: 'center', color: t.muted }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontWeight: 900, fontSize: 18, color: t.ink, marginBottom: 8 }}>Ничего не найдено</div>
          <div style={{ fontSize: 14 }}>Попробуйте другой запрос или сбросьте фильтры</div>
          <button onClick={() => { setQuery(''); setFilter({ onlySale: false, hitsOnly: false }); }} style={{
            marginTop: 20, background: t.primary, color: '#fff', border: 'none', cursor: 'pointer',
            padding: '10px 22px', borderRadius: 12, fontWeight: 800, fontSize: 14, fontFamily: 'inherit',
          }}>Сбросить</button>
        </div>
      ) : (
        <div style={{
          display: 'grid', gap: isDesk ? 16 : 10,
          gridTemplateColumns: isDesk ? 'repeat(auto-fill, minmax(190px, 1fr))' : 'repeat(2, 1fr)',
          padding: isDesk ? '20px 40px 40px' : '12px 16px 16px',
        }}>
          {products.map((p) => (
            <ProductCard key={p.id} p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
          ))}
        </div>
      )}

      {isDesk && <DesktopFooter />}
    </div>
  );
}
