import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchAllStores, upsertStore, deleteStore, toggleStoreActive } from '../../service/stores.js';
import { StoresSkeleton } from '../ui/Skeleton.jsx';

const EMPTY_FORM = {
  id: '', name: '', address: '', district: '', city: 'Бишкек',
  hours: '09:00 – 21:00', rating: '4.5', reviews: '0',
  map_url: '', badge: '', active: true, sort: '0',
};

const inp = (extra = {}) => ({
  padding: '8px 12px', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius,
  fontSize: 14, fontFamily: 'Manrope, sans-serif', color: AT.ink,
  background: AT.surface, outline: 'none', width: '100%', boxSizing: 'border-box', ...extra,
});

function Field({ label, children, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, letterSpacing: '0.04em' }}>
        {label.toUpperCase()}{required && <span style={{ color: AT.danger }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
      background: active ? AT.successBg : AT.dangerBg, color: active ? AT.success : AT.danger,
    }}>
      {active ? 'АКТИВЕН' : 'СКРЫТ'}
    </span>
  );
}

function StorePreview({ store }) {
  const rating = parseFloat(store.rating) || 0;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div style={{ background: '#F8F9FA', border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(230,9,122,0.08) 0%, rgba(244,212,35,0.08) 100%)',
        padding: '16px 20px', borderBottom: `1px solid ${AT.border}`,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: AT.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: AT.ink }}>{store.name || 'Название магазина'}</div>
            <div style={{ fontSize: 12, color: AT.muted, marginTop: 2 }}>{store.district || 'Район'}</div>
          </div>
        </div>
        {store.badge && (
          <span style={{ background: AT.primary, color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 999 }}>
            {store.badge}
          </span>
        )}
      </div>
      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={AT.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink }}>{store.address || 'Адрес'}</div>
            <div style={{ fontSize: 11, color: AT.muted }}>{store.city}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={AT.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ fontSize: 12, fontWeight: 700, color: AT.ink }}>{store.hours}</span>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="12" height="12" viewBox="0 0 24 24"
              fill={i < full || (i === full && half) ? '#F89020' : 'none'}
              stroke="#F89020" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
          <span style={{ fontSize: 11, fontWeight: 700, color: AT.ink, marginLeft: 4 }}>{rating.toFixed(1)}</span>
          <span style={{ fontSize: 11, color: AT.muted, marginLeft: 2 }}>· {Number(store.reviews).toLocaleString('ru-RU')} отзывов</span>
        </div>
      </div>
    </div>
  );
}

export function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('list');
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function load() {
    setLoading(true);
    try {
      setStores(await fetchAllStores());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditId(null);
    setForm({ ...EMPTY_FORM, id: `s${Date.now().toString(36)}`, sort: String(stores.length) });
    setFormError('');
    setView('edit');
  }

  function openEdit(s) {
    setEditId(s.id);
    setForm({
      id: s.id, name: s.name ?? '', address: s.address ?? '',
      district: s.district ?? '', city: s.city ?? 'Бишкек',
      hours: s.hours ?? '09:00 – 21:00',
      rating: String(s.rating ?? '4.5'), reviews: String(s.reviews ?? '0'),
      map_url: s.map_url ?? '', badge: s.badge ?? '',
      active: s.active !== false, sort: String(s.sort ?? 0),
    });
    setFormError('');
    setView('edit');
  }

  async function save() {
    if (!form.name.trim()) { setFormError('Название обязательно'); return; }
    if (!form.address.trim()) { setFormError('Адрес обязателен'); return; }
    setSaving(true);
    setFormError('');
    try {
      await upsertStore({
        id: form.id,
        name: form.name.trim(),
        address: form.address.trim(),
        district: form.district.trim(),
        city: form.city.trim(),
        hours: form.hours.trim(),
        rating: parseFloat(form.rating) || 0,
        reviews: parseInt(form.reviews) || 0,
        map_url: form.map_url.trim() || null,
        badge: form.badge.trim() || null,
        active: form.active,
        sort: parseInt(form.sort) || 0,
      });
      await load();
      setView('list');
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteStore(id);
      setConfirmDelete(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleActive(id, current) {
    try {
      await toggleStoreActive(id, !current);
      setStores(ss => ss.map(s => s.id === id ? { ...s, active: !current } : s));
    } catch (e) {
      setError(e.message);
    }
  }

  if (view === 'edit') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => setView('list')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, padding: '7px 14px', fontSize: 13, fontWeight: 600, color: AT.inkLight, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
            ← Назад
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
            {editId ? 'Редактировать магазин' : 'Новый магазин'}
          </h1>
        </div>

        {formError && (
          <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
            {formError}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24, alignItems: 'start' }}>
          {/* Left: form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 4 }}>ОСНОВНОЕ</div>
              <Field label="ID">
                <input style={inp()} value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!editId} />
              </Field>
              <Field label="Название" required>
                <input style={inp()} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Оптовые цены 01 · Киевская" />
              </Field>
              <Field label="Метка (badge)">
                <input style={inp()} value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="Главный" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Field label="Порядок">
                  <input style={inp()} type="number" value={form.sort} onChange={e => setForm(f => ({ ...f, sort: e.target.value }))} />
                </Field>
              </div>
              <button type="button" onClick={() => setForm(f => ({ ...f, active: !f.active }))} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: `1.5px solid ${form.active ? AT.primary : AT.border}`, borderRadius: AT.radius, background: form.active ? AT.primaryBg : 'transparent', color: form.active ? AT.primary : AT.inkLight, fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: form.active ? AT.primary : AT.border, flexShrink: 0 }} />
                Активен
              </button>
            </div>

            <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 4 }}>АДРЕС</div>
              <Field label="Адрес" required>
                <input style={inp()} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="ул. Киевская, 69, 1 этаж" />
              </Field>
              <Field label="Район">
                <input style={inp()} value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} placeholder="Первомайский район" />
              </Field>
              <Field label="Город">
                <input style={inp()} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Бишкек, 720040" />
              </Field>
              <Field label="Ссылка 2GIS">
                <input style={inp()} value={form.map_url} onChange={e => setForm(f => ({ ...f, map_url: e.target.value }))} placeholder="https://2gis.kg/..." />
              </Field>
            </div>

            <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 4 }}>ЧАСЫ И РЕЙТИНГ</div>
              <Field label="Часы работы">
                <input style={inp()} value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} placeholder="09:00 – 21:00" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Field label="Рейтинг">
                  <input style={inp()} type="number" step="0.1" min="1" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
                </Field>
                <Field label="Отзывов">
                  <input style={inp()} type="number" value={form.reviews} onChange={e => setForm(f => ({ ...f, reviews: e.target.value }))} />
                </Field>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={save} disabled={saving} style={{ padding: '10px 22px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button onClick={() => setView('list')} style={{ padding: '10px 22px', background: 'transparent', color: AT.inkLight, border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 14, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
                Отмена
              </button>
            </div>
          </div>

          {/* Right: live preview */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.06em', marginBottom: 10 }}>
              ПРЕДПРОСМОТР
            </div>
            <StorePreview store={form} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
          Магазины <span style={{ fontSize: 14, fontWeight: 600, color: AT.muted }}>({stores.length})</span>
        </h1>
        <button onClick={openNew} style={{ padding: '9px 18px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
          + Добавить магазин
        </button>
      </div>

      {error && (
        <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading ? (
        <StoresSkeleton count={4} />
      ) : stores.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: AT.muted, fontSize: 14, background: AT.surface, borderRadius: AT.radiusLg, border: `1px solid ${AT.border}` }}>
          Нет магазинов
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {stores.map(s => (
            <div key={s.id} style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
              <StorePreview store={s} />
              <div style={{ padding: '12px 16px', borderTop: `1px solid ${AT.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => toggleActive(s.id, s.active)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <StatusBadge active={s.active} />
                </button>
                <div style={{ flex: 1 }} />
                <button onClick={() => openEdit(s)} style={{ padding: '6px 14px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 12, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
                  Изменить
                </button>
                {confirmDelete === s.id ? (
                  <button onClick={() => handleDelete(s.id)} style={{ padding: '6px 14px', background: AT.danger, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 12, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
                    Удалить?
                  </button>
                ) : (
                  <button onClick={() => setConfirmDelete(s.id)} style={{ padding: '6px 14px', background: AT.dangerBg, color: AT.danger, border: 'none', borderRadius: AT.radius, fontSize: 12, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
