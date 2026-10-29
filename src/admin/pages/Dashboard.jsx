import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchOrders, statusInfo } from '../../service/orders.js';
import { fetchAllVendors, fetchAllProfiles } from '../../service/vendors.js';
import { fetchAllProducts } from '../../service/products.js';

function useMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

function StatCard({ label, value, sub, icon, trend, color, mobile, loading }) {
  return (
    <div style={{
      background: AT.surface,
      border: `1px solid ${AT.border}`,
      borderRadius: AT.radiusLg,
      padding: mobile ? '16px' : '20px 22px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {label}
        </span>
        {icon && (
          <span style={{
            fontSize: 18,
            width: 36,
            height: 36,
            borderRadius: 8,
            background: AT.surfaceAlt,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {icon}
          </span>
        )}
      </div>

      {loading ? (
        <div style={{
          height: 36,
          background: AT.surfaceAlt,
          borderRadius: 6,
          animation: 'sk-shine 1.4s ease-in-out infinite',
        }} />
      ) : (
        <div style={{
          fontSize: mobile ? 26 : 30,
          fontWeight: 800,
          color: color ?? AT.ink,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}>
          {value}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        {sub && (
          <span style={{ fontSize: 12, color: AT.muted, fontWeight: 500 }}>
            {sub}
          </span>
        )}
        {trend && (
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: 4,
            background: AT.successBg,
            color: AT.success,
          }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = statusInfo(status);
  return (
    <span style={{
      padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700,
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

function fmtMoney(n) { return n != null ? Number(n).toLocaleString('ru-RU') + ' сом' : '—'; }

export function Dashboard() {
  const mobile = useMobile();
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [ords, vens, prods, profs] = await Promise.all([
        fetchOrders().catch(() => []),
        fetchAllVendors().catch(() => []),
        fetchAllProducts().catch(() => []),
        fetchAllProfiles().catch(() => []),
      ]);
      setOrders(ords ?? []);
      setVendors(vens ?? []);
      setProducts(prods ?? []);
      setProfiles(profs ?? []);
    } finally {
      setLoading(false);
    }
  }

  // Analytics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const now = new Date();
  const todayStr = now.toDateString();
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === todayStr);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeVendors = vendors.filter(v => v.status === 'approved');
  const pendingVendors = vendors.filter(v => v.status === 'pending');
  const activeProducts = products.filter(p => p.active !== false);

  // Group vendors by tier
  const smallVendors = vendors.filter(v => (v.tier || 'small') === 'small');
  const mediumVendors = vendors.filter(v => v.tier === 'medium');
  const flagshipVendors = vendors.filter(v => v.tier === 'flagship');

  // Traffic / Daily orders chart approximation (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toDateString();
    const dayOrders = orders.filter(o => new Date(o.created_at).toDateString() === dStr);
    const dayRev = dayOrders.reduce((acc, cur) => acc + (cur.total || 0), 0);
    return {
      day: d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' }),
      count: dayOrders.length,
      revenue: dayRev,
    };
  });

  const maxCount = Math.max(...last7Days.map(d => d.count), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: mobile ? 20 : 24, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
            Обзор Маркетплейса Flowo
          </h1>
          <div style={{ fontSize: 13, color: AT.muted, marginTop: 4 }}>
            Сводная аналитика: продажи, активность магазинов-вендоров, приток клиентов
          </div>
        </div>

        <button
          onClick={loadDashboard}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: AT.surface,
            border: `1px solid ${AT.border}`,
            padding: '8px 14px',
            borderRadius: AT.radius,
            fontSize: 13,
            fontWeight: 700,
            color: AT.inkLight,
            cursor: 'pointer',
          }}
        >
          🔄 Обновить данные
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: mobile ? 12 : 16 }}>
        <StatCard
          label="Общая выручка"
          value={loading ? '...' : fmtMoney(totalRevenue)}
          sub={`Сегодня: ${fmtMoney(todayRevenue)}`}
          icon="💰"
          color={AT.primary}
          mobile={mobile}
          loading={loading}
        />
        <StatCard
          label="Всего заказов"
          value={loading ? '...' : orders.length}
          sub={`Сегодня: ${todayOrders.length}`}
          icon="📦"
          trend={orders.length > 0 ? '+активны' : null}
          mobile={mobile}
          loading={loading}
        />
        <StatCard
          label="Магазины (Вендоры)"
          value={loading ? '...' : vendors.length}
          sub={`Активных: ${activeVendors.length} | Ждут: ${pendingVendors.length}`}
          icon="🏪"
          color={AT.success}
          mobile={mobile}
          loading={loading}
        />
        <StatCard
          label="Пользователи"
          value={loading ? '...' : (profiles.length || orders.length || 0)}
          sub={`Товаров на витрине: ${activeProducts.length}`}
          icon="👥"
          mobile={mobile}
          loading={loading}
        />
      </div>

      {/* Middle Row: Store Tiers & Activity Graph */}
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1.4fr 1fr', gap: 16 }}>
        {/* Dynamic Activity: Orders & Influx Graph */}
        <div style={{
          background: AT.surface,
          border: `1px solid ${AT.border}`,
          borderRadius: AT.radiusLg,
          padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: AT.ink }}>Динамика заказов и наплыв</div>
              <div style={{ fontSize: 12, color: AT.muted, marginTop: 2 }}>Количество оформленных покупок за последние 7 дней</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: AT.primary, background: AT.primaryBg, padding: '3px 8px', borderRadius: 4 }}>
              7 дней
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: mobile ? 8 : 16, height: 160, paddingTop: 20 }}>
            {last7Days.map((col, i) => {
              const hPct = Math.max((col.count / maxCount) * 100, 10);
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: col.count > 0 ? AT.ink : AT.muted }}>
                    {col.count}
                  </div>
                  <div style={{
                    width: '100%',
                    maxWidth: 36,
                    height: `${hPct}%`,
                    background: col.count > 0 ? `linear-gradient(180deg, ${AT.primary} 0%, ${AT.primaryDark} 100%)` : AT.surfaceAlt,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease',
                  }} />
                  <div style={{ fontSize: 11, color: AT.muted, fontWeight: 600 }}>
                    {col.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown by Vendor Scale / Tiers */}
        <div style={{
          background: AT.surface,
          border: `1px solid ${AT.border}`,
          borderRadius: AT.radiusLg,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: AT.ink }}>Сегментация магазинов</div>
            <div style={{ fontSize: 12, color: AT.muted, marginTop: 2 }}>Распределение вендоров по масштабу бизнеса</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
              {/* Flagship */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  <span style={{ color: AT.ink }}>👑 Крупные сети / Флагманы</span>
                  <span style={{ color: AT.primary }}>{flagshipVendors.length} салонов</span>
                </div>
                <div style={{ height: 6, background: AT.surfaceAlt, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: vendors.length ? `${(flagshipVendors.length / vendors.length) * 100}%` : '0%',
                    background: AT.primary,
                  }} />
                </div>
              </div>

              {/* Medium */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  <span style={{ color: AT.ink }}>🏪 Средние магазины цветов</span>
                  <span style={{ color: '#0052CC' }}>{mediumVendors.length} магазинов</span>
                </div>
                <div style={{ height: 6, background: AT.surfaceAlt, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: vendors.length ? `${(mediumVendors.length / vendors.length) * 100}%` : '0%',
                    background: '#0052CC',
                  }} />
                </div>
              </div>

              {/* Small */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  <span style={{ color: AT.ink }}>🌱 Небольшие / Локальные точки</span>
                  <span style={{ color: AT.success }}>{smallVendors.length} точек</span>
                </div>
                <div style={{ height: 6, background: AT.surfaceAlt, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: vendors.length ? `${(smallVendors.length / vendors.length) * 100}%` : '0%',
                    background: AT.success,
                  }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: AT.surfaceAlt,
            padding: '10px 14px',
            borderRadius: AT.radius,
            fontSize: 12,
            color: AT.inkLight,
            marginTop: 16,
          }}>
            💡 <strong>Совет:</strong> Вы можете менять категорию любого магазина во вкладке «Вендоры».
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div style={{
        background: AT.surface,
        border: `1px solid ${AT.border}`,
        borderRadius: AT.radiusLg,
        overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${AT.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: AT.ink }}>Свежие заказы клиентов</div>
            <div style={{ fontSize: 12, color: AT.muted, marginTop: 2 }}>Последние поступающие заказы на платформе</div>
          </div>
          <span style={{ fontSize: 12, color: AT.muted, fontWeight: 600 }}>
            Всего: {orders.length}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Manrope, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${AT.border}`, background: AT.surfaceAlt }}>
                {['Заказ', 'Дата', 'Клиент', 'Телефон', 'Адрес', 'Сумма', 'Статус'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${AT.border}` }}>
                    {[100, 90, 120, 100, 150, 80, 70].map((w, j) => (
                      <td key={j} style={{ padding: '14px 16px' }}>
                        <div style={{ height: 14, width: w, borderRadius: 4, background: AT.surfaceAlt }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', fontSize: 14, color: AT.muted, fontWeight: 500 }}>
                    Заказов в системе пока нет
                  </td>
                </tr>
              ) : (
                orders.slice(0, 8).map((o, i) => (
                  <tr key={o.id} style={{ borderBottom: i < 7 ? `1px solid ${AT.border}` : 'none' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 800, color: AT.ink, fontFamily: 'monospace' }}>
                      #{o.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: AT.muted, whiteSpace: 'nowrap' }}>{fmtDate(o.created_at)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: AT.ink, fontWeight: 600 }}>
                      {o.user_name || o.email || <span style={{ color: AT.muted }}>Покупатель</span>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: AT.inkLight }}>{o.phone || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: AT.inkLight, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.address || o.city || 'Бишкек'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 800, color: AT.ink }}>{fmtMoney(o.total)}</td>
                    <td style={{ padding: '12px 16px' }}><StatusBadge status={o.status} /></td>
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
