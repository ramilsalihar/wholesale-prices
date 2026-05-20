import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { pctOff } from '../entities/product/model.js';
import { useData } from '../features/data.jsx';
import { Icon } from '../shared/ui/Icon.jsx';
import { ProductCard } from '../entities/product/ProductCard.jsx';
import { DesktopFooter } from '../widgets/DesktopFooter.jsx';

const PRICE_RANGES = [
  { label: 'до 500 с',       key: 'lt500',    test: p => p.price < 500 },
  { label: '500–1 500 с',    key: '500-1500',  test: p => p.price >= 500 && p.price < 1500 },
  { label: '1 500–3 000 с',  key: '1500-3000', test: p => p.price >= 1500 && p.price < 3000 },
  { label: 'от 3 000 с',     key: 'gt3000',    test: p => p.price >= 3000 },
];

function Chip({ active, onClick, children }) {
  const t = useTheme();
  return (
    <button onClick={onClick} style={{
      padding: '7px 14px', borderRadius: 999,
      border: `1.5px solid ${active ? t.primary : t.border}`,
      background: active ? t.primary : t.surface,
      color: active ? '#fff' : t.ink,
      fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
      cursor: 'pointer', fontFamily: 'inherit',
      transition: 'background 0.12s, border-color 0.12s, color 0.12s',
    }}>
      {children}
    </button>
  );
}

export function CatalogScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const { products: allProducts, categories } = useData();
  const isDesk = device === 'desktop';

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('popular');
  const [activeCats, setActiveCats] = useState(() => router.route.cat ? [router.route.cat] : []);
  const [activeBrands, setActiveBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [onlySale, setOnlySale] = useState(false);
  const [hitsOnly, setHitsOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const inputRef = useRef(null);
  useEffect(() => {
    if (router.route.search && inputRef.current) {
      inputRef.current.focus();
    }
  }, [router.route.search]);

  useEffect(() => {
    if (router.route.cat && !activeCats.includes(router.route.cat)) {
      setActiveCats([router.route.cat]);
    }
  }, [router.route.cat]);

  const uniqueBrands = useMemo(
    () => [...new Set(allProducts.map(p => p.brand).filter(Boolean))].sort(),
    [allProducts]
  );

  const products = useMemo(() => {
    let result = [...allProducts];
    const q = query.trim().toLowerCase();
    if (q) result = result.filter(p =>
      p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
    );
    if (activeCats.length > 0) result = result.filter(p => activeCats.includes(p.cat));
    if (activeBrands.length > 0) result = result.filter(p => activeBrands.includes(p.brand));
    if (priceRange) {
      const range = PRICE_RANGES.find(r => r.key === priceRange);
      if (range) result = result.filter(range.test);
    }
    if (onlySale) result = result.filter(p => p.old && pctOff(p.price, p.old) >= 20);
    if (hitsOnly) result = result.filter(p => p.hit);
    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sort === 'discount') result.sort((a, b) => pctOff(b.price, b.old || b.price) - pctOff(a.price, a.old || a.price));
    return result;
  }, [allProducts, query, activeCats, activeBrands, priceRange, onlySale, hitsOnly, sort]);

  const activeFilterCount = activeCats.length + activeBrands.length + (priceRange ? 1 : 0) + (onlySale ? 1 : 0) + (hitsOnly ? 1 : 0);

  function toggleCat(id) {
    setActiveCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function toggleBrand(b) {
    setActiveBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  }
  function clearAll() {
    setActiveCats([]);
    setActiveBrands([]);
    setPriceRange(null);
    setOnlySale(false);
    setHitsOnly(false);
    setQuery('');
  }

  const headerTitle = activeCats.length === 1
    ? (categories.find(c => c.id === activeCats[0])?.ru || 'Каталог')
    : 'Весь каталог';

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
      <div style={{ background: t.surfaceAlt, padding: isDesk ? '24px 40px 20px' : '12px 16px 14px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Главная · Каталог{activeCats.length === 1 && ` · ${headerTitle}`}
        </div>
        <div style={{ fontSize: isDesk ? 36 : 24, fontWeight: 900, marginTop: 6, letterSpacing: '-0.02em' }}>
          {headerTitle}
        </div>
        <div style={{ fontSize: isDesk ? 14 : 12, color: t.muted, marginTop: 4 }}>
          {products.length} товаров{query.trim() && ` по запросу «${query.trim()}»`}
        </div>
      </div>

      <div style={{
        position: 'sticky', top: 0, zIndex: 8,
        background: t.bg, borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{ padding: isDesk ? '10px 40px' : '8px 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: t.surface, borderRadius: 12, padding: '10px 14px',
            boxShadow: `inset 0 0 0 1.5px ${t.border}`,
          }}>
            <span style={{ color: t.muted, display: 'flex', flexShrink: 0 }}>{Icon.search()}</span>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
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
          padding: isDesk ? '0 40px 10px' : '0 16px 10px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <button
            onClick={() => setFiltersOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 999,
              border: `1.5px solid ${activeFilterCount > 0 ? t.primary : t.border}`,
              background: activeFilterCount > 0 ? t.primary : t.surface,
              color: activeFilterCount > 0 ? '#fff' : t.ink,
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              flexShrink: 0,
            }}
          >
            {Icon.filter({ width: 14, height: 14 })}
            Фильтры
            {activeFilterCount > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.25)', borderRadius: 999,
                fontSize: 11, fontWeight: 800, padding: '0 6px', lineHeight: '18px',
              }}>{activeFilterCount}</span>
            )}
            <span style={{
              fontSize: 9, marginLeft: 1,
              transform: filtersOpen ? 'rotate(180deg)' : 'none',
              display: 'inline-block', transition: 'transform 0.18s',
            }}>▼</span>
          </button>

          <div style={{ flex: 1, display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {activeCats.map(id => {
              const c = categories.find(x => x.id === id);
              return <Chip key={id} active onClick={() => toggleCat(id)}>{c?.emoji} {c?.ru} ×</Chip>;
            })}
            {activeBrands.map(b => (
              <Chip key={b} active onClick={() => toggleBrand(b)}>{b} ×</Chip>
            ))}
            {priceRange && (
              <Chip active onClick={() => setPriceRange(null)}>
                {PRICE_RANGES.find(r => r.key === priceRange)?.label} ×
              </Chip>
            )}
            {onlySale && <Chip active onClick={() => setOnlySale(false)}>🔥 Со скидкой ×</Chip>}
            {hitsOnly && <Chip active onClick={() => setHitsOnly(false)}>⭐ Хиты ×</Chip>}
          </div>

          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              background: t.surface, color: t.ink, border: `1.5px solid ${t.border}`,
              padding: '7px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
            }}
          >
            <option value="popular">По популярности</option>
            <option value="discount">Сначала скидка</option>
            <option value="price_asc">Цена ↑</option>
            <option value="price_desc">Цена ↓</option>
            <option value="rating">По рейтингу</option>
          </select>
        </div>

        {filtersOpen && (
          <div style={{
            padding: isDesk ? '0 40px 16px' : '0 16px 16px',
            borderTop: `1px solid ${t.border}`,
            paddingTop: 14,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: '0.06em', marginBottom: 8 }}>
              КАТЕГОРИИ
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {categories.map(c => (
                <Chip key={c.id} active={activeCats.includes(c.id)} onClick={() => toggleCat(c.id)}>
                  {c.emoji} {c.ru}
                </Chip>
              ))}
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: '0.06em', marginBottom: 8 }}>
              БРЕНДЫ
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {uniqueBrands.map(b => (
                <Chip key={b} active={activeBrands.includes(b)} onClick={() => toggleBrand(b)}>
                  {b}
                </Chip>
              ))}
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: '0.06em', marginBottom: 8 }}>
              ЦЕНА
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {PRICE_RANGES.map(r => (
                <Chip key={r.key} active={priceRange === r.key} onClick={() => setPriceRange(pr => pr === r.key ? null : r.key)}>
                  {r.label}
                </Chip>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip active={onlySale} onClick={() => setOnlySale(v => !v)}>🔥 Со скидкой</Chip>
              <Chip active={hitsOnly} onClick={() => setHitsOnly(v => !v)}>⭐ Хиты продаж</Chip>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    padding: '7px 14px', background: 'none',
                    border: `1.5px solid ${t.border}`, borderRadius: 999,
                    fontSize: 13, fontWeight: 700, color: t.muted,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Сбросить всё
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div style={{ padding: '60px 24px', textAlign: 'center', color: t.muted }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontWeight: 900, fontSize: 18, color: t.ink, marginBottom: 8 }}>Ничего не найдено</div>
          <div style={{ fontSize: 14 }}>Попробуйте другой запрос или сбросьте фильтры</div>
          <button onClick={clearAll} style={{
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
          {products.map(p => (
            <ProductCard key={p.id} p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
          ))}
        </div>
      )}

      {isDesk && <DesktopFooter />}
    </div>
  );
}
