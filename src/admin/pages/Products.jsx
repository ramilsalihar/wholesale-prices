import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchAllProducts, upsertProduct, toggleProductActive } from '../../service/products.js';
import { fetchCategories } from '../../service/categories.js';
import { fetchAllBrands } from '../../service/brands.js';
import { ProductsTableSkeleton } from '../ui/Skeleton.jsx';

const SHAPES = ['jar', 'bottle', 'tube', 'flask', 'lipstick', 'palette', 'pencil', 'stick', 'spray', 'bar'];

const firstImg = (p) => Array.isArray(p?.images) ? (p.images[0] ?? null) : (p?.images ?? p?.image_url ?? null);
const allImgs = (p) => Array.isArray(p?.images) ? p.images.filter(Boolean) : (p?.images ? [p.images] : (p?.image_url ? [p.image_url] : []));

function useMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 700);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 700);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

// ── Images editor ────────────────────────────────────────────────

function ImagesEditor({ images, onChange }) {
  const [preview, setPreview] = React.useState(0);
  const idx = Math.min(preview, images.length - 1);
  const mainUrl = images[idx]?.trim() ?? '';

  const update = (i, val) => { const n = [...images]; n[i] = val; onChange(n); };
  const remove = (i) => { onChange(images.filter((_, j) => j !== i)); setPreview(0); };
  const add = () => onChange([...images, '']);

  return (
    <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
      <div style={{ background: mainUrl ? '#F8F8F8' : AT.surfaceAlt, aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {mainUrl ? (
          <img src={mainUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.currentTarget.style.opacity = '0.2'} />
        ) : (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="10" y="8" width="28" height="34" rx="4" fill="#C8C8C8" />
            <rect x="16" y="16" width="16" height="10" rx="2" fill="white" opacity="0.7" />
            <circle cx="24" cy="33" r="4" fill="white" opacity="0.5" />
          </svg>
        )}
      </div>

      {images.filter(u => u.trim()).length > 1 && (
        <div style={{ display: 'flex', gap: 6, padding: '8px 12px 0', flexWrap: 'wrap' }}>
          {images.map((url, i) => url.trim() ? (
            <div key={i} onClick={() => setPreview(i)} style={{
              width: 44, height: 44, borderRadius: 7, overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
              border: `2px solid ${i === idx ? AT.primary : AT.border}`,
              opacity: i === idx ? 1 : 0.55, transition: 'border-color 0.15s, opacity 0.15s',
            }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : null)}
        </div>
      )}

      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em' }}>ФОТОГРАФИИ</div>
        {images.map((url, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {url.trim() && (
              <img src={url} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, border: `1px solid ${AT.border}`, flexShrink: 0, cursor: 'pointer' }}
                onClick={() => setPreview(i)} onError={e => e.currentTarget.style.display = 'none'} />
            )}
            <input
              style={inp({ flex: 1 })}
              value={url}
              onChange={e => update(i, e.target.value)}
              onFocus={() => setPreview(i)}
              placeholder="https://..."
            />
            {images.length > 1 && (
              <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: AT.muted, fontSize: 18, lineHeight: 1, padding: '0 2px', flexShrink: 0 }}>×</button>
            )}
          </div>
        ))}
        <button onClick={add} style={{
          background: 'none', border: `1.5px dashed ${AT.border}`, borderRadius: AT.radius,
          color: AT.muted, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          padding: '7px', width: '100%', fontFamily: 'Manrope, sans-serif',
        }}>+ Добавить фото</button>
      </div>
    </div>
  );
}

// ── Product gallery (detail view) ────────────────────────────────

function ProductGallery({ product }) {
  const imgs = allImgs(product);
  const [selected, setSelected] = React.useState(0);
  React.useEffect(() => setSelected(0), [product?.id]);
  const main = imgs[selected] ?? null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        background: main ? '#F8F8F8' : AT.surfaceAlt,
        borderRadius: AT.radiusLg, border: `1px solid ${AT.border}`,
        aspectRatio: '1 / 1', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {main ? (
          <img src={main} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="10" y="8" width="28" height="34" rx="4" fill="#C8C8C8" />
            <rect x="16" y="16" width="16" height="10" rx="2" fill="white" opacity="0.7" />
            <circle cx="24" cy="33" r="4" fill="white" opacity="0.5" />
          </svg>
        )}
      </div>
      {imgs.length > 1 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {imgs.map((url, i) => (
            <div key={i} onClick={() => setSelected(i)} style={{
              width: 52, height: 52, borderRadius: 8, overflow: 'hidden',
              border: `2px solid ${i === selected ? AT.primary : AT.border}`,
              cursor: 'pointer', flexShrink: 0,
              opacity: i === selected ? 1 : 0.6,
              transition: 'border-color 0.15s, opacity 0.15s',
            }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Shared styles ────────────────────────────────────────────────

const EMPTY_FORM = {
  id: '', cat: '', brand_id: '', brand: '', name: '', vol: '',
  price: '', old: '', rating: '4.8', reviews: '0',
  hit: false, hue: [300, 50, 75], shape: 'bottle', active: true,
  description: '', ingredients: '', images: [''], stock: '0', sku: '',
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
      <div style={{ width: 120, flexShrink: 0, fontSize: 12, fontWeight: 700, color: AT.muted, letterSpacing: '0.03em' }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: 13, color: AT.ink, fontWeight: 500, flex: 1, wordBreak: 'break-word' }}>{value}</div>
    </div>
  );
}

// ── Product detail ───────────────────────────────────────────────

function ProductDetail({ product, cats, brands, onEdit, onBack, onToggleActive }) {
  const cat = cats.find(c => c.id === product.cat);
  const brand = brands.find(b => b.id === product.brand_id);
  const hue = product.hue ?? [300, 50, 75];
  const isMobile = useMobile();

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
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
        <h1 style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </h1>
        <StatusBadge active={product.active} />
      </div>

      {isMobile ? (
        /* ── Mobile layout ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Image gallery */}
          <ProductGallery product={product} />

          {/* Price + color row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 6 }}>ЦЕНА</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: AT.primary, letterSpacing: '-0.02em' }}>{product.price} с</div>
              {product.old && (
                <>
                  <div style={{ fontSize: 12, color: AT.muted, textDecoration: 'line-through' }}>{product.old} с</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: AT.success }}>−{Math.round((1 - product.price / product.old) * 100)}%</div>
                </>
              )}
            </div>
            <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 6 }}>ЦВЕТ HSL</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: `hsl(${hue[0]}, ${hue[1]}%, ${hue[2]}%)`, border: `1px solid ${AT.border}`, flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: AT.inkLight, fontFamily: 'monospace', lineHeight: 1.4 }}>
                  H{hue[0]}<br />S{hue[1]}% L{hue[2]}%
                </div>
              </div>
            </div>
          </div>

          {/* Main info */}
          <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: AT.ink, marginBottom: 2 }}>ОСНОВНОЕ</div>
            <InfoRow label="ID" value={product.id} />
            <InfoRow label="SKU" value={product.sku} />
            <InfoRow label="Бренд" value={brand?.name ?? product.brand} />
            <InfoRow label="Категория" value={cat ? `${cat.emoji} ${cat.ru}` : product.cat} />
            <InfoRow label="Объём" value={product.vol} />
            <InfoRow label="Форма" value={product.shape} />
            <InfoRow label="Склад" value={product.stock != null ? `${product.stock} шт` : null} />
            <InfoRow label="Рейтинг" value={product.rating ? `${product.rating} ★ (${product.reviews})` : null} />
            {product.hit && (
              <div style={{ marginTop: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: AT.primary, background: AT.primaryBg, padding: '3px 10px', borderRadius: 999 }}>ХИТ ПРОДАЖ</span>
              </div>
            )}
          </div>

          {/* Content */}
          {(product.description || product.ingredients) && (
            <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: AT.ink, marginBottom: 10 }}>КОНТЕНТ</div>
              {product.description && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 4 }}>ОПИСАНИЕ</div>
                  <div style={{ fontSize: 13, color: AT.inkLight, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{product.description}</div>
                </div>
              )}
              {product.ingredients && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 4 }}>СОСТАВ</div>
                  <div style={{ fontSize: 13, color: AT.inkLight, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{product.ingredients}</div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              onClick={onEdit}
              style={{ padding: '12px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
            >
              Редактировать
            </button>
            <button
              onClick={() => onToggleActive(product.id, product.active)}
              style={{ padding: '12px', background: 'transparent', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 14, fontWeight: 600, color: AT.inkLight, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
            >
              {product.active ? 'Скрыть' : 'Активировать'}
            </button>
          </div>
        </div>
      ) : (
        /* ── Desktop layout ── */
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ProductGallery product={product} />

            <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 10 }}>ЦВЕТ (HSL)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, background: `hsl(${hue[0]}, ${hue[1]}%, ${hue[2]}%)`, border: `1px solid ${AT.border}` }} />
                <div style={{ fontSize: 13, color: AT.inkLight, fontFamily: 'monospace' }}>H{hue[0]} S{hue[1]}% L{hue[2]}%</div>
              </div>
            </div>

            <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 10 }}>ЦЕНООБРАЗОВАНИЕ</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: AT.primary, letterSpacing: '-0.02em' }}>{product.price} с</div>
              {product.old && (
                <>
                  <div style={{ fontSize: 13, color: AT.muted, textDecoration: 'line-through', marginTop: 2 }}>{product.old} с</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: AT.success, marginTop: 4 }}>−{Math.round((1 - product.price / product.old) * 100)}% скидка</div>
                </>
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
                  <span style={{ fontSize: 12, fontWeight: 700, color: AT.primary, background: AT.primaryBg, padding: '3px 10px', borderRadius: 999 }}>ХИТ ПРОДАЖ</span>
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
              <button onClick={onEdit} style={{ padding: '10px 22px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
                Редактировать
              </button>
              <button onClick={() => onToggleActive(product.id, product.active)} style={{ padding: '10px 22px', background: 'transparent', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 14, fontWeight: 600, color: AT.inkLight, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
                {product.active ? 'Скрыть' : 'Активировать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Product form (edit / new) ────────────────────────────────────

function ProductForm({ form, setForm, cats, brands, saving, error, onSave, onCancel }) {
  const isMobile = useMobile();
  const discount = form.price && form.old ? Math.round((1 - Number(form.price) / Number(form.old)) * 100) : null;

  const MainFields = (
    <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: isMobile ? 14 : 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 14 }}>ОСНОВНОЕ</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Field label="ID">
          <input style={inp({ background: AT.surfaceAlt, color: AT.muted, cursor: 'not-allowed' })} value={form.id} readOnly />
        </Field>
        <Field label="Название" required>
          <input style={inp()} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Крем для лица" />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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
            <input style={inp()} value={form.vol} onChange={e => setForm(f => ({ ...f, vol: e.target.value }))} placeholder="50 мл" />
          </Field>
          <Field label="Форма">
            <select style={inp()} value={form.shape} onChange={e => setForm(f => ({ ...f, shape: e.target.value }))}>
              {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="На складе (шт)">
            <input style={inp()} type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
          </Field>
          <Field label="Артикул (SKU)">
            <input style={inp()} value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="SKU-001" />
          </Field>
          <Field label="Рейтинг">
            <input style={inp({ background: AT.surfaceAlt, color: AT.muted, cursor: 'not-allowed' })} value={form.rating} readOnly />
          </Field>
          <Field label="Отзывов">
            <input style={inp({ background: AT.surfaceAlt, color: AT.muted, cursor: 'not-allowed' })} value={form.reviews} readOnly />
          </Field>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4, flexWrap: 'wrap' }}>
          <Toggle value={form.hit} onChange={v => setForm(f => ({ ...f, hit: v }))} label="Хит продаж" />
          <Toggle value={form.active} onChange={v => setForm(f => ({ ...f, active: v }))} label="Активен" />
        </div>
      </div>
    </div>
  );

  const ContentFields = (
    <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: isMobile ? 14 : 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 14 }}>КОНТЕНТ</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Field label="Описание">
          <textarea style={inp({ minHeight: 90, resize: 'vertical' })} value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Описание товара..." />
        </Field>
        <Field label="Состав">
          <textarea style={inp({ minHeight: 90, resize: 'vertical' })} value={form.ingredients}
            onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))} placeholder="Aqua, Glycerin..." />
        </Field>
      </div>
    </div>
  );

  const PricingCard = (
    <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: isMobile ? 14 : 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 10 }}>ЦЕНООБРАЗОВАНИЕ</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Цена (с)" required>
          <input style={inp()} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="299" />
        </Field>
        <Field label="Старая цена (с)">
          <input style={inp()} type="number" value={form.old} onChange={e => setForm(f => ({ ...f, old: e.target.value }))} placeholder="499" />
        </Field>
      </div>
      {discount !== null && discount > 0 && (
        <div style={{ fontSize: 13, fontWeight: 700, color: AT.success, marginTop: 8 }}>−{discount}% скидка</div>
      )}
    </div>
  );

  const HslCard = (
    <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: isMobile ? 14 : 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.04em', marginBottom: 10 }}>ЦВЕТ (HSL)</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: `hsl(${form.hue[0]}, ${form.hue[1]}%, ${form.hue[2]}%)`, border: `1px solid ${AT.border}` }} />
        <div style={{ fontSize: 12, color: AT.inkLight, fontFamily: 'monospace' }}>H{form.hue[0]} S{form.hue[1]}% L{form.hue[2]}%</div>
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
  );

  if (error) {
    /* show error inside the form */
  }

  return (
    <div style={{ paddingBottom: isMobile ? 80 : 0 }}>
      {error && (
        <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {isMobile ? (
        /* ── Mobile: single column ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ImagesEditor images={form.images} onChange={imgs => setForm(f => ({ ...f, images: imgs }))} />
          {PricingCard}
          {MainFields}
          {ContentFields}
          {HslCard}
        </div>
      ) : (
        /* ── Desktop: 2-column ── */
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ImagesEditor images={form.images} onChange={imgs => setForm(f => ({ ...f, images: imgs }))} />
            {HslCard}
            {PricingCard}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {MainFields}
            {ContentFields}
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
      )}

      {/* Mobile sticky action bar */}
      {isMobile && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: AT.surface, borderTop: `1px solid ${AT.border}`,
          padding: '12px 16px', display: 'flex', gap: 10,
          zIndex: 100,
        }}>
          <button onClick={onSave} disabled={saving} style={{
            flex: 1, padding: '13px', background: AT.primary, color: '#fff',
            border: 'none', borderRadius: AT.radius, fontSize: 15, fontWeight: 700,
            fontFamily: 'Manrope, sans-serif', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
          }}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button onClick={onCancel} style={{
            padding: '13px 18px', background: 'transparent', color: AT.inkLight,
            border: `1.5px solid ${AT.border}`, borderRadius: AT.radius,
            fontSize: 15, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
          }}>
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}

// ── Products list card (mobile) ──────────────────────────────────

function ProductCard({ p, catName, onOpen, onToggle }) {
  const img = firstImg(p);
  return (
    <div
      onClick={() => onOpen(p)}
      style={{
        background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg,
        padding: '12px 14px', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center',
      }}
    >
      {img ? (
        <img src={img} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, border: `1px solid ${AT.border}`, flexShrink: 0 }} />
      ) : (
        <div style={{ width: 52, height: 52, borderRadius: 8, background: `hsl(${(p.hue ?? [300])[0]}, 40%, 88%)`, border: `1px solid ${AT.border}`, flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: AT.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
        <div style={{ fontSize: 12, color: AT.muted, marginTop: 1 }}>{p.brand} · {catName(p.cat)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: AT.ink }}>{p.price} с</span>
          {p.old && <span style={{ fontSize: 11, color: AT.muted, textDecoration: 'line-through' }}>{p.old} с</span>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        <StatusBadge active={p.active} />
        <button
          onClick={e => { e.stopPropagation(); onToggle(p.id, p.active); }}
          style={{ background: 'none', border: `1px solid ${AT.border}`, borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600, color: AT.inkLight, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
        >
          {p.active ? 'Скрыть' : 'Вкл'}
        </button>
      </div>
    </div>
  );
}

// ── Main Products page ───────────────────────────────────────────

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

  const isMobile = useMobile();

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

  function openDetail(p) { setSelectedProduct(p); setView('detail'); }

  function openEdit(p) {
    setForm({
      id: p.id, cat: p.cat ?? '', brand_id: p.brand_id ?? '', brand: p.brand ?? '',
      name: p.name ?? '', vol: p.vol ?? '',
      price: String(p.price ?? ''), old: String(p.old ?? ''),
      rating: String(p.rating ?? '4.8'), reviews: String(p.reviews ?? '0'),
      hit: !!p.hit, hue: p.hue ?? [300, 50, 75], shape: p.shape ?? 'bottle',
      active: p.active !== false,
      description: p.description ?? '', ingredients: p.ingredients ?? '',
      images: allImgs(p).length ? allImgs(p) : [''], stock: String(p.stock ?? '0'), sku: p.sku ?? '',
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
    setFormError('');

    const selectedBrand = brands.find(b => b.id === form.brand_id);
    const optimistic = {
      id: form.id, cat: form.cat,
      brand_id: form.brand_id || null,
      brand: selectedBrand ? selectedBrand.name : form.brand.trim(),
      name: form.name.trim(), vol: form.vol.trim(),
      price: Number(form.price), old: form.old ? Number(form.old) : null,
      rating: Number(form.rating), reviews: Number(form.reviews),
      hit: form.hit, hue: form.hue, shape: form.shape, active: form.active,
      description: form.description.trim() || null,
      ingredients: form.ingredients.trim() || null,
      images: form.images.filter(u => u.trim()).length ? form.images.filter(u => u.trim()) : null,
      stock: Number(form.stock), sku: form.sku.trim() || null,
    };

    setProducts(ps => ps.some(p => p.id === optimistic.id)
      ? ps.map(p => p.id === optimistic.id ? optimistic : p)
      : [...ps, optimistic]);
    setSelectedProduct(optimistic);
    setView('detail');

    setSaving(true);
    try {
      await upsertProduct(optimistic);
    } catch (e) {
      setFormError(e.message);
      setView('edit');
      await load();
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: isMobile ? 16 : 24, flexWrap: 'wrap' }}>
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
          <h1 style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedProduct ? `Редактировать: ${selectedProduct.name}` : 'Новый товар'}
          </h1>
        </div>
        <ProductForm
          form={form} setForm={setForm}
          cats={cats} brands={brands}
          saving={saving} error={formError}
          onSave={save}
          onCancel={() => selectedProduct ? setView('detail') : setView('list')}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 14 : 24, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
          Товары <span style={{ fontSize: 13, fontWeight: 600, color: AT.muted }}>({products.length})</span>
        </h1>
        <button
          onClick={openNew}
          style={{ padding: isMobile ? '8px 14px' : '9px 18px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
        >
          + Добавить
        </button>
      </div>

      {error && (
        <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, marginBottom: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <input style={inp({ flex: 1, minWidth: 0 })} placeholder="Поиск по названию / бренду"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select style={inp({ width: isMobile ? '100%' : 200 })} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">Все категории</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.ru}</option>)}
        </select>
      </div>

      {isMobile ? (
        /* Mobile: card list */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading ? (
            <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <ProductsTableSkeleton />
              </table>
            </div>
          ) : visible.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: AT.muted, fontSize: 14 }}>Нет товаров</div>
          ) : (
            visible.map(p => (
              <ProductCard key={p.id} p={p} catName={catName} onOpen={openDetail} onToggle={toggleActive} />
            ))
          )}
        </div>
      ) : (
        /* Desktop: table */
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
                      style={{ borderBottom: i < visible.length - 1 ? `1px solid ${AT.border}` : 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = AT.surfaceAlt}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 14px' }}>
                        {firstImg(p) ? (
                          <img src={firstImg(p)} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, border: `1px solid ${AT.border}` }} />
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
                      <td style={{ padding: '11px 14px', fontSize: 13, color: AT.inkLight, whiteSpace: 'nowrap' }}>{p.stock != null ? `${p.stock} шт` : '—'}</td>
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
      )}
    </div>
  );
}
