import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchAllVendors, updateVendorStatus, updateVendorTier, upsertVendor, deleteVendor } from '../../service/vendors.js';
import { fetchAllProducts } from '../../service/products.js';

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

const TIERS = [
  { id: 'small', label: 'Небольшой салон / Точка', badge: '🌱 Маленький', color: '#00875A', bg: 'rgba(0,135,90,0.08)' },
  { id: 'medium', label: 'Средний цветочный магазин', badge: '🏪 Средний', color: '#0052CC', bg: 'rgba(0,82,204,0.08)' },
  { id: 'flagship', label: 'Крупная сеть / Флагман', badge: '👑 Крупный / Флагман', color: '#E6097A', bg: 'rgba(230,9,122,0.08)' },
];

export function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'approved' | 'pending' | 'blocked'
  const [tierFilter, setTierFilter] = useState('all');     // 'all' | 'small' | 'medium' | 'flagship'

  // Edit / Create Modal State
  const [editingVendor, setEditingVendor] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [error, setError] = useState('');

  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    setDebugInfo(null);
    try {
      const [vList, pList] = await Promise.all([
        fetchAllVendors(),
        fetchAllProducts().catch(() => []),
      ]);
      setVendors(vList || []);
      setProducts(pList || []);
      setDebugInfo({ count: (vList || []).length, ts: new Date().toLocaleTimeString() });
    } catch (err) {
      console.error('Error loading vendors:', err);
      setError(err.message || 'Ошибка загрузки вендоров');
    } finally {
      setLoading(false);
    }
  }


  async function handleToggleStatus(vendor) {
    const nextStatus = vendor.status === 'blocked' ? 'approved' : 'blocked';
    try {
      await updateVendorStatus(vendor.id, nextStatus);
      setVendors(prev => prev.map(v => (v.id === vendor.id ? { ...v, status: nextStatus } : v)));
    } catch (err) {
      alert('Ошибка изменения статуса: ' + err.message);
    }
  }

  async function handleApprove(vendorId) {
    try {
      await updateVendorStatus(vendorId, 'approved');
      setVendors(prev => prev.map(v => (v.id === vendorId ? { ...v, status: 'approved' } : v)));
    } catch (err) {
      alert('Ошибка подтверждения: ' + err.message);
    }
  }

  async function handleChangeTier(vendorId, newTier) {
    try {
      await updateVendorTier(vendorId, newTier);
      setVendors(prev => prev.map(v => (v.id === vendorId ? { ...v, tier: newTier } : v)));
    } catch (err) {
      alert('Ошибка смены категории магазина: ' + err.message);
    }
  }

  async function handleDelete(vendorId) {
    try {
      await deleteVendor(vendorId);
      setVendors(prev => prev.filter(v => v.id !== vendorId));
      setDeleteConfirmId(null);
    } catch (err) {
      alert('Ошибка удаления: ' + err.message);
    }
  }

  function openEdit(v) {
    setEditingVendor(v);
    setEditForm({
      id: v.id,
      name: v.name || '',
      description: v.description || '',
      phone: v.phone || '',
      email: v.email || '',
      city: v.city || 'Бишкек',
      address: v.address || '',
      hours: v.hours || '09:00 – 21:00',
      status: v.status || 'approved',
      tier: v.tier || 'small',
      rating: String(v.rating || 5.0),
      logo_url: v.logo_url || '',
    });
  }

  function openCreate() {
    const newId = `vnd_${Date.now().toString(36)}`;
    setEditingVendor({ isNew: true });
    setEditForm({
      id: newId,
      name: '',
      description: '',
      phone: '',
      email: '',
      city: 'Бишкек',
      address: '',
      hours: '09:00 – 21:00',
      status: 'approved',
      tier: 'small',
      rating: '5.0',
      logo_url: '',
    });
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        rating: parseFloat(editForm.rating) || 5.0,
      };
      const updated = await upsertVendor(payload);
      setVendors(prev => {
        const exists = prev.some(v => v.id === updated.id);
        if (exists) {
          return prev.map(v => (v.id === updated.id ? updated : v));
        }
        return [updated, ...prev];
      });
      setEditingVendor(null);
    } catch (err) {
      alert('Ошибка сохранения вендора: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  const getProductCountForVendor = (vId) => {
    return products.filter(p => p.vendor_id === vId).length;
  };

  const filtered = vendors.filter(v => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (tierFilter !== 'all' && (v.tier || 'small') !== tierFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = v.name?.toLowerCase().includes(q);
      const matchEmail = v.email?.toLowerCase().includes(q);
      const matchPhone = v.phone?.toLowerCase().includes(q);
      const matchCity = v.city?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: AT.ink, letterSpacing: '-0.02em' }}>
            Вендоры и цветочные магазины
          </h1>
          <div style={{ fontSize: 13, color: AT.muted, marginTop: 4 }}>
            Управление продавцами маркетплейса Flowo, категории масштаба (маленькие, средние, крупные сети), модерация
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={openCreate}
            style={{
              padding: '9px 18px',
              background: AT.primary,
              color: '#fff',
              border: 'none',
              borderRadius: AT.radius,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>+</span> Добавить магазин
          </button>

          <div style={{
            background: AT.surface,
            padding: '8px 14px',
            borderRadius: AT.radius,
            border: `1px solid ${AT.border}`,
            fontSize: 13,
            fontWeight: 700,
            color: AT.inkLight,
          }}>
            Всего: <span style={{ color: AT.primary, fontWeight: 800 }}>{vendors.length}</span>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          background: AT.dangerBg,
          border: `1px solid rgba(222,53,11,0.2)`,
          color: AT.danger,
          borderRadius: AT.radius,
          padding: '12px 16px',
          fontSize: 13,
        }}>
          <strong>Внимание:</strong> {error}
          <div style={{ marginTop: 4, fontSize: 12, color: AT.inkLight }}>
            Убедитесь, что в Supabase выполнен скрипт миграции <code>PATCH_FIX_VENDORS_ADMIN.sql</code>.
          </div>
        </div>
      )}

      {/* Diagnostic info: shown when loaded but list is empty */}
      {!loading && !error && vendors.length === 0 && (
        <div style={{
          background: 'rgba(255,170,0,0.07)',
          border: '1px solid rgba(255,170,0,0.3)',
          borderRadius: AT.radiusLg,
          padding: '16px 20px',
          fontSize: 13,
          color: AT.ink,
          lineHeight: 1.7,
        }}>
          <div style={{ fontWeight: 800, marginBottom: 6, fontSize: 14 }}>⚠️ Вендоры не найдены — нужна настройка Supabase</div>
          <div>Это значит, что таблица <code>vendors</code> в Supabase либо пуста, либо RLS-политики не дают доступ администратору.</div>
          <div style={{ marginTop: 10, fontWeight: 700 }}>Чтобы исправить:</div>
          <ol style={{ paddingLeft: 20, margin: '6px 0 0' }}>
            <li>Зайдите в <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ color: AT.primary }}>supabase.com/dashboard</a></li>
            <li>SQL Editor → New Query</li>
            <li>Скопируйте и выполните содержимое файла <strong>supabase/PATCH_FIX_VENDORS_ADMIN.sql</strong></li>
            <li>Нажмите Run и перезагрузите эту страницу</li>
          </ol>
          <div style={{ marginTop: 8, fontSize: 12, color: AT.muted }}>
            Проверьте консоль браузера (F12 → Console) — там будут подробные ошибки с кодами Supabase.
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        background: AT.surface,
        border: `1px solid ${AT.border}`,
        borderRadius: AT.radiusLg,
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по названию магазина, email, телефону, городу..."
            style={inp({ flex: 1, minWidth: 260 })}
          />

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 4, background: AT.surfaceAlt, padding: 3, borderRadius: AT.radius }}>
            {[
              { id: 'all', label: `Все (${vendors.length})` },
              { id: 'approved', label: `Активные (${vendors.filter(v => v.status === 'approved').length})` },
              { id: 'pending', label: `Модерация (${vendors.filter(v => v.status === 'pending').length})` },
              { id: 'blocked', label: `Заблокированы (${vendors.filter(v => v.status === 'blocked').length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  border: 'none',
                  background: statusFilter === tab.id ? AT.surface : 'transparent',
                  color: statusFilter === tab.id ? AT.ink : AT.muted,
                  padding: '6px 12px',
                  borderRadius: AT.radius - 2,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: statusFilter === tab.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Store Scale / Tier Categories Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 6, borderTop: `1px solid ${AT.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: AT.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Масштаб магазина:
          </span>
          {[
            { id: 'all', label: 'Все масштабы' },
            { id: 'small', label: '🌱 Маленькие салоны' },
            { id: 'medium', label: '🏪 Средние магазины' },
            { id: 'flagship', label: '👑 Крупные сети / Флагманы' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTierFilter(t.id)}
              style={{
                border: `1px solid ${tierFilter === t.id ? AT.primary : AT.border}`,
                background: tierFilter === t.id ? AT.primaryBg : 'transparent',
                color: tierFilter === t.id ? AT.primary : AT.inkLight,
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Table / List */}
      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: AT.muted, fontSize: 14 }}>
          Загрузка списка вендоров...
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
          Вендоры по выбранному фильтру не найдены.
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
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>МАГАЗИН</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>МАСШТАБ (КАТЕГОРИЯ)</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>КОНТАКТЫ</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>ГОРОД / АДРЕС</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>ТОВАРОВ</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight }}>СТАТУС</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: AT.inkLight, textAlign: 'right' }}>ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => {
                const pCount = getProductCountForVendor(v.id);
                const isBlocked = v.status === 'blocked';
                const isPending = v.status === 'pending';
                const curTier = TIERS.find(t => t.id === (v.tier || 'small')) || TIERS[0];

                return (
                  <tr key={v.id} style={{ borderBottom: `1px solid ${AT.border}`, transition: 'background 0.12s' }}>
                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: AT.radius,
                          background: AT.surfaceAlt,
                          border: `1px solid ${AT.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}>
                          {v.logo_url ? (
                            <img src={v.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            '🌸'
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: AT.ink, fontSize: 14 }}>{v.name}</div>
                          <div style={{ fontSize: 11, color: AT.muted, marginTop: 2 }}>ID: {v.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>

                    {/* Scale Tier Dropdown */}
                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <select
                        value={v.tier || 'small'}
                        onChange={e => handleChangeTier(v.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: `1px solid ${curTier.color}`,
                          background: curTier.bg,
                          color: curTier.color,
                          fontWeight: 700,
                          fontSize: 11,
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        <option value="small">🌱 Маленький салон</option>
                        <option value="medium">🏪 Средний магазин</option>
                        <option value="flagship">👑 Крупный / Флагман</option>
                      </select>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <div style={{ color: AT.ink, fontWeight: 600 }}>{v.email || '—'}</div>
                      <div style={{ fontSize: 12, color: AT.muted, marginTop: 2 }}>{v.phone || '—'}</div>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <div style={{ color: AT.ink }}>{v.city || 'Бишкек'}</div>
                      <div style={{ fontSize: 12, color: AT.muted, marginTop: 2 }}>{v.address || '—'}</div>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        background: AT.surfaceAlt,
                        border: `1px solid ${AT.border}`,
                        fontWeight: 700,
                        fontSize: 12,
                        color: pCount > 0 ? AT.primaryDark : AT.muted,
                      }}>
                        {pCount} букетов
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        background: isBlocked ? AT.dangerBg : isPending ? AT.warningBg : AT.successBg,
                        color: isBlocked ? AT.danger : isPending ? AT.warning : AT.success,
                      }}>
                        {isBlocked ? 'ЗАБЛОКИРОВАН' : isPending ? 'МОДЕРАЦИЯ' : 'АКТИВЕН'}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        {isPending && (
                          <button
                            onClick={() => handleApprove(v.id)}
                            style={{
                              background: AT.success,
                              color: '#fff',
                              border: 'none',
                              borderRadius: AT.radius,
                              padding: '5px 10px',
                              fontWeight: 700,
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                          >
                            ✓ Одобрить
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleStatus(v)}
                          style={{
                            background: isBlocked ? AT.successBg : AT.dangerBg,
                            color: isBlocked ? AT.success : AT.danger,
                            border: 'none',
                            borderRadius: AT.radius,
                            padding: '5px 10px',
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {isBlocked ? 'Разблокировать' : 'Заблокировать'}
                        </button>

                        <button
                          onClick={() => openEdit(v)}
                          style={{
                            background: AT.surfaceAlt,
                            color: AT.ink,
                            border: `1px solid ${AT.border}`,
                            borderRadius: AT.radius,
                            padding: '5px 10px',
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          Изменить
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(v.id)}
                          style={{
                            background: 'transparent',
                            color: AT.danger,
                            border: `1px solid ${AT.border}`,
                            borderRadius: AT.radius,
                            padding: '5px 8px',
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Create Vendor Modal */}
      {editingVendor && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
          <div style={{
            background: AT.surface,
            borderRadius: AT.radiusLg,
            padding: '28px 30px',
            maxWidth: 540,
            width: '100%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: AT.ink }}>
                {editingVendor.isNew ? 'Добавить новый цветочный магазин' : `Редактировать «${editingVendor.name}»`}
              </div>
              <button
                onClick={() => setEditingVendor(null)}
                style={{ background: 'none', border: 'none', fontSize: 22, color: AT.muted, cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, textTransform: 'uppercase' }}>
                  Название магазина
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Розалия Flowers"
                  required
                  style={inp()}
                />
              </div>

              {/* Tier selection in modal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, textTransform: 'uppercase' }}>
                    Категория масштаба
                  </label>
                  <select
                    value={editForm.tier || 'small'}
                    onChange={e => setEditForm({ ...editForm, tier: e.target.value })}
                    style={inp()}
                  >
                    <option value="small">🌱 Маленький салон / Точка</option>
                    <option value="medium">🏪 Средний цветочный магазин</option>
                    <option value="flagship">👑 Крупная сеть / Флагман</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, textTransform: 'uppercase' }}>
                    Статус вендора
                  </label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    style={inp()}
                  >
                    <option value="approved">Активен (Approved)</option>
                    <option value="pending">На проверке (Pending)</option>
                    <option value="blocked">Заблокирован (Blocked)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, textTransform: 'uppercase' }}>
                    Телефон / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+996 555 123 456"
                    style={inp()}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, textTransform: 'uppercase' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="shop@flowo.kg"
                    style={inp()}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, textTransform: 'uppercase' }}>
                    Город
                  </label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                    style={inp()}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, textTransform: 'uppercase' }}>
                    Адрес
                  </label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="ул. Киевская 120"
                    style={inp()}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, textTransform: 'uppercase' }}>
                    Режим работы
                  </label>
                  <input
                    type="text"
                    value={editForm.hours}
                    onChange={e => setEditForm({ ...editForm, hours: e.target.value })}
                    style={inp()}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, textTransform: 'uppercase' }}>
                    Логотип URL
                  </label>
                  <input
                    type="text"
                    value={editForm.logo_url}
                    onChange={e => setEditForm({ ...editForm, logo_url: e.target.value })}
                    placeholder="https://..."
                    style={inp()}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, textTransform: 'uppercase' }}>
                  Описание концепции магазина
                </label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  style={{ ...inp(), resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '11px',
                    background: saving ? AT.muted : AT.primary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: AT.radius,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? 'Сохраняем...' : 'Сохранить изменения'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingVendor(null)}
                  style={{
                    padding: '11px 20px',
                    background: AT.surfaceAlt,
                    color: AT.ink,
                    border: `1px solid ${AT.border}`,
                    borderRadius: AT.radius,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
          <div style={{
            background: AT.surface,
            borderRadius: AT.radiusLg,
            padding: '24px 28px',
            maxWidth: 400,
            width: '100%',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: AT.ink, marginBottom: 8 }}>
              Удалить магазин?
            </div>
            <div style={{ fontSize: 13, color: AT.muted, marginBottom: 20 }}>
              Магазин будет удален из базы данных Flowo.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: AT.danger,
                  color: '#fff',
                  border: 'none',
                  borderRadius: AT.radius,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Да, удалить
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: AT.surfaceAlt,
                  color: AT.ink,
                  border: `1px solid ${AT.border}`,
                  borderRadius: AT.radius,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
