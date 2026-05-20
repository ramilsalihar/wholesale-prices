import React, { useState, useEffect, useCallback } from 'react';
import { AT } from '../adminTheme.js';
import { fetchOrders, updateOrderStatus, ORDER_STATUSES, statusInfo } from '../../service/orders.js';
import { OrdersTableSkeleton } from '../ui/Skeleton.jsx';

const DELIVERY_LABELS = {
  courier: 'Курьер',
  pickup:  'Самовывоз',
  post:    'Почта',
};

const PAY_LABELS = {
  sbp:   'СБП',
  card:  'Карта',
  split: 'Долями',
  cash:  'Наличные',
};

function StatusBadge({ status, style = {} }) {
  const s = statusInfo(status);
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.04em', background: s.bg, color: s.color, whiteSpace: 'nowrap', ...style,
    }}>
      {s.label.toUpperCase()}
    </span>
  );
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })
    + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function fmtMoney(n) {
  return n != null ? n.toLocaleString('ru-RU') + ' с' : '—';
}

function shortId(id) {
  return id ? '#' + id.slice(0, 8).toUpperCase() : '—';
}

// ── Order detail view ────────────────────────────────────────────

function OrderDetail({ order, onBack, onStatusChange }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function applyStatus(next) {
    setSaving(true);
    setError('');
    try {
      await updateOrderStatus(order.id, next);
      setStatus(next);
      onStatusChange(order.id, next);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius,
            padding: '7px 14px', fontSize: 13, fontWeight: 600, color: AT.inkLight,
            fontFamily: 'Manrope, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Назад
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
          Заказ {shortId(order.id)}
        </h1>
        <StatusBadge status={status} />
        <span style={{ fontSize: 12, color: AT.muted, marginLeft: 4 }}>{fmtDate(order.created_at)}</span>
      </div>

      {error && (
        <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Items */}
          <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${AT.border}`, fontSize: 13, fontWeight: 700, color: AT.ink }}>
              Состав заказа ({items.length} поз.)
            </div>
            {items.length === 0 ? (
              <div style={{ padding: '20px', fontSize: 13, color: AT.muted }}>Нет товаров</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Manrope, sans-serif' }}>
                <thead>
                  <tr style={{ background: AT.surfaceAlt, borderBottom: `1px solid ${AT.border}` }}>
                    {['Товар', 'Цена', 'Кол-во', 'Сумма'].map((h, i) => (
                      <th key={i} style={{ padding: '8px 16px', textAlign: i > 0 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em' }}>
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: i < items.length - 1 ? `1px solid ${AT.border}` : 'none' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink }}>{item.name}</div>
                        {item.brand && <div style={{ fontSize: 11, color: AT.muted }}>{item.brand}</div>}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: AT.inkLight, whiteSpace: 'nowrap' }}>{fmtMoney(item.price)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: AT.ink }}>×{item.qty}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, fontWeight: 800, color: AT.ink, whiteSpace: 'nowrap' }}>{fmtMoney(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: `2px solid ${AT.border}`, background: AT.surfaceAlt }}>
                    <td colSpan={3} style={{ padding: '10px 16px', fontSize: 13, fontWeight: 700, color: AT.inkLight, textAlign: 'right' }}>Доставка</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: AT.inkLight }}>{order.delivery === 0 ? 'Бесплатно' : fmtMoney(order.delivery)}</td>
                  </tr>
                  <tr style={{ background: AT.surfaceAlt }}>
                    <td colSpan={3} style={{ padding: '10px 16px', fontSize: 14, fontWeight: 800, color: AT.ink, textAlign: 'right' }}>Итого</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontSize: 16, fontWeight: 900, color: AT.primary }}>{fmtMoney(order.total)}</td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Contact info */}
          <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 14 }}>Контакты</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Имя', order.user_name],
                ['Телефон', order.phone],
                ['Email', order.email],
                ['Адрес', order.address],
                ['Город', order.city],
                ['Доставка', DELIVERY_LABELS[order.delivery_method] ?? order.delivery_method],
                ['Оплата', PAY_LABELS[order.pay_method] ?? order.pay_method],
              ].map(([k, v]) => v ? (
                <div key={k}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 2 }}>{k.toUpperCase()}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: AT.ink }}>{v}</div>
                </div>
              ) : null)}
            </div>
            {order.notes && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${AT.border}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 4 }}>ПРИМЕЧАНИЕ</div>
                <div style={{ fontSize: 13, color: AT.ink }}>{order.notes}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right column — status */}
        <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 14 }}>Статус заказа</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ORDER_STATUSES.map(s => {
              const active = status === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => !saving && applyStatus(s.key)}
                  disabled={saving}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: AT.radius, cursor: saving ? 'not-allowed' : 'pointer',
                    border: `1.5px solid ${active ? s.color : AT.border}`,
                    background: active ? s.bg : AT.surfaceAlt,
                    fontFamily: 'Manrope, sans-serif', textAlign: 'left', width: '100%',
                    opacity: saving && !active ? 0.5 : 1,
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: active ? s.color : AT.border, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: active ? s.color : AT.inkLight }}>{s.label}</span>
                  {active && (
                    <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Orders list view ─────────────────────────────────────────────

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setOrders(await fetchOrders());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleStatusChange(id, newStatus) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  }

  if (selected) {
    return (
      <OrderDetail
        order={selected}
        onBack={() => setSelected(null)}
        onStatusChange={(id, s) => { handleStatusChange(id, s); setSelected(o => ({ ...o, status: s })); }}
      />
    );
  }

  const counts = {};
  orders.forEach(o => { counts[o.status] = (counts[o.status] ?? 0) + 1; });

  const visible = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
          Заказы {!loading && <span style={{ fontSize: 14, fontWeight: 600, color: AT.muted }}>({orders.length})</span>}
        </h1>
        <button onClick={load} style={{ background: 'transparent', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, padding: '7px 14px', fontSize: 13, fontWeight: 600, color: AT.inkLight, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
          Обновить
        </button>
      </div>

      {error && (
        <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {[{ key: 'all', label: 'Все', color: AT.inkLight, bg: AT.surfaceAlt }, ...ORDER_STATUSES].map(s => {
          const active = filterStatus === s.key;
          const count = s.key === 'all' ? orders.length : (counts[s.key] ?? 0);
          return (
            <button
              key={s.key}
              onClick={() => setFilterStatus(s.key)}
              style={{
                padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                border: `1.5px solid ${active ? (s.color ?? AT.primary) : AT.border}`,
                background: active ? (s.bg ?? AT.primaryBg) : 'transparent',
                color: active ? (s.color ?? AT.primary) : AT.muted,
                fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
              }}
            >
              {s.label} {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
            </button>
          );
        })}
      </div>

      <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Manrope, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${AT.border}`, background: AT.surfaceAlt }}>
                {['Заказ', 'Дата', 'Клиент', 'Телефон', 'Товаров', 'Итого', 'Статус'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            {loading ? (
              <OrdersTableSkeleton />
            ) : visible.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center', color: AT.muted, fontSize: 14 }}>
                    {filterStatus === 'all' ? 'Заказов пока нет' : `Нет заказов со статусом «${statusInfo(filterStatus).label}»`}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {visible.map((o, i) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelected(o)}
                    style={{
                      borderBottom: i < visible.length - 1 ? `1px solid ${AT.border}` : 'none',
                      cursor: 'pointer', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = AT.surfaceAlt}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: AT.ink, fontFamily: 'monospace' }}>{shortId(o.id)}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: AT.muted, whiteSpace: 'nowrap' }}>{fmtDate(o.created_at)}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: AT.ink, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.user_name || o.email || <span style={{ color: AT.muted }}>Гость</span>}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: AT.inkLight, whiteSpace: 'nowrap' }}>{o.phone || '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: AT.inkLight, textAlign: 'center' }}>
                      {Array.isArray(o.items) ? o.items.reduce((s, x) => s + (x.qty ?? 1), 0) : '—'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 800, color: AT.ink, whiteSpace: 'nowrap' }}>{fmtMoney(o.total)}</td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
