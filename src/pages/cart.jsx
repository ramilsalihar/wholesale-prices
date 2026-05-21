import React from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useCart } from '../features/cart.jsx';
import { fmtRub } from '../entities/product/model.js';
import { Icon } from '../shared/ui/Icon.jsx';
import { Button } from '../shared/ui/Button.jsx';
import { ProductImage } from '../entities/product/ProductImage.jsx';
import { PriceTag } from '../entities/product/PriceTag.jsx';
import { DesktopFooter } from '../widgets/DesktopFooter.jsx';

const RECIPIENT_LABELS = {
  mama: 'Маме', friend: 'Подруге', love: 'Любимой',
  sister: 'Сестре', colleague: 'Коллеге', self: 'Себе', other: 'Другому',
};

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

function GiftOverlay({ box, onClose }) {
  const t = useTheme();
  const cart = useCart();

  function handleRemove() {
    cart.removeGiftBox(box.id);
    onClose();
  }

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: t.bg, borderRadius: '20px 20px 0 0',
          width: '100%', maxWidth: 600,
          maxHeight: '90dvh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Handle + header */}
        <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: t.border, margin: '0 auto 16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: t.primary, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Подарочный набор
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: t.ink, marginTop: 2 }}>
                {box.recipientName || RECIPIENT_LABELS[box.recipient] || 'Получатель'}
              </div>
            </div>
            <button onClick={onClose} style={{
              background: t.surfaceAlt, border: 'none', borderRadius: '50%',
              width: 36, height: 36, fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.ink,
            }}>✕</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {/* Recipient info */}
          {(box.recipientPhone || box.occasion) && (
            <div style={{
              background: t.surfaceAlt, borderRadius: 12, padding: '12px 14px',
              marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              {box.occasion && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: t.muted, fontWeight: 600 }}>Повод</span>
                  <span style={{ color: t.ink, fontWeight: 700 }}>
                    {({ birthday: 'День рождения', march8: '8 Марта', newyear: 'Новый год', justso: 'Просто так', other: 'Другой повод' })[box.occasion] || box.occasion}
                  </span>
                </div>
              )}
              {box.recipientPhone && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: t.muted, fontWeight: 600 }}>Телефон</span>
                  <span style={{ color: t.ink, fontWeight: 700 }}>{box.recipientPhone}</span>
                </div>
              )}
            </div>
          )}

          {/* Product thumbnails */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {box.products?.map(p => (
              <div key={p.id} style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 10, overflow: 'hidden', border: `1px solid ${t.border}` }}>
                <ProductImage p={p} padding={0} radius={0} />
              </div>
            ))}
          </div>

          {/* Product list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 16, borderRadius: 12, overflow: 'hidden', border: `1px solid ${t.border}` }}>
            {box.products?.map((p, i) => (
              <div key={p.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 14px', fontSize: 13,
                borderTop: i > 0 ? `1px solid ${t.border}` : 'none',
                background: t.surface,
              }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 11, color: t.muted, fontWeight: 700, textTransform: 'uppercase' }}>{p.brand}</div>
                  <div style={{ fontWeight: 600, color: t.ink, marginTop: 1,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                    {p.name}
                  </div>
                </div>
                <span style={{ color: t.primary, fontWeight: 800, flexShrink: 0, marginLeft: 12 }}>{fmtRub(p.price)}</span>
              </div>
            ))}
          </div>

          {/* Letter */}
          {box.letter?.trim() && (
            <div style={{
              background: `${t.primary}0a`, border: `1px solid ${t.primary}30`,
              borderRadius: 12, padding: '14px 16px', marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, color: t.primary, fontWeight: 800, letterSpacing: '0.04em', marginBottom: 6 }}>ПИСЬМО</div>
              <div style={{ fontSize: 14, color: t.ink, fontStyle: 'italic', lineHeight: 1.6 }}>
                «{box.letter.trim()}»
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px 24px', borderTop: `1px solid ${t.border}`, flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button onClick={handleRemove} style={{
            background: 'transparent', border: `1.5px solid ${t.border}`,
            color: t.muted, padding: '11px 16px', borderRadius: 12,
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
          }}>🗑 Удалить</button>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: t.muted }}>Итого</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: t.primary, letterSpacing: '-0.02em' }}>{fmtRub(box.totalPrice)}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function GiftBoxLine({ box }) {
  const t = useTheme();
  const [showOverlay, setShowOverlay] = React.useState(false);
  const name = box.recipientName || RECIPIENT_LABELS[box.recipient] || 'Получатель';

  return (
    <>
      <div
        onClick={() => setShowOverlay(true)}
        style={{
          background: t.surface, borderRadius: 14,
          boxShadow: `inset 0 0 0 1.5px ${t.primary}50`,
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
          cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: 28, flexShrink: 0 }}>🎁</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: t.primary, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Подарочный набор</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: t.ink }}>{name}</div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 1 }}>
            {box.products?.length ?? 0} товара · {fmtRub(box.totalPrice)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: t.primary }}>{fmtRub(box.totalPrice)}</span>
          <span style={{ fontSize: 11, color: t.muted, fontWeight: 700 }}>Подробнее →</span>
        </div>
      </div>
      {showOverlay && <GiftOverlay box={box} onClose={() => setShowOverlay(false)} />}
    </>
  );
}

export function CartScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();
  const isDesk = device === 'desktop';
  const empty = cart.list.length === 0 && cart.giftBoxes.length === 0;

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

  const SummaryBox = (
    <div style={{ background: t.surface, borderRadius: isDesk ? 16 : 0, padding: 20, boxShadow: isDesk ? `inset 0 0 0 1.5px ${t.border}` : `0 -1px 0 ${t.border}` }}>
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
  );

  if (isDesk) {
    return (
      <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32, padding: '24px 40px 40px' }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
              Корзина · {cart.count} {cart.count === 1 ? 'товар' : (cart.count < 5 ? 'товара' : 'товаров')}
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 0 0' }}>
              {cart.list.map((p) => <CartLine key={p.id} p={p} />)}
              {cart.giftBoxes.map((box) => <GiftBoxLine key={box.id} box={box} />)}
            </div>
            <div style={{ display: 'flex', gap: 8, padding: '20px 0 0' }}>
              <input placeholder="Промокод" style={{
                flex: 1, padding: '12px 16px', borderRadius: 12,
                border: `1.5px solid ${t.border}`, background: t.surface, color: t.ink,
                fontSize: 14, fontFamily: 'inherit', outline: 'none',
              }} />
              <Button variant="ghost" size="md">Применить</Button>
            </div>
          </div>
          <div style={{ position: 'sticky', top: 20, alignSelf: 'flex-start' }}>
            {SummaryBox}
          </div>
        </div>
        <DesktopFooter />
      </div>
    );
  }

  return (
    <div style={{ background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', margin: 0, padding: '14px 16px 8px' }}>
          Корзина · {cart.count} {cart.count === 1 ? 'товар' : (cart.count < 5 ? 'товара' : 'товаров')}
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
          {cart.list.map((p) => <CartLine key={p.id} p={p} />)}
          {cart.giftBoxes.map((box) => <GiftBoxLine key={box.id} box={box} />)}
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '16px' }}>
          <input placeholder="Промокод" style={{
            flex: 1, padding: '12px 16px', borderRadius: 12,
            border: `1.5px solid ${t.border}`, background: t.surface, color: t.ink,
            fontSize: 14, fontFamily: 'inherit', outline: 'none',
          }} />
          <Button variant="ghost" size="md">Применить</Button>
        </div>
      </div>
      <div style={{ position: 'sticky', bottom: 0, zIndex: 5 }}>
        {SummaryBox}
      </div>
    </div>
  );
}
