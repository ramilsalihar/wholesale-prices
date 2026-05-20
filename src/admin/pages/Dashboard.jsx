import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchOrders, statusInfo } from '../../service/orders.js';
import { supabase } from '../../service/supabase.js';

function useMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

function StatCard({ label, value, sub, color, mobile, loading }) {
  return (
    <div style={{
      background: AT.surface,
      border: `1px solid ${AT.border}`,
      borderRadius: AT.radiusLg,
      padding: mobile ? '14px 16px' : '20px 24px',
    }}>
      <div style={{ fontSize: mobile ? 10 : 13, fontWeight: 600, color: AT.muted, letterSpacing: '0.02em', marginBottom: mobile ? 6 : 10 }}>
        {label.toUpperCase()}
      </div>
      {loading ? (
        <div style={{ height: 36, background: AT.surfaceAlt, borderRadius: 6, animation: 'sk-shine 1.4s ease-in-out infinite',
          backgroundImage: `linear-gradient(90deg, ${AT.surfaceAlt} 25%, ${AT.border} 50%, ${AT.surfaceAlt} 75%)`,
          backgroundSize: '400% 100%' }} />
      ) : (
        <div style={{ fontSize: mobile ? 24 : 32, fontWeight: 800, color: color ?? AT.ink, letterSpacing: '-0.03em', lineHeight: 1 }}>
          {value}
        </div>
      )}
      {sub && (
        <div style={{ fontSize: 12, color: AT.muted, marginTop: 6, fontWeight: 500 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{ fontSize: 16, fontWeight: 700, color: AT.ink, margin: '32px 0 16px', letterSpacing: '-0.01em' }}>
      {children}
    </h2>
  );
}

function StatusBadge({ status }) {
  const s = statusInfo(status);
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.04em', background: s.bg, color: s.color, whiteSpace: 'nowrap',
    }}>
      {s.label.toUpperCase()}
    </span>
  );
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function fmtMoney(n) { return n != null ? n.toLocaleString('ru-RU') + ' с' : '—'; }

export function Dashboard() {
  const mobile = useMobile();
  const [orders, setOrders] = useState([]);
  const [productCount, setProductCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchOrders(),
      supabase.from('products').select('id', { count: 'exact', head: true }),
    ]).then(([ords, { count }]) => {
      setOrders(ords ?? []);
      setProductCount(count ?? 0);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total ?? 0), 0);
  const newOrders = orders.filter(o => o.status === 'new');
  const recent = orders.slice(0, 10);

  return (
    <div>
      <h1 style={{ fontSize: mobile ? 18 : 22, fontWeight: 800, color: AT.ink, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
        Дашборд
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: mobile ? 12 : 16 }}>
        <StatCard label="Заказы сегодня" value={todayOrders.length} sub={`Всего заказов: ${orders.length}`} mobile={mobile} loading={loading} />
        <StatCard label="Выручка сегодня" value={loading ? '' : fmtMoney(todayRevenue)} sub="По оформленным заказам" color={AT.success} mobile={mobile} loading={loading} />
        <StatCard label="Новые заказы" value={newOrders.length} sub="Ожидают подтверждения" color={AT.warning} mobile={mobile} loading={loading} />
        <StatCard label="Всего товаров" value={loading ? '' : (productCount ?? '—')} sub="Активных в каталоге" color={AT.primary} mobile={mobile} loading={loading} />
      </div>

      <SectionHeading>Последние заказы</SectionHeading>

      <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Manrope, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${AT.border}`, background: AT.surfaceAlt }}>
                {['Заказ', 'Дата', 'Клиент', 'Телефон', 'Итого', 'Статус'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${AT.border}` }}>
                    {[100, 90, '55%', 110, 70, 80].map((w, j) => (
                      <td key={j} style={{ padding: '13px 14px' }}>
                        <div style={{ height: 13, width: w, borderRadius: 4, background: AT.surfaceAlt }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recent.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', fontSize: 14, color: AT.muted, fontWeight: 500 }}>
                    Заказов пока нет
                  </td>
                </tr>
              ) : (
                recent.map((o, i) => (
                  <tr key={o.id} style={{ borderBottom: i < recent.length - 1 ? `1px solid ${AT.border}` : 'none' }}>
                    <td style={{ padding: '12px 14px', fontSize: 12, fontWeight: 800, color: AT.ink, fontFamily: 'monospace' }}>
                      #{o.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: AT.muted, whiteSpace: 'nowrap' }}>{fmtDate(o.created_at)}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: AT.ink, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.user_name || o.email || <span style={{ color: AT.muted }}>Гость</span>}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: AT.inkLight, whiteSpace: 'nowrap' }}>{o.phone || '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 800, color: AT.ink, whiteSpace: 'nowrap' }}>{fmtMoney(o.total)}</td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge status={o.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
