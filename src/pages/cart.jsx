import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useCart } from '../features/cart.jsx';
import { fmtRub } from '../entities/product/model.js';
import { Icon } from '../shared/ui/Icon.jsx';
import { Button } from '../shared/ui/Button.jsx';
import { ProductImage } from '../entities/product/ProductImage.jsx';
import { PriceTag } from '../entities/product/PriceTag.jsx';
import { DesktopFooter } from '../widgets/DesktopFooter.jsx';

const qtyBtn = (t) => ({
  width: 28, height: 28, borderRadius: 8, border: 'none',
  background: 'transparent', color: t.ink, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});

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
          <button onClick={() => cart.setQty(p.id, p.qty - 1)} style={{ ...qtyBtn(t), color: p.qty === 1 ? t.muted : t.ink }}>
            {p.qty === 1 ? Icon.trash() : Icon.minus()}
          </button>
          <span style={{ width: 28, textAlign: 'center', fontWeight: 800, fontSize: 14 }}>{p.qty}</span>
          <button onClick={() => cart.setQty(p.id, p.qty + 1)} style={qtyBtn(t)}>{Icon.plus()}</button>
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
