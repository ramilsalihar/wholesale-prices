import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useAuth } from '../features/auth.jsx';
import { useRouter } from '../shared/router.jsx';
import { signInWithGoogle, signInWithEmail, signUpWithRole } from '../service/auth.js';

const GOOGLE_CLIENT_ID = '877634120515-imgb8trcfmcg794l1al4v2941m022329.apps.googleusercontent.com';

function loadGIS() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) { resolve(); return; }
    const existing = document.querySelector('script[src*="accounts.google.com/gsi"]');
    if (existing) { existing.addEventListener('load', resolve); existing.addEventListener('error', reject); return; }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function formatAuthError(err) {
  const msg = err?.message || String(err || '');
  if (msg.includes('Load failed') || msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('именем хоста')) {
    return 'Сервер Supabase недоступен. Проверьте подключение и статус проекта.';
  }
  if (msg.includes('Email signups are disabled') || msg.includes('email_provider_disabled')) {
    return 'В Supabase отключена авторизация по Email. Включите Email в Authentication → Providers → Email.';
  }
  if (msg.includes('Invalid login credentials')) {
    return 'Неверный email или пароль.';
  }
  if (msg.includes('User already registered')) {
    return 'Пользователь с таким email уже зарегистрирован. Войдите во вкладке «Вход».';
  }
  return msg || 'Ошибка авторизации.';
}

function Avatar({ user, size = 40 }) {
  const t = useTheme();
  const avatar = user?.user_metadata?.avatar_url;
  const name = user?.user_metadata?.full_name || user?.email || '?';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (avatar) {
    return (
      <img src={avatar} alt={name} style={{
        width: size, height: size, borderRadius: '50%',
        objectFit: 'cover', border: `2px solid ${t.border}`,
      }} />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: t.discountBg, color: t.primaryDark,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 600, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

const inpStyle = (t, extra = {}) => ({
  width: '100%',
  padding: '9px 12px',
  borderRadius: 4,
  border: `1.5px solid ${t.border}`,
  background: t.bg,
  color: t.ink,
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  marginTop: 4,
  ...extra,
});

export function LoginModal() {
  const t = useTheme();
  const { user, role, isVendor, modalOpen, closeLogin, signOut } = useAuth();
  const router = useRouter();
  const btnRef = useRef(null);

  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState('user'); // 'user' | 'vendor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!modalOpen || user || tab !== 'signin') return;

    let cancelled = false;
    loadGIS()
      .then(() => {
        if (cancelled || !btnRef.current) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            setError('');
            try {
              await signInWithGoogle(response.credential);
              closeLogin();
            } catch (e) {
              setError(formatAuthError(e));
            }
          },
        });
        window.google.accounts.id.renderButton(btnRef.current, {
          theme: 'outline',
          size: 'large',
          width: Math.min(320, window.innerWidth - 80),
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'center',
        });
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [modalOpen, user, tab]);

  if (!modalOpen) return null;

  const name = user?.user_metadata?.full_name || user?.email || '';
  const userEmail = user?.email || '';

  async function handleSignInSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      closeLogin();
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUpSubmit(e) {
    e.preventDefault();
    if (selectedRole === 'vendor' && !shopName.trim()) {
      setError('Укажите название вашего цветочного магазина');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signUpWithRole({
        email,
        password,
        fullName,
        phone,
        role: selectedRole,
        shopName: selectedRole === 'vendor' ? shopName : '',
      });
      closeLogin();
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeLogin}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1001,
        background: t.surface,
        borderRadius: 6,
        boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
        width: 'calc(100% - 32px)',
        maxWidth: 420,
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px 24px',
        fontFamily: "'Manrope', sans-serif",
        boxSizing: 'border-box',
      }}>
        {/* Close */}
        <button
          onClick={closeLogin}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: t.surfaceAlt, border: 'none', cursor: 'pointer',
            width: 32, height: 32, borderRadius: 4,
            color: t.muted, fontSize: 18, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ×
        </button>

        {user ? (
          /* ── Logged-in state ───────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
            <Avatar user={user} size={64} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: t.ink, letterSpacing: '-0.01em' }}>{name}</div>
              <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>{userEmail}</div>
              <div style={{ marginTop: 8 }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: role === 'vendor' ? t.discountBg : role === 'admin' ? '#fef3c7' : t.surfaceAlt,
                  color: role === 'vendor' ? t.primaryDark : role === 'admin' ? '#92400e' : t.muted,
                  border: `1px solid ${t.border}`,
                  letterSpacing: '0.04em',
                }}>
                  {role === 'vendor' ? '🏪 Продавец' : role === 'admin' ? '👑 Администратор' : '👤 Покупатель'}
                </span>
              </div>
            </div>

            <div style={{ width: '100%', height: 1, background: t.border }} />

            {/* If vendor, show direct button to Vendor Panel */}
            {isVendor && (
              <a
                href="/vendor"
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: t.primary,
                  color: '#fff',
                  borderRadius: 4,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxSizing: 'border-box',
                }}
              >
                <span>🏪</span> Панель вендора
              </a>
            )}

            <button
              onClick={() => { closeLogin(); router.go({ screen: 'profile' }); }}
              style={{
                width: '100%', padding: '12px 0',
                background: 'transparent', color: t.btnInk,
                border: `1.5px solid ${t.btnBorder}`, borderRadius: 4, cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              ✏️ Личный профиль
            </button>

            <button
              onClick={async () => {
                setSigningOut(true);
                try { await signOut(); closeLogin(); } finally { setSigningOut(false); }
              }}
              disabled={signingOut}
              style={{
                width: '100%', padding: '12px 0',
                background: 'transparent',
                border: `1.5px solid ${t.border}`,
                borderRadius: 4, cursor: 'pointer',
                fontSize: 14, fontWeight: 600, color: t.ink,
                fontFamily: 'inherit',
                opacity: signingOut ? 0.6 : 1,
              }}
            >
              {signingOut ? 'Выходим...' : 'Выйти'}
            </button>
          </div>
        ) : (
          /* ── Auth Form (Tabs: Вход / Регистрация) ────────── */
          <div>
            {/* Header Icon & Title */}
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 6,
                background: t.discountBg, color: t.primaryDark,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px', fontSize: 24,
              }}>
                🌸
              </div>
              <div style={{ fontSize: 19, fontWeight: 800, color: t.ink, letterSpacing: '-0.02em' }}>
                FLOWO
              </div>
              <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>
                Доставка цветов и витрина цветочных салонов
              </div>
            </div>

            {/* Tab switch */}
            <div style={{
              display: 'flex',
              background: t.surfaceAlt,
              padding: 3,
              borderRadius: 6,
              marginBottom: 16,
              gap: 4,
            }}>
              <button
                type="button"
                onClick={() => { setTab('signin'); setError(''); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  borderRadius: 4,
                  background: tab === 'signin' ? t.surface : 'transparent',
                  color: tab === 'signin' ? t.ink : t.muted,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => { setTab('signup'); setError(''); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  borderRadius: 4,
                  background: tab === 'signup' ? t.surface : 'transparent',
                  color: tab === 'signup' ? t.ink : t.muted,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Регистрация
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '10px 12px',
                background: 'rgba(222,53,11,0.08)',
                border: '1px solid rgba(222,53,11,0.25)',
                borderRadius: 4,
                fontSize: 13,
                color: '#DE350B',
                marginBottom: 14,
                lineHeight: 1.4,
              }}>
                {error}
              </div>
            )}

            {/* Sign In Form */}
            {tab === 'signin' && (
              <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.muted, textTransform: 'uppercase' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={inpStyle(t)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.muted, textTransform: 'uppercase' }}>
                    Пароль
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inpStyle(t)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: 6,
                    padding: '12px',
                    background: loading ? t.muted : t.primary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {loading ? 'Входим...' : 'Войти в аккаунт'}
                </button>

                {/* Google Sign In option */}
                <div style={{ margin: '8px 0 2px', textAlign: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '50% 0 auto 0', height: 1, background: t.border }} />
                  <span style={{ position: 'relative', background: t.surface, padding: '0 10px', fontSize: 11, color: t.muted }}>
                    или через Google
                  </span>
                </div>

                <div ref={btnRef} style={{ display: 'flex', justifyContent: 'center', width: '100%', minHeight: 40 }} />
              </form>
            )}

            {/* Sign Up Form (With Role Selection: User vs Vendor) */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Role Selector */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.muted, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                    Тип аккаунта *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div
                      onClick={() => setSelectedRole('user')}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 4,
                        border: `1.5px solid ${selectedRole === 'user' ? t.primary : t.border}`,
                        background: selectedRole === 'user' ? t.discountBg : t.surfaceAlt,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 18 }}>👤</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: selectedRole === 'user' ? t.primaryDark : t.ink, marginTop: 2 }}>
                        Покупатель
                      </div>
                      <div style={{ fontSize: 10, color: t.muted, marginTop: 2 }}>
                        Заказ букетов
                      </div>
                    </div>

                    <div
                      onClick={() => setSelectedRole('vendor')}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 4,
                        border: `1.5px solid ${selectedRole === 'vendor' ? t.primary : t.border}`,
                        background: selectedRole === 'vendor' ? t.discountBg : t.surfaceAlt,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 18 }}>🏪</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: selectedRole === 'vendor' ? t.primaryDark : t.ink, marginTop: 2 }}>
                        Вендор
                      </div>
                      <div style={{ fontSize: 10, color: t.muted, marginTop: 2 }}>
                        Цветочный салон
                      </div>
                    </div>
                  </div>
                </div>

                {/* If Vendor selected -> Ask for Flower Shop Name */}
                {selectedRole === 'vendor' && (
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: t.primaryDark, textTransform: 'uppercase' }}>
                      Название цветочного магазина *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={e => setShopName(e.target.value)}
                      placeholder="Салон цветов «Пион»"
                      style={inpStyle(t, { borderColor: t.primary })}
                    />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.muted, textTransform: 'uppercase' }}>
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Айгуль"
                    style={inpStyle(t)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.muted, textTransform: 'uppercase' }}>
                    Email (логин) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={inpStyle(t)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.muted, textTransform: 'uppercase' }}>
                    Пароль (от 6 символов) *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inpStyle(t)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.muted, textTransform: 'uppercase' }}>
                    Телефон / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+996 (555) 00-00-00"
                    style={inpStyle(t)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: 6,
                    padding: '12px',
                    background: loading ? t.muted : t.primary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {loading
                    ? 'Создаем аккаунт...'
                    : selectedRole === 'vendor'
                    ? 'Зарегистрировать магазин'
                    : 'Зарегистрироваться'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
}
