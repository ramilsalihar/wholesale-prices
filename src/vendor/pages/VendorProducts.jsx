import React, { useState, useEffect } from 'react';
import { VT } from '../vendorTheme.js';
import { upsertVendorProduct, deleteVendorProduct, toggleVendorProductActive } from '../../service/vendorProducts.js';
import { fetchCategories } from '../../service/categories.js';
import { supabase } from '../../service/supabase.js';

const inpStyle = (extra = {}) => ({
  display: 'block',
  width: '100%',
  padding: '10px 14px',
  border: `1.5px solid ${VT.border}`,
  borderRadius: VT.radius,
  fontSize: 14,
  fontFamily: 'Manrope, sans-serif',
  color: VT.ink,
  background: VT.surface,
  outline: 'none',
  marginTop: 4,
  boxSizing: 'border-box',
  ...extra,
});

const DEFAULT_FLOWER_CATEGORIES = [
  { id: 'bouquets', ru: 'Букеты цветов' },
  { id: 'roses', ru: 'Розы' },
  { id: 'peonies', ru: 'Пионы' },
  { id: 'boxes', ru: 'Цветы в коробках и корзинах' },
  { id: 'gifts', ru: 'Подарки и открытки' },
];

export function VendorProducts({ vendor, products, setProducts, initialModalOpen = false, onCloseInitialModal }) {
  const [categories, setCategories] = useState(DEFAULT_FLOWER_CATEGORIES);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'draft'

  // Modal state
  const [modalOpen, setModalOpen] = useState(initialModalOpen);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [formName, setFormName] = useState('');
  const [formCat, setFormCat] = useState('bouquets');
  const [formPrice, setFormPrice] = useState('');
  const [formOldPrice, setFormOldPrice] = useState('');
  const [formVol, setFormVol] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formSku, setFormSku] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formHit, setFormHit] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then(cats => {
        if (cats && cats.length > 0) setCategories(cats);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialModalOpen) {
      openAddModal();
      if (onCloseInitialModal) onCloseInitialModal();
    }
  }, [initialModalOpen]);

  function openAddModal() {
    setEditingProduct(null);
    setFormName('');
    setFormCat(categories[0]?.id || 'bouquets');
    setFormPrice('');
    setFormOldPrice('');
    setFormVol('');
    setFormDesc('');
    setFormImageUrl('');
    setImageFile(null);
    setImagePreviewError(false);
    setFormSku(`FLW-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormActive(true);
    setFormHit(false);
    setError('');
    setModalOpen(true);
  }

  function openEditModal(prod) {
    setEditingProduct(prod);
    setFormName(prod.name || '');
    setFormCat(prod.cat || categories[0]?.id || 'bouquets');
    setFormPrice(String(prod.price || ''));
    setFormOldPrice(prod.old ? String(prod.old) : '');
    setFormVol(prod.vol || '');
    setFormDesc(prod.description || '');
    setFormImageUrl(prod.image_url || (Array.isArray(prod.images) ? prod.images[0] : '') || '');
    setImageFile(null);
    setImagePreviewError(false);
    setFormSku(prod.sku || '');
    setFormActive(prod.active !== false);
    setFormHit(Boolean(prod.hit));
    setError('');
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!formName.trim()) {
      setError('Укажите название букета / композиции');
      return;
    }
    const priceNum = parseInt(formPrice, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Укажите корректную стоимость букета');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      ...(editingProduct || {}),
      name: formName.trim(),
      cat: formCat,
      price: priceNum,
      old: formOldPrice ? parseInt(formOldPrice, 10) : null,
      vol: formVol.trim(),
      description: formDesc.trim(),
      image_url: formImageUrl.trim(),
      images: formImageUrl.trim() ? [formImageUrl.trim()] : [],
      sku: formSku.trim(),
      active: formActive,
      hit: formHit,
    };

    try {
      let targetVendorId = vendor?.id;
      if (!targetVendorId) {
        const { data: { user } } = await supabase.auth.getUser();
        targetVendorId = user?.id;
      }
      if (!targetVendorId) throw new Error('Не удалось определить ID продавца');

      if (imageFile) {
        const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `${targetVendorId}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(path, imageFile, { upsert: false, contentType: imageFile.type });
        if (uploadError) throw new Error(`Не удалось загрузить фото: ${uploadError.message}. Проверьте, что в Supabase Storage создан bucket product-images и разрешена загрузка для вендоров.`);
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        payload.image_url = data.publicUrl;
        payload.images = [data.publicUrl];
      }
      const saved = await upsertVendorProduct(payload, targetVendorId);
      setProducts(prev => {
        if (editingProduct) {
          return prev.map(p => (p.id === saved.id ? saved : p));
        }
        return [saved, ...prev];
      });
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Ошибка сохранения товара.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(prod) {
    const nextActive = prod.active === false ? true : false;
    try {
      let targetVendorId = vendor?.id;
      if (!targetVendorId) {
        const { data: { user } } = await supabase.auth.getUser();
        targetVendorId = user?.id;
      }
      await toggleVendorProductActive(prod.id, nextActive, targetVendorId);
      setProducts(prev => prev.map(p => (p.id === prod.id ? { ...p, active: nextActive } : p)));
    } catch (err) {
      alert('Не удалось изменить статус товара: ' + err.message);
    }
  }

  async function handleDelete(id) {
    try {
      let targetVendorId = vendor?.id;
      if (!targetVendorId) {
        const { data: { user } } = await supabase.auth.getUser();
        targetVendorId = user?.id;
      }
      await deleteVendorProduct(id, targetVendorId);
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      alert('Не удалось удалить товар: ' + err.message);
    }
  }

  const filtered = products.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    if (filterCat && p.cat !== filterCat) return false;
    if (filterStatus === 'active' && p.active === false) return false;
    if (filterStatus === 'draft' && p.active !== false) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Header & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: VT.ink, letterSpacing: '-0.02em' }}>
            Букеты и витрина магазина
          </h1>
          <div style={{ fontSize: 13, color: VT.muted, marginTop: 4 }}>
            Управление позициями, ценами и публикацией на маркетплейсе доставки
          </div>
        </div>

        <button
          onClick={openAddModal}
          style={{
            background: VT.primary,
            color: '#fff',
            border: 'none',
            borderRadius: VT.radius,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 8px rgba(230,9,122,0.25)',
          }}
        >
          <span style={{ fontSize: 18 }}>+</span> Добавить букет
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{
        background: VT.surface,
        border: `1px solid ${VT.border}`,
        borderRadius: VT.radiusLg,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        boxShadow: VT.shadowSm,
      }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по названию или артикулу..."
            style={inpStyle({ margin: 0 })}
          />
        </div>

        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          style={inpStyle({ width: 'auto', minWidth: 160, margin: 0 })}
        >
          <option value="">Все категории</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.ru || c.id}</option>
          ))}
        </select>

        <div style={{
          display: 'flex',
          background: VT.surfaceAlt,
          borderRadius: VT.radius,
          padding: 3,
          gap: 4,
        }}>
          {[
            { id: 'all', label: `Все (${products.length})` },
            { id: 'active', label: `На витрине (${products.filter(p => p.active !== false).length})` },
            { id: 'draft', label: `Скрытые (${products.filter(p => p.active === false).length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              style={{
                border: 'none',
                background: filterStatus === tab.id ? VT.surface : 'transparent',
                color: filterStatus === tab.id ? VT.ink : VT.muted,
                padding: '6px 12px',
                borderRadius: VT.radius - 2,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: filterStatus === tab.id ? VT.shadowSm : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      {filtered.length === 0 ? (
        <div style={{
          background: VT.surface,
          border: `1px dashed ${VT.border}`,
          borderRadius: VT.radiusLg,
          padding: '60px 24px',
          textAlign: 'center',
          color: VT.muted,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💐</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: VT.ink, marginBottom: 6 }}>
            {products.length === 0 ? 'На витрине пока нет букетов' : 'Букеты по вашему запросу не найдены'}
          </div>
          <div style={{ fontSize: 13, maxWidth: 400, margin: '0 auto 18px' }}>
            {products.length === 0
              ? 'Добавьте первую композицию, указав состав цветов, стоимость и прикрепив красивую фотографию.'
              : 'Попробуйте изменить поисковый запрос или сбросить фильтры.'}
          </div>
          {products.length === 0 && (
            <button
              onClick={openAddModal}
              style={{
                background: VT.primary,
                color: '#fff',
                border: 'none',
                borderRadius: VT.radius,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              + Добавить первый букет
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {filtered.map(p => {
            const img = p.image_url || (Array.isArray(p.images) ? p.images[0] : null);
            const isPub = p.active !== false;
            return (
              <div
                key={p.id}
                style={{
                  background: VT.surface,
                  border: `1px solid ${VT.border}`,
                  borderRadius: VT.radiusLg,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: VT.shadowSm,
                  transition: 'box-shadow 0.15s, transform 0.15s',
                }}
              >
                {/* Photo Header */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  background: '#F0F0F0',
                  overflow: 'hidden',
                }}>
                  {img ? (
                    <img
                      src={img}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 48,
                      color: VT.muted,
                    }}>
                      🌸
                    </div>
                  )}

                  {/* Status Badges */}
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    display: 'flex',
                    gap: 6,
                  }}>
                    <span style={{
                      background: isPub ? 'rgba(0,135,90,0.92)' : 'rgba(23,43,77,0.85)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 4,
                      letterSpacing: '0.04em',
                      backdropFilter: 'blur(4px)',
                    }}>
                      {isPub ? 'НА ВИТРИНЕ' : 'СКРЫТ'}
                    </span>
                    {p.hit && (
                      <span style={{
                        background: 'rgba(230,9,122,0.92)',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 4,
                      }}>
                        ★ ХИТ
                      </span>
                    )}
                  </div>

                  {p.old && p.old > p.price && (
                    <div style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      background: '#DE350B',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 4,
                    }}>
                      −{Math.round(((p.old - p.price) / p.old) * 100)}%
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div style={{ padding: '16px 16px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: VT.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {categories.find(c => c.id === p.cat)?.ru || p.cat || 'Букеты'}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: VT.ink, marginTop: 4, lineHeight: 1.3 }}>
                    {p.name}
                  </div>
                  {p.vol && (
                    <div style={{ fontSize: 12, color: VT.inkLight, marginTop: 4, fontStyle: 'italic' }}>
                      {p.vol}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', paddingTop: 14, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: VT.primaryDark }}>
                      {Number(p.price).toLocaleString('ru-RU')} с
                    </span>
                    {p.old && (
                      <span style={{ fontSize: 13, color: VT.muted, textDecoration: 'line-through' }}>
                        {Number(p.old).toLocaleString('ru-RU')} с
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div style={{
                  padding: '10px 14px',
                  borderTop: `1px solid ${VT.border}`,
                  background: VT.surfaceAlt,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}>
                  <button
                    onClick={() => handleToggleActive(p)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: isPub ? VT.muted : VT.success,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer',
                      padding: '4px 6px',
                    }}
                  >
                    {isPub ? 'Снять с витрины' : 'Опубликовать'}
                  </button>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => openEditModal(p)}
                      style={{
                        background: VT.surface,
                        border: `1px solid ${VT.border}`,
                        color: VT.ink,
                        fontWeight: 700,
                        fontSize: 12,
                        padding: '5px 10px',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${VT.border}`,
                        color: VT.danger,
                        fontWeight: 700,
                        fontSize: 12,
                        padding: '5px 8px',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          backdropFilter: 'blur(3px)',
        }}>
          <div style={{
            background: VT.surface,
            borderRadius: VT.radiusLg,
            border: `1px solid ${VT.border}`,
            width: '100%',
            maxWidth: 580,
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px 30px',
            boxShadow: VT.shadowLg,
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: VT.ink }}>
                {editingProduct ? 'Редактирование букета' : 'Новый букет в ваш магазин'}
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  color: VT.muted,
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {error && (
              <div style={{
                background: VT.dangerBg,
                color: VT.danger,
                border: `1px solid rgba(222,53,11,0.2)`,
                borderRadius: VT.radius,
                padding: '10px 14px',
                fontSize: 13,
                marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                  Название букета / композиции *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Букет «Розовые облака» из 25 пионов"
                  required
                  style={inpStyle()}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                    Категория *
                  </label>
                  <select
                    value={formCat}
                    onChange={e => setFormCat(e.target.value)}
                    style={inpStyle()}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.ru || c.id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                    Артикул / SKU
                  </label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={e => setFormSku(e.target.value)}
                    placeholder="FLW-1042"
                    style={inpStyle()}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                    Цена (сом) *
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    placeholder="2500"
                    required
                    style={inpStyle()}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                    Старая цена (для скидки)
                  </label>
                  <input
                    type="number"
                    value={formOldPrice}
                    onChange={e => setFormOldPrice(e.target.value)}
                    placeholder="3200"
                    style={inpStyle()}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                  Состав цветов / Объем / Размер
                </label>
                <input
                  type="text"
                  value={formVol}
                  onChange={e => setFormVol(e.target.value)}
                  placeholder="25 пионов Сара Бернар, эвкалипт, атласная лента"
                  style={inpStyle()}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                  Фото букета — загрузить файл или указать ссылку
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    setImagePreviewError(false);
                    if (file) setFormImageUrl(URL.createObjectURL(file));
                  }}
                  style={inpStyle()}
                />
                <div style={{ fontSize: 12, color: VT.muted, marginTop: 4 }}>JPG, PNG или WebP, до 8 МБ</div>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={e => { setFormImageUrl(e.target.value); setImageFile(null); setImagePreviewError(false); }}
                  placeholder="Прямая ссылка на файл .jpg, .png или .webp"
                  style={inpStyle()}
                />
                {formImageUrl && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {!imagePreviewError ? (
                      <div style={{ width: 48, height: 48, borderRadius: 6, overflow: 'hidden', border: `1px solid ${VT.border}`, background: '#f5f5f5' }}>
                        <img src={formImageUrl} alt="Предпросмотр букета" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImagePreviewError(true)} />
                      </div>
                    ) : null}
                    <span style={{ fontSize: 12, color: imagePreviewError ? '#b42318' : VT.muted }}>
                      {imagePreviewError ? 'Изображение недоступно. Нужна прямая публичная ссылка на файл, а не страница просмотра.' : 'Предпросмотр фото'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                  Подробное описание композиции
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Свежие цветы прямо из голландских теплиц. К каждому букету прилагается подкормка Chrysal и памятка по уходу."
                  style={{ ...inpStyle(), resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 20, paddingTop: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={e => setFormActive(e.target.checked)}
                  />
                  Опубликован на витрине Flowo
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formHit}
                    onChange={e => setFormHit(e.target.checked)}
                  />
                  Хит продаж / Рекомендуемый
                </label>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: saving ? VT.muted : VT.primary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: VT.radius,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? 'Сохраняем...' : (editingProduct ? 'Сохранить изменения' : 'Создать букет')}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '12px 20px',
                    background: VT.surfaceAlt,
                    color: VT.ink,
                    border: `1px solid ${VT.border}`,
                    borderRadius: VT.radius,
                    fontSize: 14,
                    fontWeight: 600,
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

      {/* Delete Confirmation Modal */}
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
            background: VT.surface,
            borderRadius: VT.radiusLg,
            padding: '24px 28px',
            maxWidth: 400,
            width: '100%',
            textAlign: 'center',
            boxShadow: VT.shadowLg,
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: VT.ink, marginBottom: 8 }}>
              Удалить букет?
            </div>
            <div style={{ fontSize: 13, color: VT.muted, marginBottom: 20 }}>
              Это действие необратимо. Товар будет полностью удален из каталога вашего магазина.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: VT.danger,
                  color: '#fff',
                  border: 'none',
                  borderRadius: VT.radius,
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
                  background: VT.surfaceAlt,
                  color: VT.ink,
                  border: `1px solid ${VT.border}`,
                  borderRadius: VT.radius,
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
