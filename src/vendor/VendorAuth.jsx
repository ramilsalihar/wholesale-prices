import React, { useState } from 'react';
import { supabase } from '../service/supabase.js';
import { upsertVendor } from '../service/vendors.js';
import { VT } from './vendorTheme.js';

const inpStyle = {
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
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

function formatAuthError(err) {
  const msg = err?.message || String(err || '');
  if (msg.includes('Load failed') || msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('именем хоста')) {
    return 'Не удалось подключиться к серверу Supabase. Возможные причины: 1) Проект Supabase на паузе (Paused) — восстановите его в supabase.com/dashboard; 2) Неверный URL в файле .env.';
  }
  if (msg.includes('Email signups are disabled') || msg.includes('email_provider_disabled')) {
    return 'В Supabase отключена авторизация по Email. Включите Email в Supabase Dashboard → Authentication → Providers → Email.';
  }
  if (msg.includes('Invalid login credentials')) {
    return 'Неверный email или пароль.';
  }
  if (msg.includes('User already registered')) {
    return 'Пользователь с таким email уже зарегистрирован. Перейдите на вкладку «Вход».';
  }
  return msg || 'Ошибка авторизации. Попробуйте еще раз.';
}

export default function VendorAuth({ onAuthSuccess }) {
  const [mode, setMode] = useState('signup'); // 'signup' | 'signin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Бишкек');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  async function handleSignIn(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInErr) throw signInErr;

      if (onAuthSuccess && data?.session) {
        onAuthSuccess(data.session);
      }
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!shopName.trim()) {
      setError('Укажите название вашего магазина цветов');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            role: 'vendor',
            shop_name: shopName.trim(),
            full_name: fullName.trim(),
            phone: phone.trim(),
            city: city.trim(),
            address: address.trim(),
            description: description.trim(),
          },
        },
      });

      if (signUpErr) throw signUpErr;

      const user = data?.user;
      if (user) {
        // Direct upsert to ensure tables are populated even if triggers are delayed
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            full_name: fullName.trim() || shopName.trim(),
            phone: phone.trim(),
            role: 'vendor',
            city: city.trim(),
            address: address.trim(),
          });

          await upsertVendor({
            id: user.id,
            name: shopName.trim(),
            phone: phone.trim(),
            email: user.email,
            city: city.trim(),
            address: address.trim(),
            description: description.trim(),
            status: 'approved',
          });
        } catch (dbErr) {
          console.warn('Direct vendor sync fallback:', dbErr);
        }
      }

      if (data?.session) {
        if (onAuthSuccess) onAuthSuccess(data.session);
      } else {
        setSuccessMsg('Регистрация прошла успешно! Проверьте вашу почту для подтверждения или войдите в кабинет.');
        setMode('signin');
      }
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: VT.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: 'Manrope, sans-serif',
      boxSizing: 'border-box',
    }}>
      <div style={{
        background: VT.surface,
        borderRadius: VT.radiusLg,
        border: `1px solid ${VT.border}`,
        padding: '36px 36px 32px',
        width: '100%',
        maxWidth: mode === 'signup' ? 520 : 420,
        boxShadow: VT.shadowLg,
        boxSizing: 'border-box',
        transition: 'max-width 0.2s ease',
      }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: VT.primaryBg,
            color: VT.primary,
            fontSize: 24,
            marginBottom: 12,
          }}>
            🌸
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: VT.ink, letterSpacing: '-0.02em' }}>
            FLOWO Партнёры
          </div>
          <div style={{ fontSize: 13, color: VT.muted, marginTop: 4, fontWeight: 500 }}>
            {mode === 'signup'
              ? 'Регистрация магазина цветов и флориста'
              : 'Вход в личный кабинет продавца'}
          </div>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex',
          background: VT.surfaceAlt,
          padding: 4,
          borderRadius: VT.radius,
          marginBottom: 24,
          gap: 4,
        }}>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: VT.radius - 2,
              background: mode === 'signup' ? VT.surface : 'transparent',
              color: mode === 'signup' ? VT.ink : VT.muted,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: mode === 'signup' ? VT.shadowSm : 'none',
              fontFamily: 'inherit',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            Регистрация
          </button>
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: VT.radius - 2,
              background: mode === 'signin' ? VT.surface : 'transparent',
              color: mode === 'signin' ? VT.ink : VT.muted,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: mode === 'signin' ? VT.shadowSm : 'none',
              fontFamily: 'inherit',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            Вход
          </button>
        </div>

        {/* Error / Success alert */}
        {error && (
          <div style={{
            background: VT.dangerBg,
            border: `1px solid rgba(222,53,11,0.2)`,
            color: VT.danger,
            borderRadius: VT.radius,
            padding: '10px 14px',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: VT.successBg,
            border: `1px solid rgba(0,135,90,0.2)`,
            color: VT.success,
            borderRadius: VT.radius,
            padding: '10px 14px',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 20,
          }}>
            {successMsg}
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inpStyle}
                placeholder="shop@example.com"
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={inpStyle}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: loading ? VT.muted : VT.primary,
                color: '#fff',
                border: 'none',
                borderRadius: VT.radius,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Входим...' : 'Войти в кабинет'}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Название цветочного магазина *
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  required
                  style={inpStyle}
                  placeholder="Салон цветов «Флоренция»"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Email (для входа) *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={inpStyle}
                    placeholder="flowers@shop.kg"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Пароль (от 6 симв.) *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={inpStyle}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Контактное лицо
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    style={inpStyle}
                    placeholder="Айсулуу Бекова"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    WhatsApp / Телефон *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    style={inpStyle}
                    placeholder="+996 (555) 12-34-56"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Город
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    style={inpStyle}
                    placeholder="Бишкек"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Адрес салона / мастерской
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    style={inpStyle}
                    placeholder="ул. Токтогула, 125"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: VT.inkLight, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  О магазине / Описание
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{ ...inpStyle, resize: 'vertical' }}
                  placeholder="Свежие пионы, розы и авторские букеты с доставкой за 60 минут..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: loading ? VT.muted : VT.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: VT.radius,
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: 6,
                  transition: 'background 0.15s',
                }}
              >
                {loading ? 'Создаем магазин...' : 'Зарегистрировать магазин и начать'}
              </button>
            </div>
          </form>
        )}

        {/* Back to storefront link */}
        <div style={{ marginTop: 24, textAlign: 'center', borderTop: `1px solid ${VT.border}`, paddingTop: 16 }}>
          <a
            href="/"
            style={{
              fontSize: 13,
              color: VT.muted,
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ← Вернуться на витрину доставки цветов
          </a>
          <div style={{ marginTop: 10, fontSize: 11, color: VT.muted }}>
            Supabase: <code style={{ background: VT.surfaceAlt, padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>
              {import.meta.env.VITE_SUPABASE_URL || 'placeholder (требуется .env)'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
