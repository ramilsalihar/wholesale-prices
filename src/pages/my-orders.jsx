import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useAuth } from '../features/auth.jsx';
import { useData } from '../features/data.jsx';
import { fetchMyOrders, statusInfo, ORDER_STATUSES } from '../service/clientOrders.js';
import { loadGifts, deleteGift } from '../features/giftsStorage.js';
import { ProductImage } from '../entities/product/ProductImage.jsx';
import { fmtRub } from '../entities/product/model.js';

const DELIVERY_LABELS = { courier: 'Курьер', pickup: 'Самовывоз', post: 'Почта' };
const PAY_LABELS      = { card: 'Картой онлайн', cash: 'При получении', sbp: 'СБП', split: 'Долями' };

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
}

function fmtMoney(n) { return n != null ? n.toLocaleString('ru-RU') + ' с' : '—'; }

function shortId(id) { return id ? id.slice(0, 8).toUpperCase() : '—'; }

// ── Status progress track ────────────────────────────────────────

const PROGRESS_STATUSES = ['new', 'confirmed', 'shipped', 'delivered'];

function StatusTrack({ status }) {
  const t = useTheme();
  if (status === 'cancelled') {
    const s = statusInfo('cancelled');
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: s.bg, borderRadius: 12 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>Заказ отменён</span>
      </div>
    );
  }
  const currentIdx = PROGRESS_STATUSES.indexOf(status);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '14px 0' }}>
      {PROGRESS_STATUSES.map((key, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        const s = statusInfo(key);
        const labels = { new: 'Принят', confirmed: 'Подтверждён', shipped: 'Отправлен', delivered: 'Доставлен' };
        return (
          <React.Fragment key={key}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
              <div style={{
                width: active ? 28 : 22, height: active ? 28 : 22,
                borderRadius: '50%',
                background: done ? (active ? s.color : t.primary) : t.border,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
                boxShadow: active ? `0 0 0 4px ${s.bg}` : 'none',
              }}>
                {done && !active && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 600, color: done ? (active ? s.color : t.ink) : t.muted, textAlign: 'center', letterSpacing: '0.01em' }}>
                {labels[key]}
              </span>
            </div>
            {i < PROGRESS_STATUSES.length - 1 && (
              <div style={{ height: 2, flex: 0.6, background: i < currentIdx ? t.primary : t.border, marginBottom: 20, transition: 'background 0.2s' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Order ticket ─────────────────────────────────────────────────

function OrderTicket({ order, onBack, isDesk }) {
  const t = useTheme();
  const items = Array.isArray(order.items) ? order.items : [];
  const s = statusInfo(order.status);

  return (
    <div>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.muted, fontSize: 13, fontWeight: 700, padding: '0 0 16px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
      >
        ← Назад к заказам
      </button>

      {/* Ticket card */}
      <div style={{ background: t.surface, borderRadius: 20, overflow: 'hidden', boxShadow: `inset 0 0 0 1.5px ${t.border}` }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${t.primary} 0%, #8b004a 100%)`,
          padding: '24px 24px 20px', color: '#fff',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.8, marginBottom: 6 }}>ЗАКАЗ</div>
          <div style={{ fontSize: 26, fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.05em' }}>#{shortId(order.id)}</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{fmtDate(order.created_at)}</div>
        </div>

        {/* Dashed separator */}
        <div style={{ position: 'relative', height: 0, overflow: 'visible' }}>
          <div style={{ position: 'absolute', left: -1, right: -1, top: 0, borderTop: `2px dashed ${t.border}` }} />
          <div style={{ position: 'absolute', left: -12, width: 24, height: 24, borderRadius: '50%', background: t.bg, top: -12 }} />
          <div style={{ position: 'absolute', right: -12, width: 24, height: 24, borderRadius: '50%', background: t.bg, top: -12 }} />
        </div>

        <div style={{ padding: '24px 24px 20px' }}>
          {/* Status track */}
          <StatusTrack status={order.status} />

          <div style={{ height: 1, background: t.border, margin: '12px 0 20px' }} />

          {/* Items */}
          <div style={{ fontSize: 12, fontWeight: 700, color: t.muted, letterSpacing: '0.06em', marginBottom: 10 }}>ТОВАРЫ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                  {item.brand && <div style={{ fontSize: 11, color: t.muted }}>{item.brand}</div>}
                </div>
                <div style={{ fontSize: 12, color: t.muted, flexShrink: 0 }}>×{item.qty}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: t.ink, flexShrink: 0 }}>{fmtMoney(item.price * item.qty)}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px dashed ${t.border}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              ['Подытог', fmtMoney(order.subtotal)],
              ['Доставка', order.delivery === 0 ? 'Бесплатно' : fmtMoney(order.delivery)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: t.muted }}>{k}</span>
                <span style={{ color: t.ink }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, marginTop: 6 }}>
              <span style={{ color: t.ink }}>Итого</span>
              <span style={{ color: t.primary }}>{fmtMoney(order.total)}</span>
            </div>
          </div>

          <div style={{ height: 1, background: t.border, margin: '16px 0' }} />

          {/* Delivery details */}
          <div style={{ display: 'grid', gridTemplateColumns: isDesk ? '1fr 1fr 1fr 1fr' : '1fr 1fr', gap: 12 }}>
            {[
              ['Доставка', DELIVERY_LABELS[order.delivery_method] ?? order.delivery_method],
              ['Оплата', PAY_LABELS[order.pay_method] ?? order.pay_method],
              order.address && ['Адрес', order.address],
              order.phone   && ['Телефон', order.phone],
            ].filter(Boolean).map(([k, v]) => v ? (
              <div key={k}>
                <div style={{ fontSize: 10, fontWeight: 700, color: t.muted, letterSpacing: '0.06em', marginBottom: 3 }}>{k.toUpperCase()}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.ink }}>{v}</div>
              </div>
            ) : null)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Gift card (Наборы tab) ────────────────────────────────────────

const RECIPIENTS_MAP = {
  mama: { label: 'Маме', icon: '👩' }, friend: { label: 'Подруге', icon: '👯' },
  love: { label: 'Любимой', icon: '💕' }, sister: { label: 'Сестре', icon: '👧' },
  colleague: { label: 'Коллеге', icon: '💼' }, self: { label: 'Себе', icon: '✨' },
  other: { label: 'Другому', icon: '🎀' },
};
const OCCASIONS_MAP = {
  birthday: '🎂 День рождения', march8: '🌹 8 Марта',
  newyear: '🎄 Новый год', justso: '🫶 Просто так', other: '🎊 Другой повод',
};

function GiftDetailOverlay({ gift, products, onClose, onDelete, onContinue }) {
  const t = useTheme();
  const router = useRouter();
  const isDraft = gift.status === 'draft';
  const r = RECIPIENTS_MAP[gift.recipient];
  const occ = OCCASIONS_MAP[gift.occasion];
  const items = products.filter(p => (gift.selectedProducts || []).includes(p.id));
  const total = items.reduce((s, p) => s + p.price, 0);

  function handleDelete() { onDelete(gift.id); onClose(); }
  function handleEdit() { onClose(); onContinue(gift.id); }
  function handleRepeat() { onClose(); router.go({ screen: 'gift_builder', repeatId: gift.id }); }

  return ReactDOM.createPortal(
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: t.bg, borderRadius: '20px 20px 0 0',
        width: '100%', maxWidth: 600,
        maxHeight: '90dvh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
      }}>
        {/* Handle + header */}
        <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: t.border, margin: '0 auto 16px' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{r?.icon ?? '🎁'}</span>
                <div>
                  <div style={{ fontSize: 11, color: t.primary, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Подарочный набор
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: t.ink }}>
                    {gift.recipientName || r?.label || 'Получатель'}
                  </div>
                </div>
              </div>
              {occ && <div style={{ fontSize: 13, color: t.muted, marginTop: 4, marginLeft: 30 }}>{occ}</div>}
            </div>
            <button onClick={onClose} style={{
              background: t.surfaceAlt, border: 'none', borderRadius: '50%',
              width: 36, height: 36, fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.ink, flexShrink: 0,
            }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {/* Recipient info block */}
          {(gift.recipientPhone || gift.recipientName) && (
            <div style={{
              background: t.surfaceAlt, borderRadius: 12, padding: '12px 14px',
              marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              {gift.recipientName && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: t.muted, fontWeight: 600 }}>Имя</span>
                  <span style={{ color: t.ink, fontWeight: 700 }}>{gift.recipientName}</span>
                </div>
              )}
              {gift.recipientPhone && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: t.muted, fontWeight: 600 }}>Телефон</span>
                  <span style={{ color: t.ink, fontWeight: 700 }}>{gift.recipientPhone}</span>
                </div>
              )}
            </div>
          )}

          {/* Product thumbnails */}
          {items.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {items.map(p => (
                <div key={p.id} style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 10, overflow: 'hidden', border: `1px solid ${t.border}` }}>
                  <ProductImage p={p} padding={0} radius={0} />
                </div>
              ))}
            </div>
          )}

          {/* Product list */}
          {items.length > 0 && (
            <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${t.border}`, marginBottom: 16 }}>
              {items.map((p, i) => (
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
          )}

          {/* Letter */}
          {gift.letter?.trim() && (
            <div style={{
              background: `${t.primary}0a`, border: `1px solid ${t.primary}30`,
              borderRadius: 12, padding: '14px 16px', marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, color: t.primary, fontWeight: 800, letterSpacing: '0.04em', marginBottom: 6 }}>ПИСЬМО</div>
              <div style={{ fontSize: 14, color: t.ink, fontStyle: 'italic', lineHeight: 1.6 }}>
                «{gift.letter.trim()}»
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px 24px', borderTop: `1px solid ${t.border}`, flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <button onClick={handleDelete} style={{
            background: 'transparent', border: `1.5px solid rgba(222,53,11,0.3)`,
            color: '#DE350B', padding: '11px 14px', borderRadius: 12,
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
          }}>🗑</button>
          <div style={{ flex: 1 }}>
            {items.length > 0 && (
              <div style={{ fontSize: 11, color: t.muted }}>Итого</div>
            )}
            {items.length > 0 && (
              <div style={{ fontSize: 20, fontWeight: 900, color: t.primary, letterSpacing: '-0.02em' }}>{fmtRub(total)}</div>
            )}
          </div>
          {isDraft ? (
            <button onClick={handleEdit} style={{
              background: t.primary, color: '#fff', border: 'none',
              padding: '12px 20px', borderRadius: 12,
              fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
            }}>✏️ Редактировать</button>
          ) : (
            <button onClick={handleRepeat} style={{
              background: 'transparent', border: `1.5px solid ${t.border}`,
              color: t.ink, padding: '12px 20px', borderRadius: 12,
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>Повторить</button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function GiftCard({ gift, products, onContinue, onDelete }) {
  const t = useTheme();
  const [showOverlay, setShowOverlay] = React.useState(false);
  const isDraft = gift.status === 'draft';
  const r = RECIPIENTS_MAP[gift.recipient];
  const occ = OCCASIONS_MAP[gift.occasion];
  const items = products.filter(p => (gift.selectedProducts || []).includes(p.id));
  const total = items.reduce((s, p) => s + p.price, 0);

  return (
    <>
      <div
        onClick={() => setShowOverlay(true)}
        style={{
          background: t.surface, borderRadius: 14,
          border: `1.5px solid ${isDraft ? t.primary + '50' : t.border}`,
          overflow: 'hidden', cursor: 'pointer',
        }}
      >
        <div style={{
          padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${t.border}`,
          background: isDraft ? `${t.primary}08` : t.surfaceAlt,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>{r?.icon ?? '🎁'}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: t.ink }}>
                {r?.label ?? 'Набор'}{occ ? ` · ${occ}` : ''}
              </div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 1 }}>
                {gift.updatedAt ? new Date(gift.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) : ''}
              </div>
            </div>
          </div>
          <span style={{
            padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: isDraft ? `${t.primary}18` : 'rgba(0,135,90,0.1)',
            color: isDraft ? t.primary : '#00875A',
          }}>
            {isDraft ? `Черновик · шаг ${gift.step + 1}/5` : 'Завершён'}
          </span>
        </div>

        <div style={{ padding: '12px 16px' }}>
          {items.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {items.map(p => (
                <div key={p.id} style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <ProductImage p={p} padding={0} radius={0} />
                </div>
              ))}
            </div>
          )}
          {gift.letter?.trim() && (
            <div style={{
              background: t.surfaceAlt, borderRadius: 8, padding: '7px 10px', marginBottom: 10,
              fontSize: 12, color: t.muted, fontStyle: 'italic', lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>«{gift.letter.trim()}»</div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: t.primary }}>
              {items.length > 0 ? fmtRub(total) : '—'}
            </div>
            <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
              <button onClick={() => onDelete(gift.id)} style={{
                padding: '6px 12px', borderRadius: 8, border: `1.5px solid rgba(222,53,11,0.25)`,
                background: 'transparent', color: '#DE350B',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>Удалить</button>
              {isDraft ? (
                <button onClick={() => onContinue(gift.id)} style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none',
                  background: t.primary, color: '#fff',
                  fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
                }}>✏️ Редактировать</button>
              ) : (
                <button onClick={e => { e.stopPropagation(); setShowOverlay(true); }} style={{
                  padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${t.border}`,
                  background: 'transparent', color: t.ink,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>Повторить</button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showOverlay && (
        <GiftDetailOverlay
          gift={gift} products={products}
          onClose={() => setShowOverlay(false)}
          onDelete={id => { onDelete(id); setShowOverlay(false); }}
          onContinue={onContinue}
        />
      )}
    </>
  );
}

// ── Orders list ──────────────────────────────────────────────────

export function MyOrdersScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const { user, openLogin } = useAuth();
  const { products } = useData();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState(router.route.giftsTab ? 'gifts' : 'orders');
  const [gifts, setGifts] = useState(() => loadGifts());

  function refreshGifts() { setGifts(loadGifts()); }

  function handleDeleteGift(id) {
    if (!window.confirm('Удалить набор?')) return;
    deleteGift(id);
    refreshGifts();
  }

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchMyOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  // If coming from order_done with a specific orderId, open it
  useEffect(() => {
    const orderId = router.route.orderId;
    if (orderId && orders.length > 0) {
      const found = orders.find(o => o.id === orderId);
      if (found) setSelected(found);
    }
  }, [router.route.orderId, orders]);

  const isDesk = device === 'desktop';
  const pad = isDesk ? '40px 40px 60px' : '20px 16px 32px';

  if (selected) {
    return (
      <div style={{ background: t.bg, color: t.ink, minHeight: '100%', padding: pad }}>
        <OrderTicket order={selected} onBack={() => setSelected(null)} isDesk={isDesk} />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ background: t.bg, color: t.ink, minHeight: '100%', padding: pad, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>📦</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: t.ink, letterSpacing: '-0.02em' }}>Мои заказы</div>
        <div style={{ fontSize: 14, color: t.muted, maxWidth: 300, lineHeight: 1.6 }}>
          Войдите, чтобы увидеть историю заказов и отслеживать их статус
        </div>
        <button
          onClick={openLogin}
          style={{ background: t.primary, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 15, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}
        >
          Войти
        </button>
      </div>
    );
  }

  const TabBtn = ({ value, label, count }) => (
    <button onClick={() => setTab(value)} style={{
      padding: '8px 18px', borderRadius: 999,
      border: `1.5px solid ${tab === value ? t.primary : t.border}`,
      background: tab === value ? t.primary : 'transparent',
      color: tab === value ? '#fff' : t.ink,
      fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {label}
      {count > 0 && (
        <span style={{
          background: tab === value ? 'rgba(255,255,255,0.25)' : t.surfaceAlt,
          borderRadius: 999, fontSize: 11, fontWeight: 800, padding: '1px 6px',
          color: tab === value ? '#fff' : t.muted,
        }}>{count}</span>
      )}
    </button>
  );

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%', padding: pad }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: isDesk ? 28 : 22, fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
          Мои заказы
        </h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <TabBtn value="orders" label="Заказы" count={orders.length} />
          <TabBtn value="gifts" label="Наборы" count={gifts.length} />
        </div>
      </div>

      {tab === 'gifts' && (
        gifts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: t.muted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎁</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.ink, marginBottom: 8 }}>Наборов пока нет</div>
            <div style={{ fontSize: 14, marginBottom: 20 }}>Соберите первый подарочный набор</div>
            <button onClick={() => router.go({ screen: 'gift_builder' })} style={{
              background: t.primary, color: '#fff', border: 'none', borderRadius: 12,
              padding: '11px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
            }}>🎁 Собрать набор</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {gifts.map(g => (
              <GiftCard
                key={g.id} gift={g} products={products}
                onContinue={id => router.go({ screen: 'gift_builder', draftId: id })}
                onDelete={handleDeleteGift}
              />
            ))}
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button onClick={() => router.go({ screen: 'gift_builder' })} style={{
                background: t.primary, color: '#fff', border: 'none', borderRadius: 12,
                padding: '11px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
              }}>+ Новый набор</button>
            </div>
          </div>
        )
      )}

      {tab === 'orders' && loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: t.surface, borderRadius: 16, padding: 20, boxShadow: `inset 0 0 0 1px ${t.border}`, height: 88 }} />
          ))}
        </div>
      ) : tab === 'orders' && orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: t.muted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.ink, marginBottom: 8 }}>Заказов пока нет</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 280, margin: '0 auto 20px' }}>
            Оформите первый заказ — он появится здесь
          </div>
          <button
            onClick={() => router.go({ screen: 'catalog' })}
            style={{ background: t.primary, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}
          >
            В каталог
          </button>
        </div>
      ) : tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map(order => {
            const s = statusInfo(order.status);
            const items = Array.isArray(order.items) ? order.items : [];
            const itemCount = items.reduce((n, x) => n + (x.qty ?? 1), 0);
            return (
              <button
                key={order.id}
                onClick={() => setSelected(order)}
                style={{
                  background: t.surface, borderRadius: 16, padding: '16px 20px',
                  boxShadow: `inset 0 0 0 1.5px ${t.border}`, cursor: 'pointer',
                  border: 'none', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                  display: 'flex', alignItems: 'center', gap: 16,
                }}
              >
                {/* Status dot */}
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />

                {/* Order info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: t.ink, fontFamily: 'monospace' }}>#{shortId(order.id)}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                      background: s.bg, color: s.color, letterSpacing: '0.04em',
                    }}>{s.label.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 12, color: t.muted }}>
                    {fmtDate(order.created_at)} · {itemCount} товара · {fmtMoney(order.total)}
                  </div>
                </div>

                {/* Arrow */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
