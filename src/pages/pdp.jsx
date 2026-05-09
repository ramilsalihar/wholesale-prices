import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useCart } from '../features/cart.jsx';
import { useFavorites } from '../features/favorites.jsx';
import { useNotification } from '../features/notification.jsx';
import { PRODUCTS, fmtRub, pctOff } from '../entities/product/model.js';
import { Icon } from '../shared/ui/Icon.jsx';
import { Button } from '../shared/ui/Button.jsx';
import { StarRating } from '../shared/ui/StarRating.jsx';
import { Section } from '../shared/ui/Section.jsx';
import { ProductImage } from '../entities/product/ProductImage.jsx';
import { PriceTag } from '../entities/product/PriceTag.jsx';
import { DiscountBadge } from '../entities/product/DiscountBadge.jsx';
import { HitBadge } from '../entities/product/HitBadge.jsx';
import { ProductCard } from '../entities/product/ProductCard.jsx';
import { DesktopFooter } from '../widgets/DesktopFooter.jsx';

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
  const favs = useFavorites();
  const notify = useNotification();
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState('about');
  const isFav = favs.has(p.id);

  const similar = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, isDesk ? 5 : 4);

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesk ? '1.1fr 1fr' : '1fr',
        gap: isDesk ? 40 : 0,
        padding: isDesk ? '24px 40px 40px' : 0,
      }}>
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

        <div style={{ padding: isDesk ? 0 : '16px 16px 0' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{p.brand}</div>
          <h1 style={{ fontSize: isDesk ? 30 : 22, fontWeight: 900, margin: '6px 0 8px',
            letterSpacing: '-0.02em', lineHeight: 1.15 }}>{p.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <StarRating rating={p.rating} reviews={p.reviews} />
            <span style={{ fontSize: 13, color: t.muted }}>· арт. {p.id.toUpperCase()}</span>
          </div>

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
            <button
              onClick={() => {
                favs.toggle(p.id);
                notify.show(isFav ? `Удалено из избранного` : `${p.name} — добавлено в избранное`);
              }}
              style={{
                width: 48, height: 'auto', flexShrink: 0, borderRadius: 12,
                border: `1.5px solid ${isFav ? t.primary : t.border}`,
                background: isFav ? t.primary : t.surface,
                color: isFav ? '#fff' : t.muted,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              {Icon.heart({ width: 20, height: 20, fill: isFav ? 'currentColor' : 'none' })}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {[
              { icon: Icon.truck,   t: 'Завтра',         s: 'доставим в Бишкеке' },
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
                <div><b>Бишкек:</b> завтра, бесплатно от 1 500 с</div>
                <div><b>Ош / Жалал-Абад:</b> 2 дня, 199 с</div>
                <div><b>Регионы КР:</b> 3–7 дней, Кыргыз Почтасы</div>
                <div><b>Самовывоз:</b> бесплатно из 12 точек в Бишкеке</div>
              </div>
            )}
          </div>
        </div>
      </div>

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
