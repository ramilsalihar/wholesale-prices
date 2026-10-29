import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchAllProfiles } from '../../service/vendors.js';
import { fetchOrders } from '../../service/orders.js';

const inp = (extra = {}) => ({
  padding: '8px 12px',
  border: `1.5px solid ${AT.border}`,
  borderRadius: AT.radius,
  fontSize: 14,
  fontFamily: 'Manrope, sans-serif',
  color: AT.ink,
  background: AT.surface,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  ...extra,
});

export function Users() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'user' | 'vendor' | 'admin'

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [profs, ords] = await Promise.all([
        fetchAllProfiles().catch(() => []),
        fetchOrders().catch(() => []),
      ]);
      setUsers(profs ?? []);
      setOrders(ords ?? []);
    } finally {
      setLoading(false);
    }
  }

  const getOrdersCountForUser = (userId, email) => {
    return orders.filter(o => (o.user_id && o.user_id === userId) || (email && o.email === email)).length;
  };

  const getTotalSpentForUser = (userId, email) => {
    return orders
      .filter(o => (o.user_id && o.user_id === userId) || (email && o.email === email))
      .reduce((sum, o) => sum + (o.total || 0), 0);
  };

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && (u.role || 'user') !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchName = u.full_name?.toLowerCase().includes(q);
      const matchPhone = u.phone?.toLowerCase().includes(q);
      const matchCity = u.city?.toLowerCase().includes(q);
      if (!matchEmail && !matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: AT.ink, letterSpacing: '-0.02em' }}>
            Пользователи и покупатели
          </h1>
          <div style={{ fontSize: 13, color: AT.muted, marginTop: 4 }}>
            База зарегистрированных клиентов, роли в системе, активность покупок и наплыв
          </div>
        </div>

        <div style={{
          background: AT.surface,
          padding: '8px 14px',
          borderRadius: AT.radius,
          border: `1px solid ${AT.border}`,
          fontSize: 13,
          fontWeight: 700,
          color: AT.inkLight,
        }}>
          Всего пользователей: <span style={{ color: AT.primary, fontWeight: 800 }}>{users.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: AT.surface,
        border: `1px solid ${AT.border}`,
        borderRadius: AT.radiusLg,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по имени, email, номеру телефона, городу..."
          style={inp({ flex: 1, minWidth: 260 })}
        />

        <div style={{ display: 'flex', gap: 4, background: AT.surfaceAlt, padding: 3, borderRadius: AT.radius }}>
          {[
            { id: 'all', label: `Все (${users.length})` },
            { id: 'user', label: `Покупатели (${users.filter(u => (u.role || 'user') === 'user').length})` },
            { id: 'vendor', label: `Вендоры (${users.filter(u => u.role === 'vendor').length})` },
            { id: 'admin', label: `Админы (${users.filter(u => u.role === 'admin').length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              style={{
                border: 'none',
                background: roleFilter === tab.id ? AT.surface : 'transparent',
                color: roleFilter === tab.id ? AT.ink : AT.muted,
                padding: '6px 12px',
                borderRadius: AT.radius - 2,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: roleFilter === tab.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: AT.muted, fontSize: 14 }}>
          Загрузка пользователей...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: AT.surface,
          border: `1px dashed ${AT.border}`,
          borderRadius: AT.radiusLg,
          padding: 48,
          textAlign: 'center',
          color: AT.muted,
        }}>
          Пользователи не найдены.
        </div>
      ) : (
        <div style={{
          background: AT.surface,
          border: `1px solid ${AT.border}`,
          borderRadius: AT.radiusLg,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: AT.surfaceAlt, borderBottom: `1px solid ${AT.border}` }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>ПОЛЬЗОВАТЕЛЬ</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>РОЛЬ</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>ТЕЛЕФОН</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>ГОРОД / АДРЕС</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>ЗАКАЗОВ</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>СУММА ПОКУПОК</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>РЕГИСТРАЦИЯ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const oCount = getOrdersCountForUser(u.id, u.email);
                const spent = getTotalSpentForUser(u.id, u.email);
                const role = u.role || 'user';

                return (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${AT.border}`, transition: 'background 0.12s' }}>
                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: AT.surfaceAlt,
                          border: `1px solid ${AT.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          color: AT.primary,
                          fontSize: 14,
                        }}>
                          {(u.full_name || u.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: AT.ink, fontSize: 13 }}>
                            {u.full_name || 'Без имени'}
                          </div>
                          <div style={{ fontSize: 12, color: AT.muted, marginTop: 1 }}>
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        background: role === 'admin' ? AT.primaryBg : role === 'vendor' ? 'rgba(0,82,204,0.08)' : AT.surfaceAlt,
                        color: role === 'admin' ? AT.primary : role === 'vendor' ? '#0052CC' : AT.inkLight,
                      }}>
                        {role === 'admin' ? '👑 АДМИНИСТРАТОР' : role === 'vendor' ? '🏪 ВЕНДОР' : '👤 ПОКУПАТЕЛЬ'}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle', color: AT.inkLight }}>
                      {u.phone || '—'}
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <div style={{ color: AT.ink }}>{u.city || 'Бишкек'}</div>
                      <div style={{ fontSize: 11, color: AT.muted }}>{u.address || '—'}</div>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: oCount > 0 ? AT.successBg : AT.surfaceAlt,
                        color: oCount > 0 ? AT.success : AT.muted,
                        fontWeight: 700,
                        fontSize: 12,
                      }}>
                        {oCount} шт.
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle', fontWeight: 800, color: AT.ink }}>
                      {spent > 0 ? `${spent.toLocaleString('ru-RU')} сом` : '—'}
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle', fontSize: 12, color: AT.muted }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('ru-RU') : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
