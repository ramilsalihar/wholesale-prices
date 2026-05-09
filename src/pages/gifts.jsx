import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { pctOff, fmtRub } from '../entities/product/model.js';
import { useData } from '../features/data.jsx';
import { Section, Carousel } from '../shared/ui/Section.jsx';
import { ProductCard } from '../entities/product/ProductCard.jsx';

export function GiftsScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const { products } = useData();
  const isDesk = device === 'desktop';

  const sales = [...products]
    .filter((p) => p.old)
    .sort((a, b) => pctOff(b.price, b.old) - pctOff(a.price, a.old))
    .slice(0, 10);

  const giftSets = products.filter((p) => p.cat === 'gifts');

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%', paddingBottom: isDesk ? 60 : 16 }}>
      <div style={{
        background: `linear-gradient(135deg, ${t.primary} 0%, #b8005f 100%)`,
        padding: isDesk ? '40px 40px 32px' : '24px 16px 20px',
        color: '#fff',
      }}>
        <div style={{ fontSize: isDesk ? 32 : 24, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          🎁 Подарки и акции
        </div>
        <div style={{ fontSize: isDesk ? 15 : 13, marginTop: 6, opacity: 0.9 }}>
          Лучшие скидки и подарочные наборы
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Скидки до 60%', icon: '🔥' },
            { label: 'Бесплатная доставка', icon: '🚚' },
            { label: 'Красивая упаковка', icon: '🎀' },
          ].map((b) => (
            <div key={b.label} style={{
              background: 'rgba(255,255,255,0.18)', borderRadius: 999,
              padding: '5px 12px', fontSize: 12, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <span>{b.icon}</span>{b.label}
            </div>
          ))}
        </div>
      </div>

      <Section title="🔥 Горячие скидки" sub="Сортировано по размеру скидки" device={device}
        onSeeAll={() => router.go({ screen: 'catalog' })}>
        <Carousel device={device}>
          {sales.map((p) => (
            <div key={p.id} style={{ width: isDesk ? 240 : 168, flexShrink: 0 }}>
              <ProductCard p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
            </div>
          ))}
        </Carousel>
      </Section>

      <Section title="🎁 Подарочные наборы" sub="Готовые идеи для подарка" device={device}>
        <div style={{
          display: 'grid', gap: isDesk ? 16 : 10,
          gridTemplateColumns: isDesk ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
          padding: isDesk ? '0 40px' : '0 16px',
        }}>
          {giftSets.map((p) => (
            <ProductCard key={p.id} p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
          ))}
        </div>
      </Section>

      <div style={{ padding: isDesk ? '32px 40px' : '20px 16px' }}>
        <div style={{
          background: t.surfaceAlt, borderRadius: 16,
          padding: isDesk ? '24px 28px' : '16px 20px',
          display: 'flex', flexDirection: isDesk ? 'row' : 'column',
          alignItems: isDesk ? 'center' : 'flex-start',
          gap: 16, border: `1.5px solid ${t.border}`,
        }}>
          <div style={{ fontSize: isDesk ? 48 : 36 }}>🎀</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: isDesk ? 18 : 16, color: t.ink }}>
              Подарочная упаковка
            </div>
            <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>
              Оформим любой товар в подарочную упаковку — лента, коробка, открытка. Бесплатно при заказе от 1 500 с.
            </div>
          </div>
          <button
            onClick={() => router.go({ screen: 'catalog' })}
            style={{
              background: t.primary, color: '#fff', border: 'none', cursor: 'pointer',
              padding: '12px 20px', borderRadius: 12, fontWeight: 800, fontSize: 14,
              fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Выбрать товар
          </button>
        </div>
      </div>
    </div>
  );
}
