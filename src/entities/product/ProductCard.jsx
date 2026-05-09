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
        background: t.cardBg, borderRadius: 14, padding: 12,
        display: 'flex', gap: 12, cursor: 'pointer',
        boxShadow: `0 1px 0 ${t.border}`,
      }}>
        <div style={{ width: 96, flexShrink: 0 }}><ProductImage p={p} /></div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, color: t.muted, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{p.brand}</div>
          <div style={{ fontSize: 14, color: t.ink, fontWeight: 600, lineHeight: 1.25, marginTop: 2,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
            <PriceTag price={p.price} old={p.old} />
            <button onClick={handleAddCart} style={{
              background: inCart ? t.accent : t.btnBg, color: inCart ? '#1A0A14' : t.btnInk,
              border: 'none', cursor: 'pointer', borderRadius: 10, padding: '8px 12px',
              fontWeight: 800, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>{inCart ? Icon.check() : Icon.plus()} {inCart ? 'В корзине' : 'В корзину'}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} style={{
      background: t.cardBg, borderRadius: 14, padding: 10,
      cursor: 'pointer', position: 'relative',
      boxShadow: `0 1px 0 ${t.border}`,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ position: 'relative' }}>
        <ProductImage p={p} />
        <div style={{ position: 'absolute', top: 6, left: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {p.old && p.old > p.price && <DiscountBadge pct={pctOff(p.price, p.old)} />}
          {p.hit && <HitBadge />}
        </div>
        <button onClick={handleFav} style={{
          position: 'absolute', top: 6, right: 6,
          width: 32, height: 32, borderRadius: '50%',
          background: isFav ? t.primary : 'rgba(255,255,255,0.9)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isFav ? '#fff' : t.muted,
          boxShadow: isFav ? `0 2px 8px rgba(0,0,0,0.2)` : 'none',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={isFav ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.8 5.6a5.5 5.5 0 0 0-8.8.7 5.5 5.5 0 0 0-8.8-.7 5.7 5.7 0 0 0 0 7.9L12 22.4l8.8-8.9a5.7 5.7 0 0 0 0-7.9z" />
          </svg>
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 2px' }}>
        <StarRating rating={p.rating} reviews={p.reviews} compact />
        <div style={{ fontSize: 11, color: t.muted, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{p.brand}</div>
        <div style={{ fontSize: 13, color: t.ink, fontWeight: 600, lineHeight: 1.25,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 32 }}>{p.name}</div>
        <div style={{ fontSize: 11, color: t.muted }}>{p.vol}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: '0 2px 2px' }}>
        <PriceTag price={p.price} old={p.old} />
        <button onClick={handleAddCart} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: inCart ? t.accent : t.btnBg, color: inCart ? '#1A0A14' : t.btnInk,
          border: 'none', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        }}>{inCart ? Icon.check() : Icon.plus()}</button>
      </div>
    </div>
  );
}
