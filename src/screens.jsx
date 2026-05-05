import React from 'react';
import { useTheme, useRouter, useCart, PRODUCTS, CATEGORIES, BANNERS, fmtRub, pctOff } from './store.jsx';
import { Icon, Logo, ProductImage, PriceTag, DiscountBadge, HitBadge, StarRating, Button, SearchField, ProductCard, PromoBanner } from './components.jsx';

// ── Section wrapper ────────────────────────────────────────────
export function Section({ title, sub, children, device, onSeeAll }) {
  const t = useTheme();
  const isDesk = device === 'desktop';
  return (
    <div style={{ marginTop: isDesk ? 36 : 20 }}>
      <div style={{ padding: isDesk ? '0 40px 14px' : '0 16px 10px',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: isDesk ? 28 : 20, fontWeight: 900, color: t.ink,
            letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</div>
          {sub && <div style={{ fontSize: isDesk ? 14 : 12, color: t.muted, marginTop: 4, fontWeight: 500 }}>{sub}</div>}
        </div>
        {onSeeAll && (
          <button onClick={onSeeAll} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: t.primary, fontWeight: 800, fontSize: isDesk ? 14 : 13, whiteSpace: 'nowrap',
          }}>смотреть все →</button>
        )}
      </div>
      {children}
    </div>
  );
}

export function Carousel({ children, device }) {
  const isDesk = device === 'desktop';
  return (
    <div style={{
      display: 'flex', gap: isDesk ? 16 : 10,
      overflowX: 'auto', scrollbarWidth: 'none',
      padding: isDesk ? '0 40px' : '0 16px',
      scrollSnapType: 'x mandatory',
    }}>
      {React.Children.map(children, (c, i) => (
        <div key={i} style={{ scrollSnapAlign: 'start' }}>{c}</div>
      ))}
    </div>
  );
}

// ── HOME ───────────────────────────────────────────────────────
export function HomeScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const isDesk = device === 'desktop';
  const hits = PRODUCTS.filter((p) => p.hit);
  const newArrivals = PRODUCTS.slice(8, 14);
  const sale = PRODUCTS.filter((p) => p.old && pctOff(p.price, p.old) >= 30).slice(0, 6);

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%', paddingBottom: isDesk ? 60 : 16 }}>
      {isDesk && (
        <div style={{
          background: t.headerBg, color: t.headerInk,
          padding: '8px 40px', fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '0.02em',
        }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: 0.95 }}>
              {Icon.truck({ width: 14, height: 14 })} Доставка по РФ от 1 дня
            </span>
            <span style={{ opacity: 0.95 }}>📞 8 (800) 123-45-67</span>
            <span style={{ opacity: 0.95 }}>Москва</span>
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <span style={{ opacity: 0.95, cursor: 'pointer' }}>Магазины</span>
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

      {/* Category chips */}
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

      {/* Hero banners */}
      <div style={{
        padding: isDesk ? '16px 40px' : '8px 16px',
        display: 'grid',
        gridTemplateColumns: isDesk ? '2fr 1fr 1fr' : '1fr',
        gap: 12,
      }}>
        <PromoBanner b={BANNERS[0]} height={isDesk ? 320 : 180} onClick={() => router.go({ screen: 'catalog' })} />
        {isDesk && <PromoBanner b={BANNERS[1]} height={320} onClick={() => {}} />}
        {isDesk && <PromoBanner b={BANNERS[2]} height={320} onClick={() => router.go({ screen: 'catalog' })} />}
        {!isDesk && <PromoBanner b={BANNERS[1]} height={120} onClick={() => {}} />}
      </div>

      {/* USP strip */}
      <div style={{
        padding: isDesk ? '8px 40px' : '8px 16px',
        display: 'grid', gap: 8,
        gridTemplateColumns: isDesk ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
      }}>
        {[
          { icon: Icon.truck, t: 'Доставка завтра',     s: 'по Москве и МО' },
          { icon: Icon.shield, t: 'Гарантия оригинала', s: 'возврат 14 дней' },
          { icon: Icon.flame, t: 'Цена дня',             s: 'до −60% ежедневно' },
          { icon: Icon.heart, t: '12 000+ отзывов',      s: 'настоящие покупатели' },
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

      {/* Hits */}
      <Section title="Хиты продаж" sub="Покупают чаще всего" device={device} onSeeAll={() => router.go({ screen: 'catalog' })}>
        <Carousel device={device}>
          {hits.map((p) => (
            <div key={p.id} style={{ width: isDesk ? 240 : 168, flexShrink: 0 }}>
              <ProductCard p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
            </div>
          ))}
        </Carousel>
      </Section>

      {/* Categories grid */}
      <Section title="Категории" device={device}>
        <div style={{
          display: 'grid', gap: 10,
          gridTemplateColumns: isDesk ? 'repeat(8, 1fr)' : 'repeat(2, 1fr)',
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

      {/* Sale */}
      <Section title="Скидки до 60%" sub="Только сегодня" device={device} onSeeAll={() => router.go({ screen: 'catalog' })}>
        <Carousel device={device}>
          {sale.map((p) => (
            <div key={p.id} style={{ width: isDesk ? 240 : 168, flexShrink: 0 }}>
              <ProductCard p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
            </div>
          ))}
        </Carousel>
      </Section>

      {/* New arrivals */}
      <Section title="Новинки" sub="Свежий завоз" device={device}>
        <div style={{
          display: 'grid', gap: isDesk ? 16 : 10,
          gridTemplateColumns: isDesk ? 'repeat(6, 1fr)' : 'repeat(2, 1fr)',
          padding: isDesk ? '0 40px' : '0 16px',
        }}>
          {newArrivals.map((p) => (
            <ProductCard key={p.id} p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
          ))}
        </div>
      </Section>

      {/* Brand strip */}
      <Section title="Любимые бренды" device={device}>
        <div style={{
          display: 'grid', gap: 8,
          gridTemplateColumns: isDesk ? 'repeat(8, 1fr)' : 'repeat(4, 1fr)',
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

// ── CATALOG ────────────────────────────────────────────────────
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

  let products = PRODUCTS.filter((p) => !cat || p.cat === cat);
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
        <div style={{ fontSize: isDesk ? 14 : 12, color: t.muted, marginTop: 4 }}>{products.length} товаров</div>
      </div>

      <div style={{
        display: 'flex', gap: 8, padding: isDesk ? '16px 40px' : '12px 16px',
        overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center',
        position: 'sticky', top: 0, background: t.bg, zIndex: 5, borderBottom: `1px solid ${t.border}`,
      }}>
        <Chip active={filter.onlySale} onClick={() => setFilter((f) => ({ ...f, onlySale: !f.onlySale }))}>🔥 Со скидкой</Chip>
        <Chip active={filter.hitsOnly} onClick={() => setFilter((f) => ({ ...f, hitsOnly: !f.hitsOnly }))}>⭐ Хиты</Chip>
        <Chip onClick={() => {}}>До 500 ₽</Chip>
        <Chip onClick={() => {}}>500–1500 ₽</Chip>
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

      <div style={{
        display: 'grid', gap: isDesk ? 16 : 10,
        gridTemplateColumns: isDesk ? 'repeat(5, 1fr)' : 'repeat(2, 1fr)',
        padding: isDesk ? '20px 40px 40px' : '12px 16px 16px',
      }}>
        {products.map((p) => (
          <ProductCard key={p.id} p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
        ))}
      </div>

      {isDesk && <DesktopFooter />}
    </div>
  );
}

// ── PDP ────────────────────────────────────────────────────────
const qtyBtn = (t) => ({
  width: 36, height: 36, borderRadius: 8, border: 'none',
  background: 'transparent', color: t.ink, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});

export function PDPScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();
  const isDesk = device === 'desktop';
  const p = PRODUCTS.find((x) => x.id === router.route.id) || PRODUCTS[0];
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState('about');

  const similar = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, isDesk ? 5 : 4);

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesk ? '1.1fr 1fr' : '1fr',
        gap: isDesk ? 40 : 0,
        padding: isDesk ? '24px 40px 40px' : 0,
      }}>
        {/* Image gallery */}
        <div>
          <div style={{ background: t.surface, padding: isDesk ? 32 : 0, borderRadius: isDesk ? 16 : 0, position: 'relative' }}>
            <div style={{ aspectRatio: '1 / 1', maxWidth: isDesk ? 520 : '100%', margin: '0 auto' }}>
              <ProductImage p={p} padding={isDesk ? 60 : 40} />
            </div>
            <div style={{ position: 'absolute', top: isDesk ? 24 : 12, left: isDesk ? 24 : 12,
              display: 'flex', flexDirection: 'column', gap: 6 }}>
              {p.old && <DiscountBadge pct={pctOff(p.price, p.old)} />}
              {p.hit && <HitBadge />}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, padding: isDesk ? '12px 0 0' : '12px 16px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{
                width: isDesk ? 72 : 56, height: isDesk ? 72 : 56, flexShrink: 0,
                borderRadius: 8, padding: 6, background: t.surface,
                boxShadow: i === 0 ? `0 0 0 2px ${t.primary}` : `0 0 0 1px ${t.border}`,
              }}>
                <ProductImage p={p} padding={4} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: isDesk ? 0 : '16px 16px 0' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{p.brand}</div>
          <h1 style={{ fontSize: isDesk ? 30 : 22, fontWeight: 900, margin: '6px 0 8px',
            letterSpacing: '-0.02em', lineHeight: 1.15 }}>{p.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <StarRating rating={p.rating} reviews={p.reviews} />
            <span style={{ fontSize: 13, color: t.muted }}>· арт. {p.id.toUpperCase()}</span>
          </div>

          {/* Price block */}
          <div style={{
            background: t.surfaceAlt, borderRadius: 16,
            padding: isDesk ? '20px 24px' : '14px 16px',
            display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: isDesk ? 38 : 30, fontWeight: 900, color: t.primary, letterSpacing: '-0.03em', lineHeight: 1 }}>{fmtRub(p.price)}</div>
              {p.old && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                  <span style={{ fontSize: 14, color: t.muted, textDecoration: 'line-through' }}>{fmtRub(p.old)}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: t.accent2 }}>−{fmtRub(p.old - p.price)} (−{pctOff(p.price, p.old)}%)</span>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.4, maxWidth: 220, fontWeight: 500 }}>
              <span style={{ color: t.ink, fontWeight: 700 }}>На складе:</span> 47 шт<br/>
              <span style={{ color: t.ink, fontWeight: 700 }}>Объём:</span> {p.vol}
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'stretch' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: t.surface, borderRadius: 12, boxShadow: `inset 0 0 0 1.5px ${t.border}`, padding: 4, gap: 4,
            }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn(t)}>{Icon.minus()}</button>
              <span style={{ width: 36, textAlign: 'center', fontWeight: 800, fontSize: 16 }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} style={qtyBtn(t)}>{Icon.plus()}</button>
            </div>
            <Button size="lg" block onClick={() => { cart.add(p.id, qty); router.go({ screen: 'cart' }); }}>
              {Icon.cart()} В корзину · {fmtRub(p.price * qty)}
            </Button>
          </div>

          {/* Trust strip */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {[
              { icon: Icon.truck,   t: 'Завтра',         s: 'доставим в Москве' },
              { icon: Icon.shield,  t: 'Оригинал',        s: 'гарантия от поставщика' },
              { icon: Icon.heart,   t: 'Возврат 14 дней', s: 'без объяснения причин' },
            ].map((u, i) => (
              <div key={i} style={{
                background: t.surface, padding: '12px 14px', borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 140,
                boxShadow: `inset 0 0 0 1px ${t.border}`,
              }}>
                <span style={{ color: t.primary, display: 'flex' }}>{u.icon()}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{u.t}</div>
                  <div style={{ fontSize: 11, color: t.muted }}>{u.s}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 24, borderBottom: `1.5px solid ${t.border}`, display: 'flex', gap: 24 }}>
            {[['about', 'Описание'], ['compose', 'Состав'], ['reviews', `Отзывы · ${p.reviews}`], ['delivery', 'Доставка']].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '12px 0', fontSize: 14, fontWeight: 700,
                color: tab === k ? t.ink : t.muted,
                borderBottom: tab === k ? `2.5px solid ${t.primary}` : '2.5px solid transparent',
                marginBottom: -1.5, fontFamily: 'inherit',
              }}>{l}</button>
            ))}
          </div>
          <div style={{ padding: '16px 0', fontSize: 14, lineHeight: 1.6, color: t.ink }}>
            {tab === 'about' && (
              <p style={{ margin: 0, maxWidth: 560 }}>
                Профессиональное средство по уходу с эффективной формулой. Подходит для ежедневного использования. Не содержит парабенов и сульфатов. Дерматологически тестировано. Подходит для чувствительной кожи и любого типа волос. Объём {p.vol}, страна-производитель — Россия. Срок годности — 24 месяца с даты производства, указанной на упаковке.
              </p>
            )}
            {tab === 'compose' && (
              <ul style={{ margin: 0, paddingLeft: 18, color: t.muted, lineHeight: 1.7 }}>
                <li>Aqua, Glycerin, Cetearyl Alcohol</li>
                <li>Tocopherol (витамин E)</li>
                <li>Panthenol (D5)</li>
                <li>Aloe Barbadensis Leaf Extract</li>
                <li>Parfum, Phenoxyethanol</li>
              </ul>
            )}
            {tab === 'reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { n: 'Анна К.',    d: '12 апр', r: 5, t: 'Беру уже третий раз — лучшая цена в Москве. Запах свежий, кожа после применения мягкая.' },
                  { n: 'Марина С.', d: '4 апр',  r: 5, t: 'Пришло быстро, упаковано хорошо. Качество как в дорогих магазинах, а цена в два раза ниже.' },
                  { n: 'Ольга Р.',  d: '28 мар', r: 4, t: 'Хороший продукт за свои деньги. Эффект заметен через неделю.' },
                ].map((r, i) => (
                  <div key={i} style={{ background: t.surface, padding: 14, borderRadius: 12, boxShadow: `inset 0 0 0 1px ${t.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ fontWeight: 800, fontSize: 13 }}>{r.n}</div>
                      <div style={{ display: 'flex', color: t.accent2, gap: 1 }}>
                        {[...Array(r.r)].map((_, j) => Icon.star(true, { key: j }))}
                      </div>
                      <div style={{ fontSize: 12, color: t.muted, marginLeft: 'auto' }}>{r.d}</div>
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>{r.t}</div>
                  </div>
                ))}
              </div>
            )}
            {tab === 'delivery' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div><b>Москва и МО:</b> завтра, бесплатно от 1 500 ₽</div>
                <div><b>СПб:</b> 2 дня, 199 ₽</div>
                <div><b>Регионы РФ:</b> 3–7 дней, СДЭК / Почта России</div>
                <div><b>Самовывоз:</b> бесплатно из 12 пунктов в Москве</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar */}
      <Section title="Похожие товары" device={device}>
        <div style={{
          display: 'grid', gap: isDesk ? 16 : 10,
          gridTemplateColumns: isDesk ? `repeat(${similar.length}, 1fr)` : 'repeat(2, 1fr)',
          padding: isDesk ? '0 40px' : '0 16px',
        }}>
          {similar.map((sp) => (
            <ProductCard key={sp.id} p={sp} onClick={() => router.go({ screen: 'pdp', id: sp.id })} />
          ))}
        </div>
      </Section>

      {isDesk && <DesktopFooter />}
    </div>
  );
}

// ── CART ───────────────────────────────────────────────────────
function Row({ k, v, accent }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
      <span style={{ color: t.muted }}>{k}</span>
      <span style={{ fontWeight: 800, color: accent ? t.accent2 : t.ink }}>{v}</span>
    </div>
  );
}

function PayBadge({ children }) {
  const t = useTheme();
  return (
    <div style={{
      padding: '4px 8px', background: t.surfaceAlt, color: t.muted,
      fontSize: 11, fontWeight: 800, borderRadius: 6, letterSpacing: '0.02em',
    }}>{children}</div>
  );
}

function CartLine({ p }) {
  const t = useTheme();
  const cart = useCart();
  return (
    <div style={{
      background: t.surface, borderRadius: 14, padding: 12,
      display: 'flex', gap: 12, alignItems: 'center',
      boxShadow: `inset 0 0 0 1px ${t.border}`,
    }}>
      <div style={{ width: 76, flexShrink: 0 }}><ProductImage p={p} padding={8} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: t.muted, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{p.brand}</div>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
        <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{p.vol}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        <PriceTag price={p.price * p.qty} old={p.old ? p.old * p.qty : null} size="sm" />
        <div style={{ display: 'flex', alignItems: 'center', background: t.surfaceAlt, borderRadius: 999, padding: 3 }}>
          <button onClick={() => cart.setQty(p.id, p.qty - 1)} style={{ ...qtyBtn(t), width: 28, height: 28, color: p.qty === 1 ? t.muted : t.ink }}>
            {p.qty === 1 ? Icon.trash() : Icon.minus()}
          </button>
          <span style={{ width: 28, textAlign: 'center', fontWeight: 800, fontSize: 14 }}>{p.qty}</span>
          <button onClick={() => cart.setQty(p.id, p.qty + 1)} style={{ ...qtyBtn(t), width: 28, height: 28 }}>{Icon.plus()}</button>
        </div>
      </div>
    </div>
  );
}

export function CartScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();
  const isDesk = device === 'desktop';
  const empty = cart.list.length === 0;

  if (empty) {
    return (
      <div style={{ background: t.bg, color: t.ink, minHeight: '100%',
        padding: '40px 24px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
        <div style={{ fontSize: 56 }}>🛒</div>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.01em' }}>Корзина пустая</div>
        <div style={{ fontSize: 14, color: t.muted, maxWidth: 280 }}>
          Добавляйте товары — мы напомним промокоды и предложим скидки на ваш набор.
        </div>
        <Button size="lg" onClick={() => router.go({ screen: 'home' })}>На главную</Button>
      </div>
    );
  }

  const delivery = cart.subtotal >= 1500 ? 0 : 199;
  const total = cart.subtotal + delivery;

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesk ? '1.5fr 1fr' : '1fr',
        gap: isDesk ? 32 : 0,
        padding: isDesk ? '24px 40px 40px' : 0,
      }}>
        <div>
          <h1 style={{ fontSize: isDesk ? 32 : 22, fontWeight: 900, letterSpacing: '-0.02em',
            margin: 0, padding: isDesk ? 0 : '14px 16px 8px' }}>
            Корзина · {cart.count} {cart.count === 1 ? 'товар' : (cart.count < 5 ? 'товара' : 'товаров')}
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: isDesk ? '20px 0 0' : '0 16px' }}>
            {cart.list.map((p) => <CartLine key={p.id} p={p} />)}
          </div>
          <div style={{ display: 'flex', gap: 8, padding: isDesk ? '20px 0 0' : '16px' }}>
            <input placeholder="Промокод" style={{
              flex: 1, padding: '12px 16px', borderRadius: 12,
              border: `1.5px solid ${t.border}`, background: t.surface, color: t.ink,
              fontSize: 14, fontFamily: 'inherit', outline: 'none',
            }} />
            <Button variant="ghost" size="md">Применить</Button>
          </div>
        </div>

        {/* Summary */}
        <div style={{ padding: isDesk ? 0 : '8px 16px 16px', position: isDesk ? 'sticky' : 'static', top: 20, alignSelf: 'flex-start' }}>
          <div style={{ background: t.surface, borderRadius: 16, padding: 20, boxShadow: `inset 0 0 0 1.5px ${t.border}` }}>
            <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 14 }}>Итого</div>
            <Row k="Товары" v={fmtRub(cart.subtotal)} />
            <Row k="Скидка" v={`−${fmtRub(cart.saved)}`} accent />
            <Row k="Доставка" v={delivery === 0 ? 'Бесплатно' : fmtRub(delivery)} />
            {delivery > 0 && (
              <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.4, marginTop: -4, marginBottom: 8 }}>
                Добавьте товаров на {fmtRub(1500 - cart.subtotal)} — доставка бесплатно
              </div>
            )}
            <div style={{ borderTop: `1.5px dashed ${t.border}`, margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>К оплате</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: t.primary, letterSpacing: '-0.02em' }}>{fmtRub(total)}</span>
            </div>
            <Button block size="lg" onClick={() => router.go({ screen: 'checkout' })}>Оформить заказ</Button>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <PayBadge>Visa</PayBadge><PayBadge>МИР</PayBadge><PayBadge>СБП</PayBadge><PayBadge>Долями</PayBadge>
            </div>
          </div>
        </div>
      </div>
      {isDesk && <DesktopFooter />}
    </div>
  );
}

// ── CHECKOUT ───────────────────────────────────────────────────
function Stepper({ step, steps }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: i + 1 <= step ? t.primary : t.surfaceAlt,
            color: i + 1 <= step ? '#fff' : t.muted,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 13, flexShrink: 0,
          }}>{i + 1}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: i + 1 <= step ? t.ink : t.muted }}>{s}</div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: t.border, marginLeft: 4 }} />}
        </div>
      ))}
    </div>
  );
}

function Block({ title, children }) {
  const t = useTheme();
  return (
    <div style={{ background: t.surface, borderRadius: 16, padding: 18, marginBottom: 12, boxShadow: `inset 0 0 0 1px ${t.border}` }}>
      <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  const t = useTheme();
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 12, color: t.muted, fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{
        width: '100%', padding: '12px 14px', borderRadius: 10,
        border: `1.5px solid ${t.border}`, background: t.bg, color: t.ink,
        fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
      }} />
    </label>
  );
}

function RadioRow({ checked, onClick, t: title, s: sub }) {
  const t = useTheme();
  return (
    <button onClick={onClick} style={{
      background: checked ? t.surfaceAlt : 'transparent',
      border: `1.5px solid ${checked ? t.primary : t.border}`, cursor: 'pointer',
      padding: '12px 14px', borderRadius: 12, textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit', width: '100%',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${checked ? t.primary : t.border}`,
        background: checked ? t.primary : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}>{checked && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.ink }}>{title}</div>
        <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{sub}</div>
      </div>
    </button>
  );
}

export function CheckoutScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();
  const isDesk = device === 'desktop';
  const [delivery, setDelivery] = React.useState('courier');
  const [pay, setPay] = React.useState('sbp');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [addr, setAddr] = React.useState('');

  const deliveryFee = delivery === 'pickup' ? 0 : (cart.subtotal >= 1500 ? 0 : 199);
  const total = cart.subtotal + deliveryFee;

  const place = () => { cart.clear(); router.go({ screen: 'order_done' }); };

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesk ? '1.4fr 1fr' : '1fr',
        gap: isDesk ? 32 : 0,
        padding: isDesk ? '24px 40px 40px' : '14px 16px 16px',
      }}>
        <div>
          <h1 style={{ fontSize: isDesk ? 32 : 22, fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 16px' }}>Оформление</h1>
          <Stepper step={1} steps={['Контакты', 'Доставка', 'Оплата']} />

          <Block title="1. Контактные данные">
            <Field label="Имя" value={name} onChange={setName} placeholder="Анна" />
            <Field label="Телефон" value={phone} onChange={setPhone} placeholder="+7 (___) ___-__-__" />
            <Field label="E-mail" value="" onChange={() => {}} placeholder="вы@почта.ру" />
          </Block>

          <Block title="2. Доставка">
            <RadioRow checked={delivery === 'courier'} onClick={() => setDelivery('courier')} t="Курьер" s="Завтра до 22:00 · 199 ₽ (бесплатно от 1 500 ₽)" />
            <RadioRow checked={delivery === 'pickup'}  onClick={() => setDelivery('pickup')}  t="Самовывоз" s="Сегодня после 18:00 · бесплатно · 12 точек в Москве" />
            <RadioRow checked={delivery === 'post'}    onClick={() => setDelivery('post')}    t="Почта России / СДЭК" s="3–7 дней · от 199 ₽" />
            {delivery !== 'pickup' && (
              <Field label="Адрес доставки" value={addr} onChange={setAddr} placeholder="Москва, ул. Ленина, 1, кв 5" />
            )}
          </Block>

          <Block title="3. Оплата">
            <RadioRow checked={pay === 'sbp'}   onClick={() => setPay('sbp')}   t="СБП"          s="Через приложение банка · без комиссии" />
            <RadioRow checked={pay === 'card'}   onClick={() => setPay('card')}  t="Картой онлайн" s="Visa, Mastercard, МИР" />
            <RadioRow checked={pay === 'split'}  onClick={() => setPay('split')} t="Долями"        s="4 платежа без переплат · одобрение за 1 минуту" />
            <RadioRow checked={pay === 'cash'}   onClick={() => setPay('cash')}  t="При получении" s="Наличными или картой курьеру" />
          </Block>

          {!isDesk && <Button block size="lg" onClick={place} style={{ marginTop: 16 }}>Оформить · {fmtRub(total)}</Button>}
        </div>

        {/* Summary */}
        <div style={{ position: isDesk ? 'sticky' : 'static', top: 20, alignSelf: 'flex-start' }}>
          <div style={{ background: t.surface, borderRadius: 16, padding: 20, boxShadow: `inset 0 0 0 1.5px ${t.border}` }}>
            <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 12 }}>Ваш заказ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12, maxHeight: 220, overflowY: 'auto' }}>
              {cart.list.slice(0, 4).map((p) => (
                <div key={p.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, flexShrink: 0 }}><ProductImage p={p} padding={4} /></div>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 12 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ color: t.muted }}>×{p.qty}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>{fmtRub(p.price * p.qty)}</div>
                </div>
              ))}
              {cart.list.length > 4 && <div style={{ fontSize: 12, color: t.muted }}>и ещё {cart.list.length - 4}…</div>}
            </div>
            <Row k="Товары" v={fmtRub(cart.subtotal)} />
            <Row k="Скидка" v={`−${fmtRub(cart.saved)}`} accent />
            <Row k="Доставка" v={deliveryFee === 0 ? 'Бесплатно' : fmtRub(deliveryFee)} />
            <div style={{ borderTop: `1.5px dashed ${t.border}`, margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>К оплате</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: t.primary }}>{fmtRub(total)}</span>
            </div>
            {isDesk && <Button block size="lg" onClick={place}>Оформить</Button>}
            <div style={{ fontSize: 11, color: t.muted, textAlign: 'center', marginTop: 10 }}>
              Нажимая «Оформить», вы соглашаетесь с условиями и обработкой персональных данных.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ORDER DONE ─────────────────────────────────────────────────
export function OrderDoneScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const orderNo = React.useMemo(() => '#' + Math.floor(100000 + Math.random() * 900000), []);
  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%',
      padding: '40px 24px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: t.primary, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' }}>Заказ оформлен!</div>
      <div style={{ fontSize: 15, color: t.muted, maxWidth: 380, lineHeight: 1.5 }}>
        Заказ <b style={{ color: t.ink }}>{orderNo}</b> принят. Мы прислали детали на телефон и e-mail. Курьер свяжется с вами завтра до 12:00.
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Button onClick={() => router.go({ screen: 'home' })}>На главную</Button>
        <Button variant="ghost" onClick={() => router.go({ screen: 'home' })}>Мои заказы</Button>
      </div>
    </div>
  );
}

// ── Desktop footer ─────────────────────────────────────────────
export function DesktopFooter() {
  const t = useTheme();
  return (
    <div style={{ background: t.headerBg, color: t.headerInk, padding: '40px 40px 24px', marginTop: 40 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Logo size={48} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: '0.04em' }}>ОПТОВЫЕ ЦЕНЫ</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>выбор · косметика · доставка</div>
            </div>
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.6, maxWidth: 320 }}>
            Косметика и парфюмерия по оптовым ценам. Прямые поставки от производителей. 100% оригинал, гарантия качества.
          </div>
        </div>
        {[
          { h: 'Покупателям', l: ['Доставка и оплата', 'Возврат', 'Гарантия', 'Программа лояльности'] },
          { h: 'Каталог',     l: ['Уход за лицом', 'Макияж', 'Парфюмерия', 'Волосы', 'Тело'] },
          { h: 'Компания',    l: ['О нас', 'Магазины', 'Вакансии', 'Контакты'] },
          { h: 'Контакты',    l: ['8 (800) 123-45-67', 'help@optcen.ru', 'Москва, ул. Тверская 12', 'пн-вс · 9:00–22:00'] },
        ].map((col) => (
          <div key={col.h}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.7 }}>{col.h}</div>
            {col.l.map((x) => <div key={x} style={{ fontSize: 13, opacity: 0.9, marginBottom: 6, cursor: 'pointer' }}>{x}</div>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 16, display: 'flex',
        justifyContent: 'space-between', fontSize: 12, opacity: 0.7 }}>
        <span>© 2026 Оптовые Цены 01. Все права защищены.</span>
        <span>Политика конфиденциальности · Оферта</span>
      </div>
    </div>
  );
}
