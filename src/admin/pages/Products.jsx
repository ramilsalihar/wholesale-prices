import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchAllProducts, upsertProduct, toggleProductActive, updateProduct } from '../../service/products.js';
import { fetchCategories } from '../../service/categories.js';

const SHAPES = ['jar', 'bottle', 'tube', 'flask', 'lipstick', 'palette', 'pencil', 'stick', 'spray', 'bar'];

const EMPTY_FORM = {
  id: '', cat: '', brand: '', name: '', vol: '',
  price: '', old: '', rating: '4.8', reviews: '0',
  hit: false, hue: [300, 50, 75], shape: 'bottle', active: true,
};

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

function Toggle({ value, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', border: `1.5px solid ${value ? AT.primary : AT.border}`,
        borderRadius: AT.radius, background: value ? AT.primaryBg : 'transparent',
        color: value ? AT.primary : AT.inkLight,
        fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700,
        cursor: 'pointer', whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 14, height: 14, borderRadius: '50%', background: value ? AT.primary : AT.border, flexShrink: 0 }} />
      {label}
    </button>
  );
}

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

export function Products() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [prods, categories] = await Promise.all([fetchAllProducts(), fetchCategories()]);
      setProducts(prods);
      setCats(categories);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditId(null);
    setForm({ ...EMPTY_FORM, id: `p${Date.now().toString(36)}` });
    setShowForm(true);
    setError('');
  }

  function openEdit(p) {
    setEditId(p.id);
    setForm({
      id: p.id, cat: p.cat ?? '', brand: p.brand ?? '', name: p.name ?? '',
      vol: p.vol ?? '', price: String(p.price ?? ''), old: String(p.old ?? ''),
      rating: String(p.rating ?? '4.8'), reviews: String(p.reviews ?? '0'),
      hit: !!p.hit, hue: p.hue ?? [300, 50, 75], shape: p.shape ?? 'bottle',
      active: p.active !== false,
    });
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
    if (!form.cat) { setError('Выберите категорию'); return; }
    if (!form.name.trim()) { setError('Название обязательно'); return; }
    if (!form.price) { setError('Цена обязательна'); return; }
    setSaving(true);
    setError('');
    try {
      await upsertProduct({
        id: form.id,
        cat: form.cat,
        brand: form.brand.trim(),
        name: form.name.trim(),
        vol: form.vol.trim(),
        price: Number(form.price),
        old: form.old ? Number(form.old) : null,
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        hit: form.hit,
        hue: form.hue,
        shape: form.shape,
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

  async function toggleActive(id, current) {
    try {
      await toggleProductActive(id, !current);
      setProducts(ps => ps.map(p => p.id === id ? { ...p, active: !current } : p));
    } catch (e) {
      setError(e.message);
    }
  }

  const catName = (id) => cats.find(c => c.id === id)?.ru ?? id;

  const visible = products
    .filter(p => !filterCat || p.cat === filterCat)
    .filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
          Товары <span style={{ fontSize: 14, fontWeight: 600, color: AT.muted }}>({products.length})</span>
        </h1>
        <button
          onClick={openNew}
          style={{ padding: '9px 18px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
        >
          + Добавить товар
        </button>
      </div>

      {error && (
        <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {showForm && (
        <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: AT.ink, marginBottom: 20 }}>
            {editId ? `Редактировать: ${editId}` : 'Новый товар'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
            <Field label="ID">
              <input style={inp()} value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!editId} />
            </Field>
            <Field label="Категория" required>
              <select
                style={inp()}
                value={form.cat}
                onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}
              >
                <option value="">— выберите —</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.ru}</option>)}
              </select>
            </Field>
            <Field label="Бренд">
              <input style={inp()} value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Nivea" />
            </Field>
            <Field label="Название" required>
              <input style={inp()} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Крем для лица" />
            </Field>
            <Field label="Объём">
              <input style={inp()} value={form.vol} onChange={e => setForm(f => ({ ...f, vol: e.target.value }))} placeholder="50 мл" />
            </Field>
            <Field label="Цена (с)" required>
              <input style={inp()} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="299" />
            </Field>
            <Field label="Старая цена (с)">
              <input style={inp()} type="number" value={form.old} onChange={e => setForm(f => ({ ...f, old: e.target.value }))} placeholder="499" />
            </Field>
            <Field label="Рейтинг">
              <input style={inp()} type="number" step="0.1" min="1" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
            </Field>
            <Field label="Отзывов">
              <input style={inp()} type="number" value={form.reviews} onChange={e => setForm(f => ({ ...f, reviews: e.target.value }))} />
            </Field>
            <Field label="Форма">
              <select style={inp()} value={form.shape} onChange={e => setForm(f => ({ ...f, shape: e.target.value }))}>
                {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, letterSpacing: '0.04em', marginBottom: 8 }}>
              ЦВЕТ (HSL)
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {['H', 'S', 'L'].map((label, i) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: AT.muted }}>{label}</span>
                  <input
                    style={inp({ width: 80 })}
                    type="number"
                    value={form.hue[i]}
                    onChange={e => {
                      const hue = [...form.hue];
                      hue[i] = Number(e.target.value);
                      setForm(f => ({ ...f, hue }));
                    }}
                  />
                </div>
              ))}
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `hsl(${form.hue[0]}, ${form.hue[1]}%, ${form.hue[2]}%)`, border: `1px solid ${AT.border}`, flexShrink: 0 }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <Toggle value={form.hit} onChange={v => setForm(f => ({ ...f, hit: v }))} label="Хит продаж" />
            <Toggle value={form.active} onChange={v => setForm(f => ({ ...f, active: v }))} label="Активен" />
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

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          style={inp({ maxWidth: 240, flex: 1 })}
          placeholder="Поиск по названию / бренду"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={inp({ maxWidth: 200 })} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">Все категории</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.ru}</option>)}
        </select>
      </div>

      <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: AT.muted, fontSize: 14 }}>Загрузка...</div>
        ) : visible.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: AT.muted, fontSize: 14 }}>Нет товаров</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Manrope, sans-serif' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${AT.border}`, background: AT.surfaceAlt }}>
                  {['ID', 'Название', 'Бренд', 'Категория', 'Цена', 'Хит', 'Статус', ''].map((h, i) => (
                    <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < visible.length - 1 ? `1px solid ${AT.border}` : 'none' }}>
                    <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 700, color: AT.muted, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{p.id}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600, color: AT.ink, maxWidth: 200 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: AT.inkLight, whiteSpace: 'nowrap' }}>{p.brand}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: AT.inkLight, whiteSpace: 'nowrap' }}>{catName(p.cat)}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 700, color: AT.ink, whiteSpace: 'nowrap' }}>{p.price} с</td>
                    <td style={{ padding: '11px 14px' }}>
                      {p.hit && <span style={{ fontSize: 11, fontWeight: 700, color: AT.primary, background: AT.primaryBg, padding: '2px 8px', borderRadius: 999 }}>Хит</span>}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <button
                        onClick={() => toggleActive(p.id, p.active)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <StatusBadge active={p.active} />
                      </button>
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => openEdit(p)}
                        style={{ padding: '5px 14px', background: 'transparent', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 12, fontWeight: 600, color: AT.inkLight, fontFamily: 'Manrope, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        Изменить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
