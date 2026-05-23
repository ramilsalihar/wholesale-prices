import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';

function useMobile() {
  const [mobile, setMobile] = React.useState(() => window.innerWidth < 700);
  React.useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 700);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}
import { fetchSettings, saveSettings, DEFAULT_SETTINGS } from '../../service/settings.js';
import { SettingsSkeleton } from '../ui/Skeleton.jsx';

const THEMES = [
  { key: 'magnit',   label: 'А · Магнит',   bg: '#E6097A', ink: '#FFFFFF', desc: 'Белый фон, розовый хедер' },
  { key: 'noir',     label: 'B · Чёрный',   bg: '#0A0A0A', ink: '#FFFFFF', desc: 'Тёмный фон, неоновые карточки' },
  { key: 'boutique', label: 'C · Светлый',  bg: '#FAF7F4', ink: '#1A0A14', desc: 'Тёплый белый, тёмные ценники' },
];

const inp = (extra = {}) => ({
  padding: '8px 12px', border: `1.5px solid ${AT.border}`, borderRadius: AT.radius,
  fontSize: 14, fontFamily: 'Manrope, sans-serif', color: AT.ink,
  background: AT.surface, outline: 'none', width: '100%', boxSizing: 'border-box', ...extra,
});

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: AT.inkLight, letterSpacing: '0.04em' }}>
        {label.toUpperCase()}
      </label>
      {children}
      {hint && <div style={{ fontSize: 11, color: AT.muted }}>{hint}</div>}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 18, letterSpacing: '0.02em' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

export function Settings() {
  const isMobile = useMobile();
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings()
      .then(s => { setForm(s); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await saveSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>Настройки</h1>
        </div>
        <SettingsSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 16 : 24, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: AT.ink, margin: 0, letterSpacing: '-0.02em' }}>
          Настройки
        </h1>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {saved && <span style={{ fontSize: 13, fontWeight: 700, color: AT.success }}>✓ Сохранено</span>}
            <button onClick={handleSave} disabled={saving} style={{ padding: '9px 22px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: AT.dangerBg, border: `1px solid rgba(222,53,11,0.2)`, color: AT.danger, borderRadius: AT.radius, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,2fr) minmax(0,1fr)', gap: isMobile ? 14 : 20, alignItems: 'start', paddingBottom: isMobile ? 80 : 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <Card title="МАГАЗИН">
            <Field label="Название магазина">
              <input style={inp()} value={form.store_name} onChange={e => set('store_name', e.target.value)} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Телефон" hint="Отображается в шапке">
                <input style={inp()} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="8 (312) 123-45-67" />
              </Field>
              <Field label="Instagram" hint="Без @">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ padding: '8px 10px', background: AT.surfaceAlt, border: `1.5px solid ${AT.border}`, borderRight: 'none', borderRadius: `${AT.radius}px 0 0 ${AT.radius}px`, fontSize: 14, color: AT.muted, whiteSpace: 'nowrap' }}>@</span>
                  <input style={{ ...inp(), borderRadius: `0 ${AT.radius}px ${AT.radius}px 0` }} value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="optovye_ceny01_" />
                </div>
              </Field>
            </div>
          </Card>

          <Card title="ДОСТАВКА">
            <Field label="Бесплатная доставка от (с)" hint="Заказы выше этой суммы доставляются бесплатно по Бишкеку">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input style={inp({ maxWidth: 160 })} type="number" min="0" value={form.free_delivery_threshold} onChange={e => set('free_delivery_threshold', Number(e.target.value))} />
                <span style={{ fontSize: 13, color: AT.muted }}>с</span>
              </div>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 12 }}>
              <Field label="Бишкек (с)" hint="Стоимость курьера">
                <input style={inp()} type="number" min="0" value={form.delivery_bishkek} onChange={e => set('delivery_bishkek', Number(e.target.value))} />
              </Field>
              <Field label="Ош / Жалал-Абад (с)">
                <input style={inp()} type="number" min="0" value={form.delivery_osh} onChange={e => set('delivery_osh', Number(e.target.value))} />
              </Field>
              <Field label="Регионы КР (с)">
                <input style={inp()} type="number" min="0" value={form.delivery_regions} onChange={e => set('delivery_regions', Number(e.target.value))} />
              </Field>
            </div>
          </Card>
        </div>

        <div>
          <Card title="ТЕМА ВИТРИНЫ">
            <div style={{ fontSize: 12, color: AT.muted, marginTop: -8, marginBottom: 4 }}>
              Тема по умолчанию при первом открытии
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {THEMES.map(th => {
                const active = form.default_theme === th.key;
                return (
                  <button
                    key={th.key}
                    type="button"
                    onClick={() => set('default_theme', th.key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', borderRadius: AT.radius, cursor: 'pointer',
                      border: `1.5px solid ${active ? AT.primary : AT.border}`,
                      background: active ? AT.primaryBg : AT.surfaceAlt,
                      fontFamily: 'Manrope, sans-serif', textAlign: 'left', width: '100%',
                    }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: th.bg, flexShrink: 0, border: `1px solid ${AT.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 16, height: 10, borderRadius: 2, background: th.ink === '#FFFFFF' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: active ? AT.primary : AT.ink }}>{th.label}</div>
                      <div style={{ fontSize: 11, color: AT.muted, marginTop: 1 }}>{th.desc}</div>
                    </div>
                    {active && (
                      <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: AT.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {isMobile && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: AT.surface, borderTop: `1px solid ${AT.border}`,
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 100,
        }}>
          {saved && <span style={{ fontSize: 13, fontWeight: 700, color: AT.success }}>✓ Сохранено</span>}
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '13px', background: AT.primary, color: '#fff', border: 'none', borderRadius: AT.radius, fontSize: 15, fontWeight: 700, fontFamily: 'Manrope, sans-serif', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      )}
    </div>
  );
}
