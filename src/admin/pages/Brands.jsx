import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchAllBrands, upsertBrand, deleteBrand, toggleBrandActive } from '../../service/brands.js';

const EMPTY_FORM = { id: '', name: '', logo_url: '', sort: '0', active: true };

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

function StatusBadge({ active }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
      background: active ? AT.successBg : AT.dangerBg,
      color: active ? AT.success : AT.danger,
    }}>
      {active ? 'АКТИВЕН' : 'СКРЫТ'}
    </span>
  );
}

export function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function load() {
    setLoading(true);
    try {
      setBrands(await fetchAllBrands());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditId(null);
    setForm({ ...EMPTY_FORM, id: `brand-${Date.now().toString(36)}` });
    setShowForm(true);
    setError('');
  }

  function openEdit(b) {
    setEditId(b.id);
    setForm({ id: b.id, name: b.name ?? '', logo_url: b.logo_url ?? '', sort: String(b.sort ?? 0), active: b.active !== false });
    setShowForm(true);
    setError('');
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setError('');
  }

  async function save() {
    if (!form.name.trim()) { setError('Название обязательно'); return; }
    setSaving(true);
    setError('');
    try {
      await upsertBrand({
        id: form.id,
        name: form.name.trim(),
        logo_url: form.logo_url.trim() || null,
        sort: Number(form.sort),
        active: form.active,
      });
      await load();
      closeForm();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteBrand(id);
      setConfirmDelete(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleActive(id, current) {
    try {
      await toggleBrandActive(id, !current);
      setBrands(bs => bs.map(b => b.id === id ? { ...b, active: !current } : b));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
          Бренды <span style={{ fontSize: 14, fontWeight: 600, color: AT.muted }}>({brands.length})</span>
        </h1>
        <button
          onClick={openNew}
          style={{ padding: '9px 18px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
        >
          + Добавить бренд
        </button>
      </div>

      {error && (
        <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {showForm && (
        <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: AT.ink, marginBottom: 20 }}>
            {editId ? `Редактировать: ${editId}` : 'Новый бренд'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, letterSpacing: '0.04em' }}>ID</label>
              <input style={inp()} value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!editId} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, letterSpacing: '0.04em' }}>
                НАЗВАНИЕ <span style={{ color: AT.danger }}>*</span>
              </label>
              <input style={inp()} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nivea" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, letterSpacing: '0.04em' }}>URL ЛОГОТИПА</label>
              <input style={inp()} value={form.logo_url} onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))} placeholder="https://..." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, letterSpacing: '0.04em' }}>ПОРЯДОК</label>
              <input style={inp()} type="number" value={form.sort} onChange={e => setForm(f => ({ ...f, sort: e.target.value }))} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, active: !f.active }))}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', border: `1.5px solid ${form.active ? AT.primary : AT.border}`,
                borderRadius: AT.radius, background: form.active ? AT.primaryBg : 'transparent',
                color: form.active ? AT.primary : AT.inkLight,
                fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <span style={{ width: 14, height: 14, borderRadius: '50%', background: form.active ? AT.primary : AT.border, flexShrink: 0 }} />
              Активен
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} disabled={saving} style={{ padding: '9px 20px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button onClick={closeForm} style={{ padding: '9px 20px', background: 'transparent', color: AT.inkLight, border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 14, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
              Отмена
            </button>
          </div>
        </div>
      )}

      <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: AT.muted, fontSize: 14 }}>Загрузка...</div>
        ) : brands.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: AT.muted, fontSize: 14 }}>Нет брендов</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Manrope, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${AT.border}`, background: AT.surfaceAlt }}>
                {['Логотип', 'Название', 'ID', 'Порядок', 'Статус', ''].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brands.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: i < brands.length - 1 ? `1px solid ${AT.border}` : 'none' }}>
                  <td style={{ padding: '10px 14px' }}>
                    {b.logo_url ? (
                      <img src={b.logo_url} alt={b.name} style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4, border: `1px solid ${AT.border}` }} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: 4, background: AT.surfaceAlt, border: `1px solid ${AT.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 14, color: AT.muted }}>{b.name.charAt(0)}</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 14, fontWeight: 700, color: AT.ink }}>{b.name}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: AT.muted, fontFamily: 'monospace' }}>{b.id}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: AT.inkLight }}>{b.sort}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <button onClick={() => toggleActive(b.id, b.active)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <StatusBadge active={b.active} />
                    </button>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => openEdit(b)}
                        style={{ padding: '5px 14px', background: 'transparent', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 12, fontWeight: 600, color: AT.inkLight, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
                      >
                        Изменить
                      </button>
                      {confirmDelete === b.id ? (
                        <button
                          onClick={() => handleDelete(b.id)}
                          style={{ padding: '5px 14px', background: AT.danger, border: 'none', borderRadius: AT.radius, fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
                        >
                          Удалить?
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(b.id)}
                          style={{ padding: '5px 14px', background: AT.dangerBg, border: 'none', borderRadius: AT.radius, fontSize: 12, fontWeight: 600, color: AT.danger, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
