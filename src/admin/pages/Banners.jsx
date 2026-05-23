import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchAllBanners, upsertBanner, deleteBanner, toggleBannerActive } from '../../service/banners.js';
import { BannersSkeleton } from '../ui/Skeleton.jsx';

const ACCENT_OPTIONS = [
  { value: 'primary', label: 'Розовый (primary)' },
  { value: 'accent',  label: 'Жёлтый (accent)'  },
  { value: 'orange',  label: 'Оранжевый (orange)' },
];

const ACCENT_PALETTES = {
  primary: { bg: '#E6097A', ink: '#FFFFFF', btn: '#F4D423', btnInk: '#1A0A14' },
  accent:  { bg: '#F4D423', ink: '#1A0A14', btn: '#E6097A', btnInk: '#FFFFFF' },
  orange:  { bg: '#F89020', ink: '#FFFFFF', btn: '#F4D423', btnInk: '#1A0A14' },
};

const EMPTY_FORM = { id: '', kicker: '', title: '', sub: '', cta: '', accent: 'primary', active: true };

const inp = (extra = {}) => ({
  padding: '8px 12px', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius,
  fontSize: 14, fontFamily: 'Manrope, sans-serif', color: AT.ink,
  background: AT.surface, outline: 'none', width: '100%', boxSizing: 'border-box', ...extra,
});

function useMobile() {
  const [mobile, setMobile] = React.useState(() => window.innerWidth < 700);
  React.useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 700);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

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

function BannerPreview({ b, height = 160 }) {
  const palette = ACCENT_PALETTES[b.accent || 'primary'];
  return (
    <div style={{
      height, borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden',
      background: palette.bg, color: palette.ink,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontFamily: 'Manrope, sans-serif',
    }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85 }}>
          {b.kicker || 'Кикер'}
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, marginTop: 6, letterSpacing: '-0.01em', lineHeight: 1.15, maxWidth: '70%' }}>
          {b.title || 'Заголовок баннера'}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>{b.sub || 'Подзаголовок'}</div>
        <div style={{ padding: '6px 12px', borderRadius: 999, background: palette.btn, color: palette.btnInk, fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>
          {b.cta || 'Действие'} →
        </div>
      </div>
      <svg style={{ position: 'absolute', right: -30, top: -30, opacity: 0.2 }} width="180" height="180" viewBox="0 0 100 100">
        <path fill={palette.btn} d="M50 0 Q70 20 100 30 Q90 60 100 100 Q60 90 30 100 Q40 60 0 50 Q30 40 50 0 Z" />
      </svg>
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

export function Banners() {
  const isMobile = useMobile();
  const [banners, setBanners] = useState([]);
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
      setBanners(await fetchAllBanners());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditId(null);
    setForm({ ...EMPTY_FORM, id: `b${Date.now().toString(36)}` });
    setFormError('');
    setView('edit');
  }

  function openEdit(b) {
    setEditId(b.id);
    setForm({ id: b.id, kicker: b.kicker ?? '', title: b.title ?? '', sub: b.sub ?? '', cta: b.cta ?? '', accent: b.accent ?? 'primary', active: b.active !== false });
    setFormError('');
    setView('edit');
  }

  async function save() {
    if (!form.title.trim()) { setFormError('Заголовок обязателен'); return; }
    setSaving(true);
    setFormError('');
    try {
      await upsertBanner({ id: form.id, kicker: form.kicker.trim(), title: form.title.trim(), sub: form.sub.trim(), cta: form.cta.trim(), accent: form.accent, active: form.active });
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
      await deleteBanner(id);
      setConfirmDelete(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleActive(id, current) {
    try {
      await toggleBannerActive(id, !current);
      setBanners(bs => bs.map(b => b.id === id ? { ...b, active: !current } : b));
    } catch (e) {
      setError(e.message);
    }
  }

  // ── Edit view ──────────────────────────────────────────────────

  if (view === 'edit') {
    return (
      <div style={{ paddingBottom: isMobile ? 80 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: isMobile ? 16 : 24 }}>
          <button
            onClick={() => setView('list')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, padding: '7px 14px', fontSize: 13, fontWeight: 600, color: AT.inkLight, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
          >
            ← Назад
          </button>
          <h1 style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
            {editId ? 'Редактировать баннер' : 'Новый баннер'}
          </h1>
        </div>

        {formError && (
          <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, marginBottom: 14 }}>
            {formError}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) minmax(0,1fr)', gap: isMobile ? 12 : 24, alignItems: 'start' }}>

          {/* Left: form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 14 }}>

            {/* Live preview on mobile — above the form for instant feedback */}
            {isMobile && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.06em', marginBottom: 8 }}>ПРЕДПРОСМОТР</div>
                <BannerPreview b={form} height={150} />
              </div>
            )}

            <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: isMobile ? 14 : 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 2 }}>СОДЕРЖАНИЕ</div>
              <Field label="ID">
                <input style={inp()} value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!editId} />
              </Field>
              <Field label="Кикер (малый текст сверху)">
                <input style={inp()} value={form.kicker} onChange={e => setForm(f => ({ ...f, kicker: e.target.value }))} placeholder="Скидка дня" />
              </Field>
              <Field label="Заголовок" required>
                <input style={inp()} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="−40% на всю декоративку" />
              </Field>
              <Field label="Подзаголовок">
                <input style={inp()} value={form.sub} onChange={e => setForm(f => ({ ...f, sub: e.target.value }))} placeholder="Maybelline · Loreal · Essence" />
              </Field>
              <Field label="Кнопка (CTA)">
                <input style={inp()} value={form.cta} onChange={e => setForm(f => ({ ...f, cta: e.target.value }))} placeholder="Забрать" />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr', gap: 10 }}>
                <Field label="Цветовая схема">
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {ACCENT_OPTIONS.map(o => {
                      const pal = ACCENT_PALETTES[o.value];
                      const active = form.accent === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, accent: o.value }))}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            padding: '7px 12px', borderRadius: AT.radius, cursor: 'pointer',
                            border: `1.5px solid ${active ? AT.primary : AT.border}`,
                            background: active ? AT.primaryBg : AT.surfaceAlt,
                            fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 700,
                            color: active ? AT.primary : AT.inkLight,
                            flex: isMobile ? '1 1 auto' : undefined,
                          }}
                        >
                          <span style={{ width: 14, height: 14, borderRadius: '50%', background: pal.bg, border: `1px solid ${AT.border}`, flexShrink: 0 }} />
                          {o.label.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>

              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                  border: `1.5px solid ${form.active ? AT.primary : AT.border}`,
                  borderRadius: AT.radius, background: form.active ? AT.primaryBg : 'transparent',
                  color: form.active ? AT.primary : AT.inkLight,
                  fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start',
                }}
              >
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: form.active ? AT.primary : AT.border, flexShrink: 0 }} />
                Активен
              </button>

              {!isMobile && (
                <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                  <button onClick={save} disabled={saving} style={{ padding: '10px 22px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button onClick={() => setView('list')} style={{ padding: '10px 22px', background: 'transparent', color: AT.inkLight, border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 14, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
                    Отмена
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: live preview (desktop only) */}
          {!isMobile && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: AT.muted, letterSpacing: '0.06em', marginBottom: 10 }}>ПРЕДПРОСМОТР</div>
              <BannerPreview b={form} height={200} />
              <div style={{ marginTop: 12, background: AT.surfaceAlt, borderRadius: AT.radius, padding: '10px 14px', fontSize: 12, color: AT.muted }}>
                Предпросмотр обновляется в реальном времени по мере ввода.
              </div>
            </div>
          )}
        </div>

        {/* Mobile sticky save bar */}
        {isMobile && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: AT.surface, borderTop: `1px solid ${AT.border}`, padding: '12px 16px', display: 'flex', gap: 10, zIndex: 100 }}>
            <button onClick={save} disabled={saving} style={{ flex: 1, padding: '13px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 15, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button onClick={() => setView('list')} style={{ padding: '13px 18px', background: 'transparent', color: AT.inkLight, border: `1.5px solid ${AT.border}`, borderRadius: AT.radius, fontSize: 15, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
              Отмена
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 14 : 24, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
          Баннеры <span style={{ fontSize: 13, fontWeight: 600, color: AT.muted }}>({banners.length})</span>
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

      {loading ? (
        <BannersSkeleton count={3} />
      ) : banners.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: AT.muted, fontSize: 14, background: AT.surface, borderRadius: AT.radiusLg, border: `1px solid ${AT.border}` }}>
          Нет баннеров
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 16 }}>
          {banners.map(b => (
            <div key={b.id} style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
              {isMobile ? (
                /* Mobile: stacked card */
                <div>
                  <div style={{ padding: '12px 12px 0' }}>
                    <BannerPreview b={b} height={120} />
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: AT.muted, fontFamily: 'monospace' }}>{b.id}</span>
                      <button onClick={() => toggleActive(b.id, b.active)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <StatusBadge active={b.active} />
                      </button>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: AT.ink, marginBottom: 2 }}>{b.title}</div>
                    {b.sub && <div style={{ fontSize: 12, color: AT.muted }}>{b.sub}</div>}
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button
                        onClick={() => openEdit(b)}
                        style={{ flex: 1, padding: '9px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 13, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
                      >
                        Изменить
                      </button>
                      {confirmDelete === b.id ? (
                        <button onClick={() => handleDelete(b.id)} style={{ flex: 1, padding: '9px', background: AT.danger, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 13, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
                          Удалить?
                        </button>
                      ) : (
                        <button onClick={() => setConfirmDelete(b.id)} style={{ flex: 1, padding: '9px', background: AT.dangerBg, color: AT.danger, border: 'none', borderRadius: AT.radius, fontSize: 13, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Desktop: side-by-side */
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 0 }}>
                  <div style={{ padding: 16 }}>
                    <BannerPreview b={b} height={140} />
                  </div>
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: `1px solid ${AT.border}` }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: AT.muted, fontFamily: 'monospace' }}>{b.id}</span>
                        <button onClick={() => toggleActive(b.id, b.active)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          <StatusBadge active={b.active} />
                        </button>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: AT.ink, marginBottom: 4 }}>{b.title}</div>
                      <div style={{ fontSize: 13, color: AT.muted, marginBottom: 2 }}>{b.kicker}</div>
                      <div style={{ fontSize: 13, color: AT.inkLight }}>{b.sub}</div>
                      <div style={{ marginTop: 8 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                          background: ACCENT_PALETTES[b.accent || 'primary'].bg,
                          color: ACCENT_PALETTES[b.accent || 'primary'].ink,
                        }}>
                          {ACCENT_OPTIONS.find(o => o.value === b.accent)?.label ?? b.accent}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                      <button onClick={() => openEdit(b)} style={{ padding: '7px 16px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 13, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
                        Изменить
                      </button>
                      {confirmDelete === b.id ? (
                        <button onClick={() => handleDelete(b.id)} style={{ padding: '7px 16px', background: AT.danger, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 13, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
                          Удалить?
                        </button>
                      ) : (
                        <button onClick={() => setConfirmDelete(b.id)} style={{ padding: '7px 16px', background: AT.dangerBg, color: AT.danger, border: 'none', borderRadius: AT.radius, fontSize: 13, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}>
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
