import React from 'react';
import { useTheme } from '../../shared/theme.jsx';
import { useCart } from '../../features/cart.jsx';
import { useFavorites } from '../../features/favorites.jsx';
import { useNotification } from '../../features/notification.jsx';
import { Icon } from '../../shared/ui/Icon.jsx';
import { StarRating } from '../../shared/ui/StarRating.jsx';
import { ProductImage } from './ProductImage.jsx';
import { PriceTag } from './PriceTag.jsx';
import { DiscountBadge } from './DiscountBadge.jsx';
import { HitBadge } from './HitBadge.jsx';
import { pctOff } from './model.js';

export function ProductCard({ p, onClick, layout = 'grid' }) {
  const t = useTheme();
  const cart = useCart();
  const favs = useFavorites();
  const notify = useNotification();
  const inCart = cart.items[p.id] > 0;
  const isFav = favs?.has(p.id);

  const handleAddCart = (e) => {
    e.stopPropagation();
    cart.add(p.id);
    if (!inCart) notify?.show(`${p.name} добавлен в корзину`, 'cart');
  };

  const handleFav = (e) => {
    e.stopPropagation();
    favs?.toggle(p.id);
    notify?.show(isFav ? 'Удалено из избранного' : `${p.brand} добавлен в избранное`, 'fav');
  };

  if (layout === 'list') {
    return (
      <div onClick={onClick} style={{
        background: t.cardBg, borderRadius: 4, border: `1px solid ${t.border}`, padding: 12,
        display: 'flex', gap: 12, cursor: 'pointer',
      }}>
        <div style={{ width: 96, flexShrink: 0 }}><ProductImage p={p} /></div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, color: t.muted, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{p.brand}</div>
          <div style={{ fontSize: 14, color: t.ink, fontWeight: 600, lineHeight: 1.25, marginTop: 2,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
            <PriceTag price={p.price} old={p.old} />
            <button onClick={handleAddCart} style={{
              background: inCart ? t.discountBg : 'transparent',
              color: inCart ? t.primaryDark : t.btnInk,
              border: `1.5px solid ${inCart ? 'transparent' : t.btnBorder}`, cursor: 'pointer', borderRadius: 4, padding: '8px 12px',
              fontWeight: 600, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>{inCart ? Icon.check({ width: 16, height: 16 }) : Icon.plus({ width: 16, height: 16 })} {inCart ? 'В корзине' : 'В корзину'}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} style={{
      background: t.cardBg, borderRadius: 4, border: `1px solid ${t.border}`,
      cursor: 'pointer', position: 'relative',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'relative' }}>
        <ProductImage p={p} padding={0} radius={0} />
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {p.old && p.old > p.price && <DiscountBadge pct={pctOff(p.price, p.old)} />}
          {p.hit && <HitBadge />}
        </div>
        <button onClick={handleFav} style={{
          position: 'absolute', top: 8, right: 8,
          width: 32, height: 32, borderRadius: '50%',
          background: isFav ? t.discountBg : t.surface,
          border: `1px solid ${isFav ? 'transparent' : t.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isFav ? t.primaryDark : t.muted,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={isFav ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 10px 0' }}>
        <StarRating rating={p.rating} reviews={p.reviews} compact />
        <div style={{ fontSize: 11, color: t.muted, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{p.brand}</div>
        <div style={{ fontSize: 13, color: t.ink, fontWeight: 600, lineHeight: 1.25,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 32 }}>{p.name}</div>
        <div style={{ fontSize: 11, color: t.muted }}>{p.vol}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: '0 10px 10px' }}>
        <PriceTag price={p.price} old={p.old} />
        <button onClick={handleAddCart} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: inCart ? t.discountBg : 'transparent',
          color: inCart ? t.primaryDark : t.btnInk,
          border: `1.5px solid ${inCart ? 'transparent' : t.btnBorder}`, cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{inCart ? Icon.check({ width: 16, height: 16 }) : Icon.plus({ width: 16, height: 16 })}</button>
      </div>
    </div>
  );
}
