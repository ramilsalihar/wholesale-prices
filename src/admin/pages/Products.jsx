import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchAllProducts, upsertProduct, toggleProductActive } from '../../service/products.js';
import { fetchCategories } from '../../service/categories.js';
import { fetchAllBrands } from '../../service/brands.js';
import { ProductsTableSkeleton } from '../ui/Skeleton.jsx';

const SHAPES = ['jar', 'bottle', 'tube', 'flask', 'lipstick', 'palette', 'pencil', 'stick', 'spray', 'bar'];

const EMPTY_FORM = {
  id: '', cat: '', brand_id: '', brand: '', name: '', vol: '',
  price: '', old: '', rating: '4.8', reviews: '0',
  hit: false, hue: [300, 50, 75], shape: 'bottle', active: true,
  description: '', ingredients: '', image_url: '', stock: '0', sku: '',
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

function Toggle({ value, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!value)} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px', border: `1.5px solid ${value ? AT.primary : AT.border}`,
      borderRadius: AT.radius, background: value ? AT.primaryBg : 'transparent',
      color: value ? AT.primary : AT.inkLight,
      fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 14, height: 14, borderRadius: '50%', background: value ? AT.primary : AT.border, flexShrink: 0 }} />
      {label}
    </button>
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

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: `1px solid ${AT.border}` }}>
      <div style={{ width: 140, flexShrink: 0, fontSize: 12, fontWeight: 700, color: AT.muted, letterSpacing: '0.03em' }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: 13, color: AT.ink, fontWeight: 500, flex: 1 }}>{value}</div>
    </div>
  );
}

function ProductDetail({ product, cats, brands, onEdit, onBack, onToggleActive }) {
  const cat = cats.find(c => c.id === product.cat);
  const brand = brands.find(b => b.id === product.brand_id);
  const hue = product.hue ?? [300, 50, 75];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius,
            padding: '7px 14px', fontSize: 13, fontWeight: 600, color: AT.inkLight,
            fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
          }}
        >
          ← Назад
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em', flex: 1 }}>
          {product.name}
        </h1>
        <StatusBadge active={product.active} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: product.image_url ? '#F8F8F8' : AT.surfaceAlt,
            borderRadius: AT.radiusLg, border: `1px solid ${AT.border}`,
            aspectRatio: '1 / 1', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
            ) : (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="10" y="8" width="28" height="34" rx="4" fill="#C8C8C8" />
                <rect x="16" y="16" width="16" height="10" rx="2" fill="white" opacity="0.7" />
                <circle cx="24" cy="33" r="4" fill="white" opacity="0.5" />
              </svg>
            )}
          </div>

          <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 10 }}>
              ЦВЕТ (HSL)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                background: `hsl(${hue[0]}, ${hue[1]}%, ${hue[2]}%)`,
                border: `1px solid ${AT.border}`,
              }} />
              <div style={{ fontSize: 13, color: AT.inkLight, fontFamily: 'monospace' }}>
                H{hue[0]} S{hue[1]}% L{hue[2]}%
              </div>
            </div>
          </div>

          <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 10 }}>
              ЦЕНООБРАЗОВАНИЕ
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: AT.primary, letterSpacing: '-0.02em' }}>
              {product.price} с
            </div>
            {product.old && (
              <div style={{ fontSize: 13, color: AT.muted, textDecoration: 'line-through', marginTop: 2 }}>
                {product.old} с
              </div>
            )}
            {product.old && (
              <div style={{ fontSize: 13, fontWeight: 700, color: AT.success, marginTop: 4 }}>
                −{Math.round((1 - product.price / product.old) * 100)}% скидка
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 4 }}>ОСНОВНОЕ</div>
            <InfoRow label="ID" value={product.id} />
            <InfoRow label="SKU" value={product.sku} />
            <InfoRow label="Бренд" value={brand?.name ?? product.brand} />
            <InfoRow label="Категория" value={cat ? `${cat.emoji} ${cat.ru}` : product.cat} />
            <InfoRow label="Объём" value={product.vol} />
            <InfoRow label="Форма" value={product.shape} />
            <InfoRow label="На складе" value={product.stock != null ? `${product.stock} шт` : null} />
            <InfoRow label="Рейтинг" value={product.rating ? `${product.rating} ★ (${product.reviews} отзывов)` : null} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {product.hit && (
                <span style={{ fontSize: 12, fontWeight: 700, color: AT.primary, background: AT.primaryBg, padding: '3px 10px', borderRadius: 999 }}>
                  ХИТ ПРОДАЖ
                </span>
              )}
            </div>
          </div>

          {(product.description || product.ingredients) && (
            <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 12 }}>КОНТЕНТ</div>
              {product.description && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 6 }}>ОПИСАНИЕ</div>
                  <div style={{ fontSize: 13, color: AT.inkLight, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{product.description}</div>
                </div>
              )}
              {product.ingredients && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 6 }}>СОСТАВ</div>
                  <div style={{ fontSize: 13, color: AT.inkLight, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{product.ingredients}</div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={onEdit}
              style={{
                padding: '10px 22px', background: AT.primary, color: '#fff',
                border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700,
                fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
              }}
            >
              Редактировать
            </button>
            <button
              onClick={() => onToggleActive(product.id, product.active)}
              style={{
                padding: '10px 22px', background: 'transparent',
                border: `1.5px solid ${AT.border}`, borderRadius: AT.radius,
                fontSize: 14, fontWeight: 600, color: AT.inkLight,
                fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
              }}
            >
              {product.active ? 'Скрыть' : 'Активировать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ form, setForm, cats, brands, editId, saving, error, onSave, onCancel }) {
  const discount = form.price && form.old
    ? Math.round((1 - Number(form.price) / Number(form.old)) * 100)
    : null;

  return (
    <div>
      {error && (
        <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: 24, alignItems: 'start' }}>
        {/* Left column — mirrors ProductDetail left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Image preview + URL input */}
          <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
            <div style={{
              background: form.image_url ? '#F8F8F8' : AT.surfaceAlt,
              aspectRatio: '1 / 1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {form.image_url ? (
                <img src={form.image_url} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                  onError={e => e.currentTarget.style.opacity = '0.2'} />
              ) : (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="10" y="8" width="28" height="34" rx="4" fill="#C8C8C8" />
                  <rect x="16" y="16" width="16" height="10" rx="2" fill="white" opacity="0.7" />
                  <circle cx="24" cy="33" r="4" fill="white" opacity="0.5" />
                </svg>
              )}
            </div>
            <div style={{ padding: 12 }}>
              <Field label="URL фото">
                <input style={inp()} value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://..." />
              </Field>
            </div>
          </div>

          {/* HSL color */}
          <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 10 }}>
              ЦВЕТ (HSL)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                background: `hsl(${form.hue[0]}, ${form.hue[1]}%, ${form.hue[2]}%)`,
                border: `1px solid ${AT.border}`,
              }} />
              <div style={{ fontSize: 12, color: AT.inkLight, fontFamily: 'monospace' }}>
                H{form.hue[0]} S{form.hue[1]}% L{form.hue[2]}%
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['H', 'S', 'L'].map((label, i) => (
                <div key={label} style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: AT.muted, marginBottom: 4 }}>{label}</div>
                  <input style={inp()} type="number" value={form.hue[i]}
                    onChange={e => { const hue = [...form.hue]; hue[i] = Number(e.target.value); setForm(f => ({ ...f, hue })); }} />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 10 }}>
              ЦЕНООБРАЗОВАНИЕ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Field label="Цена (с)" required>
                <input style={inp()} type="number" value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="299" />
              </Field>
              <Field label="Старая цена (с)">
                <input style={inp()} type="number" value={form.old}
                  onChange={e => setForm(f => ({ ...f, old: e.target.value }))} placeholder="499" />
              </Field>
            </div>
            {discount !== null && discount > 0 && (
              <div style={{ fontSize: 13, fontWeight: 700, color: AT.success, marginTop: 10 }}>
                −{discount}% скидка
              </div>
            )}
          </div>
        </div>

        {/* Right column — mirrors ProductDetail right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Основное */}
          <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 16 }}>ОСНОВНОЕ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="ID">
                <input style={inp()} value={form.id}
                  onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!editId} />
              </Field>
              <Field label="Название" required>
                <input style={inp()} value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Крем для лица" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Категория" required>
                  <select style={inp()} value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
                    <option value="">— выберите —</option>
                    {cats.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.ru}</option>)}
                  </select>
                </Field>
                <Field label="Бренд">
                  <select style={inp()} value={form.brand_id} onChange={e => setForm(f => ({ ...f, brand_id: e.target.value }))}>
                    <option value="">— выберите —</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </Field>
                <Field label="Объём">
                  <input style={inp()} value={form.vol}
                    onChange={e => setForm(f => ({ ...f, vol: e.target.value }))} placeholder="50 мл" />
                </Field>
                <Field label="Форма">
                  <select style={inp()} value={form.shape} onChange={e => setForm(f => ({ ...f, shape: e.target.value }))}>
                    {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="На складе (шт)">
                  <input style={inp()} type="number" min="0" value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
                </Field>
                <Field label="Артикул (SKU)">
                  <input style={inp()} value={form.sku}
                    onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="SKU-001" />
                </Field>
                <Field label="Рейтинг">
                  <input style={inp()} type="number" step="0.1" min="1" max="5" value={form.rating}
                    onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
                </Field>
                <Field label="Отзывов">
                  <input style={inp()} type="number" value={form.reviews}
                    onChange={e => setForm(f => ({ ...f, reviews: e.target.value }))} />
                </Field>
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 4, flexWrap: 'wrap' }}>
                <Toggle value={form.hit} onChange={v => setForm(f => ({ ...f, hit: v }))} label="Хит продаж" />
                <Toggle value={form.active} onChange={v => setForm(f => ({ ...f, active: v }))} label="Активен" />
              </div>
            </div>
          </div>

          {/* Контент */}
          <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 16 }}>КОНТЕНТ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Описание">
                <textarea style={inp({ minHeight: 100, resize: 'vertical' })} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Описание товара..." />
              </Field>
              <Field label="Состав">
                <textarea style={inp({ minHeight: 100, resize: 'vertical' })} value={form.ingredients}
                  onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
                  placeholder="Aqua, Glycerin..." />
              </Field>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onSave} disabled={saving} style={{ padding: '10px 22px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button onClick={onCancel} style={{ padding: '10px 22px', background: 'transparent', color: AT.inkLight, border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 14, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Products() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [search, setSearch] = useState('');

  const [view, setView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [prods, categories, allBrands] = await Promise.all([fetchAllProducts(), fetchCategories(), fetchAllBrands()]);
      setProducts(prods);
      setCats(categories);
      setBrands(allBrands);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openDetail(p) {
    setSelectedProduct(p);
    setView('detail');
  }

  function openEdit(p) {
    setForm({
      id: p.id, cat: p.cat ?? '', brand_id: p.brand_id ?? '', brand: p.brand ?? '',
      name: p.name ?? '', vol: p.vol ?? '',
      price: String(p.price ?? ''), old: String(p.old ?? ''),
      rating: String(p.rating ?? '4.8'), reviews: String(p.reviews ?? '0'),
      hit: !!p.hit, hue: p.hue ?? [300, 50, 75], shape: p.shape ?? 'bottle',
      active: p.active !== false,
      description: p.description ?? '', ingredients: p.ingredients ?? '',
      image_url: p.image_url ?? '', stock: String(p.stock ?? '0'), sku: p.sku ?? '',
    });
    setFormError('');
    setView('edit');
  }

  function openNew() {
    setSelectedProduct(null);
    setForm({ ...EMPTY_FORM, id: `p${Date.now().toString(36)}` });
    setFormError('');
    setView('edit');
  }

  async function save() {
    if (!form.cat) { setFormError('Выберите категорию'); return; }
    if (!form.name.trim()) { setFormError('Название обязательно'); return; }
    if (!form.price) { setFormError('Цена обязательна'); return; }
    setSaving(true);
    setFormError('');
    try {
      const selectedBrand = brands.find(b => b.id === form.brand_id);
      const saved = await upsertProduct({
        id: form.id, cat: form.cat,
        brand_id: form.brand_id || null,
        brand: selectedBrand ? selectedBrand.name : form.brand.trim(),
        name: form.name.trim(), vol: form.vol.trim(),
        price: Number(form.price), old: form.old ? Number(form.old) : null,
        rating: Number(form.rating), reviews: Number(form.reviews),
        hit: form.hit, hue: form.hue, shape: form.shape, active: form.active,
        description: form.description.trim() || null,
        ingredients: form.ingredients.trim() || null,
        image_url: form.image_url.trim() || null,
        stock: Number(form.stock), sku: form.sku.trim() || null,
      });
      await load();
      if (selectedProduct) {
        const refreshed = products.find(p => p.id === saved.id) ?? saved;
        setSelectedProduct(refreshed);
        setView('detail');
      } else {
        setSelectedProduct(saved);
        setView('detail');
      }
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id, current) {
    try {
      await toggleProductActive(id, !current);
      const updated = { ...products.find(p => p.id === id), active: !current };
      setProducts(ps => ps.map(p => p.id === id ? updated : p));
      if (selectedProduct?.id === id) setSelectedProduct(updated);
    } catch (e) {
      setError(e.message);
    }
  }

  const visible = products
    .filter(p => !filterCat || p.cat === filterCat)
    .filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()));

  const catName = (id) => cats.find(c => c.id === id)?.ru ?? id;

  if (view === 'detail' && selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        cats={cats}
        brands={brands}
        onBack={() => setView('list')}
        onEdit={() => openEdit(selectedProduct)}
        onToggleActive={toggleActive}
      />
    );
  }

  if (view === 'edit') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => selectedProduct ? setView('detail') : setView('list')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius,
              padding: '7px 14px', fontSize: 13, fontWeight: 600, color: AT.inkLight,
              fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
            }}
          >
            ← {selectedProduct ? 'К товару' : 'К списку'}
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
            {selectedProduct ? `Редактировать: ${selectedProduct.name}` : 'Новый товар'}
          </h1>
        </div>
        <ProductForm
          form={form} setForm={setForm}
          cats={cats} brands={brands}
          editId={selectedProduct?.id ?? null}
          saving={saving} error={formError}
          onSave={save}
          onCancel={() => selectedProduct ? setView('detail') : setView('list')}
        />
      </div>
    );
  }

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
        <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input style={inp({ maxWidth: 240, flex: 1 })} placeholder="Поиск по названию / бренду"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select style={inp({ maxWidth: 200 })} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">Все категории</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.ru}</option>)}
        </select>
      </div>

      <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Manrope, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${AT.border}`, background: AT.surfaceAlt }}>
                {['Фото', 'Название', 'Бренд', 'Категория', 'Цена', 'Склад', 'Статус'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            {loading ? (
              <ProductsTableSkeleton />
            ) : visible.length === 0 ? (
              <tbody><tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: AT.muted, fontSize: 14 }}>Нет товаров</td></tr></tbody>
            ) : (
              <tbody>
                {visible.map((p, i) => (
                  <tr
                    key={p.id}
                    onClick={() => openDetail(p)}
                    style={{
                      borderBottom: i < visible.length - 1 ? `1px solid ${AT.border}` : 'none',
                      cursor: 'pointer', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = AT.surfaceAlt}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px 14px' }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt="" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6, border: `1px solid ${AT.border}` }} />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: 6, background: `hsl(${(p.hue ?? [300])[0]}, 40%, 88%)`, border: `1px solid ${AT.border}` }} />
                      )}
                    </td>
                    <td style={{ padding: '11px 14px', maxWidth: 200 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: AT.muted, fontFamily: 'monospace', marginTop: 2 }}>{p.id}</div>
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: AT.inkLight, whiteSpace: 'nowrap' }}>{p.brand}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: AT.inkLight, whiteSpace: 'nowrap' }}>{catName(p.cat)}</td>
                    <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink }}>{p.price} с</div>
                      {p.old && <div style={{ fontSize: 11, color: AT.muted, textDecoration: 'line-through' }}>{p.old} с</div>}
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: AT.inkLight, whiteSpace: 'nowrap' }}>
                      {p.stock != null ? `${p.stock} шт` : '—'}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <button onClick={e => { e.stopPropagation(); toggleActive(p.id, p.active); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <StatusBadge active={p.active} />
                      </button>
                    </td>
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
