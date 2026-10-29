import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { fetchSettings, saveSettings, DEFAULT_SETTINGS } from '../../service/settings.js';

const inp = (extra = {}) => ({
  padding: '9px 12px',
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

function Card({ title, subtitle, children }) {
  return (
    <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: AT.ink, letterSpacing: '-0.01em' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: AT.muted, marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

export function Settings() {
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings()
      .then(s => {
        setForm(s || DEFAULT_SETTINGS);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await saveSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Ошибка сохранения настроек');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: AT.muted, fontSize: 14 }}>
        Загрузка настроек платформы...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: AT.ink, letterSpacing: '-0.02em' }}>
            Настройки маркетплейса Flowo
          </h1>
          <div style={{ fontSize: 13, color: AT.muted, marginTop: 4 }}>
            Глобальные параметры цветочной площадки: тарифы доставки, условия для магазинов-вендоров, контакты поддержки
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {saved && (
            <span style={{ fontSize: 13, fontWeight: 700, color: AT.success, display: 'flex', alignItems: 'center', gap: 4 }}>
              ✓ Успешно сохранено
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '9px 24px',
              background: saving ? AT.muted : AT.primary,
              color: '#fff',
              border: 'none',
              borderRadius: AT.radius,
              fontSize: 14,
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: AT.dangerBg,
          border: `1px solid rgba(222,53,11,0.2)`,
          color: AT.danger,
          borderRadius: AT.radius,
          padding: '12px 16px',
          fontSize: 13,
        }}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Marketplace Identity */}
          <Card title="ОСНОВНАЯ ИНФОРМАЦИЯ ПЛАТФОРМЫ" subtitle="Брендинг и слоган, отображаемые на главной странице Flowo">
            <Field label="Название маркетплейса">
              <input
                style={inp()}
                value={form.platform_name || ''}
                onChange={e => set('platform_name', e.target.value)}
                placeholder="Flowo — Маркетплейс цветов"
              />
            </Field>

            <Field label="Слоган сервиса" hint="Короткое описание на главной странице витрины">
              <input
                style={inp()}
                value={form.tagline || ''}
                onChange={e => set('tagline', e.target.value)}
                placeholder="Свежие цветы и букеты с доставкой за 60 минут"
              />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Основной город" hint="Город по умолчанию при входе">
                <input
                  style={inp()}
                  value={form.default_city || 'Бишкек'}
                  onChange={e => set('default_city', e.target.value)}
                />
              </Field>

              <Field label="Instagram" hint="Официальный аккаунт маркетплейса">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    padding: '9px 10px',
                    background: AT.surfaceAlt,
                    border: `1.5px solid ${AT.border}`,
                    borderRight: 'none',
                    borderRadius: `${AT.radius}px 0 0 ${AT.radius}px`,
                    fontSize: 14,
                    color: AT.muted,
                  }}>@</span>
                  <input
                    style={{ ...inp(), borderRadius: `0 ${AT.radius}px ${AT.radius}px 0` }}
                    value={form.instagram || ''}
                    onChange={e => set('instagram', e.target.value)}
                    placeholder="flowo_kg"
                  />
                </div>
              </Field>
            </div>
          </Card>

          {/* Delivery Pricing */}
          <Card title="ТАРИФЫ ДОСТАВКИ ЦВЕТОВ" subtitle="Условия расчета курьерской доставки для покупателей">
            <Field label="Бесплатная доставка от (сом)" hint="Если сумма заказа выше этого порога, доставка для клиента бесплатна">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  style={inp({ maxWidth: 180 })}
                  type="number"
                  min="0"
                  value={form.free_delivery_threshold || 0}
                  onChange={e => set('free_delivery_threshold', Number(e.target.value))}
                />
                <span style={{ fontSize: 13, color: AT.muted, fontWeight: 700 }}>сом</span>
              </div>
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="По городу (Бишкек)" hint="Базовая цена курьера">
                <input
                  style={inp()}
                  type="number"
                  min="0"
                  value={form.delivery_bishkek || 0}
                  onChange={e => set('delivery_bishkek', Number(e.target.value))}
                />
              </Field>

              <Field label="Пригород / Отдаленные районы" hint="Села и окраины города">
                <input
                  style={inp()}
                  type="number"
                  min="0"
                  value={form.delivery_suburbs || 0}
                  onChange={e => set('delivery_suburbs', Number(e.target.value))}
                />
              </Field>
            </div>
          </Card>
        </div>

        {/* Right Column: Vendor Policy & Support */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Vendor Marketplace Rules */}
          <Card title="УСЛОВИЯ ДЛЯ ВЕНДОРОВ" subtitle="Правила работы цветочных магазинов на платформе">
            <Field label="Комиссия маркетплейса (%)" hint="Процент с каждой успешной продажи букета">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  style={inp({ maxWidth: 120 })}
                  type="number"
                  min="0"
                  max="100"
                  value={form.commission_percent || 0}
                  onChange={e => set('commission_percent', Number(e.target.value))}
                />
                <span style={{ fontSize: 14, color: AT.primary, fontWeight: 800 }}>%</span>
              </div>
            </Field>

            <div style={{
              background: AT.surfaceAlt,
              padding: '14px 16px',
              borderRadius: AT.radius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: AT.ink }}>
                  Автоматическое одобрение магазинов
                </div>
                <div style={{ fontSize: 11, color: AT.muted, marginTop: 2 }}>
                  Вендоры сразу получают статус «Активен» после регистрации
                </div>
              </div>

              <input
                type="checkbox"
                checked={form.auto_approve_vendors !== false}
                onChange={e => set('auto_approve_vendors', e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: AT.primary }}
              />
            </div>
          </Card>

          {/* Support Contacts */}
          <Card title="СЛУЖБА ПОДДЕРЖКИ КЛИЕНТОВ И ВЕНДОРОВ" subtitle="Контактные данные для связи">
            <Field label="Горячая линия (телефон)">
              <input
                style={inp()}
                value={form.support_phone || ''}
                onChange={e => set('support_phone', e.target.value)}
                placeholder="+996 555 123 456"
              />
            </Field>

            <Field label="WhatsApp поддержки" hint="Номер для мгновенной связи">
              <input
                style={inp()}
                value={form.support_whatsapp || ''}
                onChange={e => set('support_whatsapp', e.target.value)}
                placeholder="+996555123456"
              />
            </Field>
          </Card>
        </div>
      </div>
    </form>
  );
}
