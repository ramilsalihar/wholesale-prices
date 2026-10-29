import React, { useState, useEffect } from 'react';
import { VT } from '../vendorTheme.js';
import { upsertVendor } from '../../service/vendors.js';
import { supabase } from '../../service/supabase.js';

const inpStyle = (extra = {}) => ({
  display: 'block',
  width: '100%',
  padding: '11px 14px',
  border: `1.5px solid ${VT.border}`,
  borderRadius: VT.radius,
  fontSize: 14,
  fontFamily: 'Manrope, sans-serif',
  color: VT.ink,
  background: VT.surface,
  outline: 'none',
  marginTop: 6,
  boxSizing: 'border-box',
  ...extra,
});

export function VendorStoreSettings({ vendor, onVendorUpdated }) {
  const [name, setName] = useState(vendor?.name || '');
  const [description, setDescription] = useState(vendor?.description || '');
  const [phone, setPhone] = useState(vendor?.phone || '');
  const [email, setEmail] = useState(vendor?.email || '');
  const [city, setCity] = useState(vendor?.city || 'Бишкек');
  const [address, setAddress] = useState(vendor?.address || '');
  const [hours, setHours] = useState(vendor?.hours || '09:00 – 21:00');
  const [logoUrl, setLogoUrl] = useState(vendor?.logo_url || '');
  const [bannerUrl, setBannerUrl] = useState(vendor?.banner_url || '');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  // Sync state if vendor object loads/changes
  useEffect(() => {
    if (vendor) {
      if (vendor.name) setName(vendor.name);
      if (vendor.description) setDescription(vendor.description);
      if (vendor.phone) setPhone(vendor.phone);
      if (vendor.email) setEmail(vendor.email);
      if (vendor.city) setCity(vendor.city);
      if (vendor.address) setAddress(vendor.address);
      if (vendor.hours) setHours(vendor.hours);
      if (vendor.logo_url) setLogoUrl(vendor.logo_url);
      if (vendor.banner_url) setBannerUrl(vendor.banner_url);
    }
  }, [vendor]);

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Название магазина не может быть пустым');
      return;
    }

    setSaving(true);
    setError('');
    setSavedSuccess(false);

    try {
      // Safely resolve vendor ID: from props, or directly from current authenticated session
      let targetId = vendor?.id;
      if (!targetId) {
        const { data: { user } } = await supabase.auth.getUser();
        targetId = user?.id;
      }

      if (!targetId) {
        throw new Error('Не удалось определить ID магазина. Пожалуйста, перезайдите в аккаунт.');
      }

      const payload = {
        id: targetId,
        name: name.trim(),
        description: description.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        address: address.trim(),
        hours: hours.trim(),
        logo_url: logoUrl.trim(),
        banner_url: bannerUrl.trim(),
        status: vendor?.status || 'approved',
      };

      const updated = await upsertVendor(payload);
      if (onVendorUpdated) onVendorUpdated(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setError(err.message || 'Ошибка сохранения данных магазина');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: VT.ink, letterSpacing: '-0.02em' }}>
          Профиль цветочного магазина
        </h1>
        <div style={{ fontSize: 13, color: VT.muted, marginTop: 4 }}>
          Информация отображается клиентам на витрине Flowo и в карточках ваших букетов
        </div>
      </div>

      {savedSuccess && (
        <div style={{
          background: VT.successBg,
          border: `1px solid rgba(0,135,90,0.2)`,
          color: VT.success,
          borderRadius: VT.radius,
          padding: '12px 16px',
          fontSize: 14,
          fontWeight: 600,
        }}>
          ✓ Профиль магазина успешно сохранён и обновлён на витрине!
        </div>
      )}

      {error && (
        <div style={{
          background: VT.dangerBg,
          border: `1px solid rgba(222,53,11,0.2)`,
          color: VT.danger,
          borderRadius: VT.radius,
          padding: '12px 16px',
          fontSize: 14,
          fontWeight: 600,
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Settings Form */}
        <form onSubmit={handleSave} style={{
          background: VT.surface,
          border: `1px solid ${VT.border}`,
          borderRadius: VT.radiusLg,
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: VT.shadowSm,
        }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
              Название магазина / цветочной лавки *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={inpStyle()}
              placeholder="Цветочная студия «Пион»"
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
              Концепция / Описание для клиентов
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ ...inpStyle(), resize: 'vertical' }}
              placeholder="Авторская флористика, свежие поставки роз и пионов каждые два дня. Быстрая доставка по городу."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                WhatsApp / Телефон
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={inpStyle()}
                placeholder="+996 (555) 00-00-00"
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                Рабочий Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inpStyle()}
                placeholder="flowers@shop.kg"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                Город
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                style={inpStyle()}
                placeholder="Бишкек"
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                Адрес салона / точка самовывоза
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                style={inpStyle()}
                placeholder="ул. Киевская, 140"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
              Режим работы
            </label>
            <input
              type="text"
              value={hours}
              onChange={e => setHours(e.target.value)}
              style={inpStyle()}
              placeholder="Ежедневно 08:30 – 21:30"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                URL логотипа
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                style={inpStyle()}
                placeholder="https://.../logo.png"
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase' }}>
                URL обложки витрины
              </label>
              <input
                type="url"
                value={bannerUrl}
                onChange={e => setBannerUrl(e.target.value)}
                style={inpStyle()}
                placeholder="https://.../banner.jpg"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: 10,
              padding: '13px',
              background: saving ? VT.muted : VT.primary,
              color: '#fff',
              border: 'none',
              borderRadius: VT.radius,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {saving ? 'Сохраняем...' : 'Сохранить изменения профиля'}
          </button>
        </form>

        {/* Live Storefront Preview */}
        <div style={{
          background: VT.surface,
          border: `1px solid ${VT.border}`,
          borderRadius: VT.radiusLg,
          overflow: 'hidden',
          boxShadow: VT.shadowSm,
        }}>
          <div style={{
            padding: '14px 18px',
            background: VT.surfaceAlt,
            borderBottom: `1px solid ${VT.border}`,
            fontSize: 12,
            fontWeight: 700,
            color: VT.muted,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            Предпросмотр витрины покупателям
          </div>

          {/* Banner cover */}
          <div style={{
            height: 100,
            background: bannerUrl ? `url(${bannerUrl}) center/cover no-repeat` : `linear-gradient(135deg, ${VT.primaryDark} 0%, ${VT.accent} 100%)`,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              bottom: -22,
              left: 20,
              width: 52,
              height: 52,
              borderRadius: VT.radius,
              background: VT.surface,
              border: `2px solid #fff`,
              boxShadow: VT.shadowSm,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>
              {logoUrl ? (
                <img src={logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.currentTarget.style.display = 'none'} />
              ) : (
                '🌸'
              )}
            </div>
          </div>

          <div style={{ padding: '32px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: VT.ink }}>
                {name || 'Название магазина'}
              </div>
              <div style={{ fontSize: 12, color: VT.muted, marginTop: 2 }}>
                {city} · {hours}
              </div>
            </div>

            {description && (
              <div style={{ fontSize: 13, color: VT.inkLight, lineHeight: 1.5 }}>
                {description}
              </div>
            )}

            <div style={{
              paddingTop: 10,
              borderTop: `1px solid ${VT.border}`,
              fontSize: 12,
              color: VT.muted,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              <div>📍 {address || 'Адрес не указан'}</div>
              <div>📞 {phone || 'Телефон не указан'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
