import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchCategories, upsertCategory, deleteCategory } from '../../service/categories.js';

const EMPTY = { id: '', ru: '', emoji: '', sort: 0 };

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: AT.inkLight, letterSpacing: '0.02em' }}>
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

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

export function Categories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCats(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startEdit(cat) {
    setEditId(cat.id);
    setForm({ id: cat.id, ru: cat.ru, emoji: cat.emoji ?? '', sort: cat.sort ?? 0 });
    setError('');
  }

  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY);
    setError('');
  }

  async function save() {
    if (!form.id.trim()) { setError('ID обязателен'); return; }
    if (!form.ru.trim()) { setError('Название обязательно'); return; }
    setSaving(true);
    setError('');
    try {
      await upsertCategory({ id: form.id.trim(), ru: form.ru.trim(), emoji: form.emoji.trim(), sort: Number(form.sort) });
      await load();
      cancelEdit();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete(id) {
    try {
      await deleteCategory(id);
      await load();
      setDeleteConfirm(null);
    } catch (e) {
      setError(e.message);
      setDeleteConfirm(null);
    }
  }

  const isNew = editId === '__new__';
  const isEditing = editId !== null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
          Категории
        </h1>
        {!isEditing && (
          <button
            onClick={() => { setEditId('__new__'); setForm(EMPTY); setError(''); }}
            style={{
              padding: '9px 18px', background: AT.primary, color: '#fff',
              border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700,
              fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
            }}
          >
            + Добавить категорию
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {isEditing && (
        <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: AT.ink, marginBottom: 20 }}>
            {isNew ? 'Новая категория' : `Редактировать: ${editId}`}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 80px 80px', gap: 16, marginBottom: 20 }}>
            <Field label="ID (slug)">
              <input
                style={inp()}
                value={form.id}
                onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                disabled={!isNew}
                placeholder="face"
              />
            </Field>
            <Field label="Название">
              <input style={inp()} value={form.ru} onChange={e => setForm(f => ({ ...f, ru: e.target.value }))} placeholder="Уход за лицом" />
            </Field>
            <Field label="Эмодзи">
              <input style={inp()} value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="🌸" />
            </Field>
            <Field label="Порядок">
              <input style={inp()} type="number" value={form.sort} onChange={e => setForm(f => ({ ...f, sort: e.target.value }))} />
            </Field>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} disabled={saving} style={{ padding: '9px 20px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button onClick={cancelEdit} style={{ padding: '9px 20px', background: 'transparent', color: AT.inkLight, border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 14, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
              Отмена
            </button>
          </div>
        </div>
      )}

      <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: AT.muted, fontSize: 14 }}>Загрузка...</div>
        ) : cats.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: AT.muted, fontSize: 14 }}>Нет категорий</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Manrope, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${AT.border}`, background: AT.surfaceAlt }}>
                {['', 'ID', 'Название', 'Порядок', ''].map((h, i) => (
                  <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cats.map((cat, i) => (
                <tr key={cat.id} style={{ borderBottom: i < cats.length - 1 ? `1px solid ${AT.border}` : 'none' }}>
                  <td style={{ padding: '12px 16px', fontSize: 22, width: 48 }}>{cat.emoji}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: AT.muted, fontFamily: 'monospace' }}>{cat.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: AT.ink }}>{cat.ru}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: AT.muted }}>{cat.sort}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => startEdit(cat)}
                        style={{ padding: '5px 14px', background: 'transparent', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 12, fontWeight: 600, color: AT.inkLight, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
                      >
                        Изменить
                      </button>
                      {deleteConfirm === cat.id ? (
                        <>
                          <button onClick={() => confirmDelete(cat.id)} style={{ padding: '5px 14px', background: AT.danger, border: 'none', borderRadius: AT.radius, fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>Удалить</button>
                          <button onClick={() => setDeleteConfirm(null)} style={{ padding: '5px 14px', background: 'transparent', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 12, fontWeight: 600, color: AT.inkLight, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>Отмена</button>
                        </>
                      ) : (
                        <button onClick={() => setDeleteConfirm(cat.id)} style={{ padding: '5px 14px', background: 'transparent', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 12, fontWeight: 600, color: AT.danger, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>Удалить</button>
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
