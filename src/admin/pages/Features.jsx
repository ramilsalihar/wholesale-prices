import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchAllFeatures, upsertFeature, deleteFeature, toggleFeatureActive } from '../../service/features.js';
import { FeaturesSkeleton } from '../ui/Skeleton.jsx';

const ICON_OPTIONS = [
  { value: 'truck',   label: '🚚 Доставка (truck)' },
  { value: 'shield',  label: '🛡 Гарантия (shield)' },
  { value: 'flame',   label: '🔥 Акция (flame)' },
  { value: 'heart',   label: '💗 Отзывы (heart)' },
  { value: 'star',    label: '⭐ Рейтинг (star)' },
  { value: 'check',   label: '✓ Проверка (check)' },
  { value: 'cart',    label: '🛒 Корзина (cart)' },
];

const EMPTY = { id: '', icon: 'truck', title: '', subtitle: '', sort: 0, active: true };

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

export function Features() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  function load() {
    setLoading(true);
    fetchAllFeatures()
      .then(setItems)
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }

  function openNew() {
    const nextSort = items.length > 0 ? Math.max(...items.map(x => x.sort)) + 1 : 0;
    setForm({ ...EMPTY, id: 'f' + Date.now(), sort: nextSort });
    setError('');
  }

  function openEdit(item) {
    setForm({ ...item });
    setError('');
  }

  async function save() {
    if (!form.title.trim()) { setError('Название обязательно'); return; }
    setSaving(true);
    setError('');
    try {
      await upsertFeature(form);
      setForm(null);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id, active) {
    try {
      await toggleFeatureActive(id, active);
      setItems(prev => prev.map(x => x.id === id ? { ...x, active } : x));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Удалить этот элемент?')) return;
    try {
      await deleteFeature(id);
      setItems(prev => prev.filter(x => x.id !== id));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
          Преимущества
        </h1>
        <button
          onClick={openNew}
          style={{
            padding: '8px 18px', background: AT.primary, color: '#fff',
            border: 'none', borderRadius: AT.radius, fontSize: 14,
            fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
          }}
        >
          + Добавить
        </button>
      </div>

      {error && !form && (
        <div style={{ background: 'rgba(222,53,11,0.08)', border: `1px solid rgba(222,53,11,0.2)`, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, color: AT.danger, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Form */}
      {form && (
        <div style={{
          background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg,
          padding: 24, marginBottom: 24,
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: AT.ink, marginBottom: 16 }}>
            {items.find(x => x.id === form.id) ? 'Редактировать' : 'Новый элемент'}
          </div>

          {error && (
            <div style={{ background: 'rgba(222,53,11,0.08)', border: `1px solid rgba(222,53,11,0.2)`, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, color: AT.danger, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="Название" required>
              <input
                style={inp()}
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Доставка завтра"
              />
            </Field>
            <Field label="Подзаголовок">
              <input
                style={inp()}
                value={form.subtitle ?? ''}
                onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                placeholder="по Бишкеку"
              />
            </Field>
            <Field label="Иконка">
              <select
                style={inp()}
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
              >
                {ICON_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Порядок сортировки">
              <input
                style={inp()}
                type="number"
                value={form.sort}
                onChange={e => setForm(f => ({ ...f, sort: parseInt(e.target.value) || 0 }))}
              />
            </Field>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 20 }}>
            <input
              type="checkbox"
              checked={form.active}
              onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: AT.ink }}>Активен (показывать на сайте)</span>
          </label>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={save}
              disabled={saving}
              style={{
                padding: '9px 20px', background: AT.primary, color: '#fff', border: 'none',
                borderRadius: AT.radius, fontSize: 14, fontWeight: 700,
                fontFamily: 'Manrope, sans-serif', cursor: saving ? 'default' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              onClick={() => { setForm(null); setError(''); }}
              style={{
                padding: '9px 20px', background: 'transparent', color: AT.inkLight,
                border: `1.5px solid ${AT.border}`, borderRadius: AT.radius,
                fontSize: 14, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
        {loading ? (
          <FeaturesSkeleton count={4} />
        ) : items.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: AT.muted, fontSize: 14 }}>
            Нет элементов. Нажмите «+ Добавить».
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 20px',
                borderBottom: i < items.length - 1 ? `1px solid ${AT.border}` : 'none',
                background: item.active ? AT.surface : AT.surfaceAlt,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: item.active ? `${AT.primary}15` : AT.border,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>
                {ICON_OPTIONS.find(o => o.value === item.icon)?.label.split(' ')[0] ?? '?'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: item.active ? AT.ink : AT.muted }}>{item.title}</div>
                {item.subtitle && <div style={{ fontSize: 12, color: AT.muted, marginTop: 2 }}>{item.subtitle}</div>}
              </div>

              <div style={{ fontSize: 11, color: AT.muted, fontWeight: 600 }}>#{item.sort}</div>

              <span style={{
                padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                background: item.active ? 'rgba(0,135,90,0.1)' : 'rgba(100,100,100,0.1)',
                color: item.active ? '#00875A' : AT.muted,
              }}>
                {item.active ? 'АКТИВЕН' : 'СКРЫТ'}
              </span>

              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => handleToggle(item.id, !item.active)}
                  style={{
                    padding: '6px 12px', background: 'transparent',
                    border: `1.5px solid ${AT.border}`, borderRadius: AT.radius,
                    fontSize: 12, fontWeight: 600, color: AT.inkLight,
                    fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
                  }}
                >
                  {item.active ? 'Скрыть' : 'Показать'}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  style={{
                    padding: '6px 12px', background: 'transparent',
                    border: `1.5px solid ${AT.border}`, borderRadius: AT.radius,
                    fontSize: 12, fontWeight: 600, color: AT.inkLight,
                    fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
                  }}
                >
                  Изменить
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    padding: '6px 12px', background: 'transparent',
                    border: `1.5px solid rgba(222,53,11,0.3)`, borderRadius: AT.radius,
                    fontSize: 12, fontWeight: 600, color: AT.danger,
                    fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
                  }}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
