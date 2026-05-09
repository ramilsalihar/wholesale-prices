import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { fmtRub } from '../entities/product/model.js';
import { useData } from '../features/data.jsx';
import { ProductImage } from '../entities/product/ProductImage.jsx';

export function RightPanel() {
  const t = useTheme();
  const router = useRouter();
  const { products } = useData();

  const newItems = ['p13', 'p05', 'p03'].map((id) => products.find((p) => p.id === id)).filter(Boolean);
  const featured = products.find((p) => p.id === 'p11');

  return (
    <div style={{
      width: 300, flexShrink: 0,
      borderLeft: `1px solid ${t.border}`, background: t.surface,
      overflowY: 'auto',
    }}>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: t.ink }}>Новинки</div>
          <button onClick={() => router.go({ screen: 'catalog' })} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 800, color: t.primary, fontFamily: 'inherit',
          }}>Смотреть все</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {newItems.map((p) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 12,
              background: t.bg, boxShadow: `inset 0 0 0 1px ${t.border}`,
            }}>
              <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 10, overflow: 'hidden' }}>
                <ProductImage p={p} padding={4} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: t.ink,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 1 }}>{p.brand}</div>
              </div>
              <button onClick={() => router.go({ screen: 'pdp', id: p.id })} style={{
                background: 'transparent', border: `1.5px solid ${t.border}`,
                color: t.ink, cursor: 'pointer', borderRadius: 8,
                padding: '5px 10px', fontSize: 11, fontWeight: 800, fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}>Смотреть</button>
            </div>
          ))}
        </div>
      </div>

      {featured && (
        <div style={{ padding: 20 }}>
          <div style={{ borderRadius: 16, overflow: 'hidden', background: t.bg, boxShadow: `inset 0 0 0 1px ${t.border}` }}>
            <div style={{ height: 160, background: t.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 120, height: 120 }}><ProductImage p={featured} padding={8} /></div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{
                display: 'inline-block', padding: '4px 10px', borderRadius: 999, marginBottom: 8,
                background: t.surfaceAlt, fontSize: 11, fontWeight: 800, color: t.primary,
              }}>Парфюмерия</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: t.ink, letterSpacing: '-0.01em', marginBottom: 6 }}>{featured.name}</div>
              <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.5, marginBottom: 14 }}>
                Изысканный цветочный аромат. Лёгкий и свежий, идеален для ежедневного ношения.
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                {[
                  { v: featured.vol,                              l: 'Объём'   },
                  { v: `${featured.rating}/5`,                    l: 'Рейтинг' },
                  { v: `${(featured.reviews / 1000).toFixed(1)}k`, l: 'Отзывы'  },
                ].map((s) => (
                  <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: t.ink }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: t.muted, marginTop: 2, fontWeight: 600 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => router.go({ screen: 'pdp', id: featured.id })} style={{
                width: '100%', padding: '13px', borderRadius: 12,
                background: t.primary, color: '#fff',
                border: 'none', cursor: 'pointer',
                fontWeight: 800, fontSize: 14, fontFamily: 'inherit',
              }}>В каталог · {fmtRub(featured.price)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
