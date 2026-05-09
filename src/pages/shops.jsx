import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { Icon } from '../shared/ui/Icon.jsx';
import { DesktopFooter } from '../widgets/DesktopFooter.jsx';

const SHOPS = [
  {
    id: 1,
    name: 'Оптовые цены 01 · Киевская',
    address: 'ул. Киевская, 69, 1 этаж',
    district: 'Первомайский район',
    city: 'Бишкек, 720040',
    hours: '09:00 – 21:00',
    rating: 4.0,
    reviews: 1489,
    mapUrl: 'https://2gis.kg/bishkek/branches/70000001036586855/firm/70000001036586856/74.605312%2C42.874828',
    badge: 'Главный',
  },
  {
    id: 2,
    name: 'Оптовые цены 01 · Гражданская',
    address: 'ул. Гражданская, 2',
    district: 'Свердловский район',
    city: 'Бишкек, 720065',
    hours: '09:00 – 21:00',
    rating: 4.5,
    reviews: 732,
    mapUrl: 'https://2gis.kg/bishkek/branches/70000001036586855/firm/70000001077243451/74.636694%2C42.875686',
  },
  {
    id: 3,
    name: 'Оптовые цены 01 · Дуйшеева',
    address: 'ул. Арстанбека Дуйшеева, 6/5',
    district: 'Октябрьский район',
    city: 'Бишкек, 720060',
    hours: '09:00 – 21:00',
    rating: 4.0,
    reviews: 193,
    mapUrl: 'https://2gis.kg/bishkek/firm/70000001102767646',
  },
  {
    id: 4,
    name: 'Оптовые цены 01 · Ахунбаева',
    address: 'ул. Исы Ахунбаева, 101',
    district: 'Первомайский район',
    city: 'Бишкек, 720055',
    hours: '09:00 – 21:00',
    rating: 4.2,
    reviews: 34,
    mapUrl: 'https://2gis.kg/bishkek/branches/70000001036586855/geo/15763234351138719/74.60829%2C42.843155',
  },
];

function StarRow({ rating, reviews }) {
  const t = useTheme();
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ display: 'flex', gap: 2, color: '#F89020' }}>
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="13" height="13" viewBox="0 0 24 24"
            fill={i < full || (i === full && half) ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color: t.ink }}>{rating.toFixed(1)}</span>
      <span style={{ fontSize: 12, color: t.muted }}>· {reviews.toLocaleString('ru-RU')} отзывов</span>
    </div>
  );
}

function ShopCard({ shop, isDesk }) {
  const t = useTheme();
  return (
    <div style={{
      background: t.surface, borderRadius: 18,
      boxShadow: `inset 0 0 0 1.5px ${t.border}`,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${t.primary}18 0%, ${t.accent}18 100%)`,
        padding: isDesk ? '24px 24px 20px' : '18px 18px 14px',
        borderBottom: `1px solid ${t.border}`,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: t.primary,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: isDesk ? 16 : 14, letterSpacing: '-0.01em', color: t.ink }}>{shop.name}</div>
            <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{shop.district}</div>
          </div>
        </div>
        {shop.badge && (
          <div style={{
            background: t.primary, color: '#fff',
            fontSize: 11, fontWeight: 900, padding: '4px 10px', borderRadius: 999,
            letterSpacing: '0.03em', flexShrink: 0,
          }}>{shop.badge}</div>
        )}
      </div>

      <div style={{ padding: isDesk ? '20px 24px' : '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ color: t.primary, display: 'flex', flexShrink: 0, marginTop: 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.ink }}>{shop.address}</div>
            <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{shop.city}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: t.primary, display: 'flex', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>{shop.hours}</span>
        </div>

        <StarRow rating={shop.rating} reviews={shop.reviews} />
      </div>

      <div style={{ padding: isDesk ? '0 24px 20px' : '0 18px 16px' }}>
        <a
          href={shop.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: t.primary, color: '#fff', borderRadius: 12,
            padding: '12px 16px', fontWeight: 800, fontSize: 14,
            textDecoration: 'none', fontFamily: 'inherit',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          Открыть на карте 2GIS
        </a>
      </div>
    </div>
  );
}

export function ShopsScreen({ device }) {
  const t = useTheme();
  const isDesk = device === 'desktop';

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
      <div style={{
        background: `linear-gradient(135deg, ${t.primary} 0%, #8b004a 100%)`,
        padding: isDesk ? '48px 40px 44px' : '28px 20px 32px',
        color: '#fff',
      }}>
        <div style={{ fontSize: isDesk ? 38 : 26, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          🏪 Наши магазины
        </div>
        <div style={{ fontSize: isDesk ? 15 : 13, marginTop: 8, opacity: 0.9 }}>
          4 магазина в Бишкеке · работаем ежедневно с 09:00
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { icon: '📍', label: '4 точки в Бишкеке' },
            { icon: '🕐', label: 'Ежедневно 09:00–21:00' },
            { icon: '🛍️', label: 'Самовывоз бесплатно' },
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

      <div style={{ padding: isDesk ? '40px 40px 60px' : '20px 16px 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesk ? 'repeat(2, 1fr)' : '1fr',
          gap: isDesk ? 20 : 14,
        }}>
          {SHOPS.map((shop) => (
            <ShopCard key={shop.id} shop={shop} isDesk={isDesk} />
          ))}
        </div>

        <div style={{
          marginTop: isDesk ? 40 : 28,
          background: t.surfaceAlt, borderRadius: 16,
          padding: isDesk ? '24px 28px' : '18px 20px',
          display: 'flex', flexDirection: isDesk ? 'row' : 'column',
          alignItems: isDesk ? 'center' : 'flex-start',
          gap: 16, border: `1.5px solid ${t.border}`,
        }}>
          <div style={{ fontSize: isDesk ? 40 : 32 }}>📦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: isDesk ? 16 : 15, color: t.ink }}>Самовывоз — бесплатно</div>
            <div style={{ fontSize: 13, color: t.muted, marginTop: 4, lineHeight: 1.5 }}>
              Оформите заказ онлайн и заберите из любого магазина в тот же день. Готовность заказа — от 2 часов. Уточняйте наличие через Instagram.
            </div>
          </div>
          <a
            href="https://www.instagram.com/optovye_ceny01_/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: t.primary, color: '#fff', borderRadius: 12,
              padding: '12px 20px', fontWeight: 800, fontSize: 14,
              textDecoration: 'none', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Instagram
          </a>
        </div>
      </div>

      {isDesk && <DesktopFooter />}
    </div>
  );
}
