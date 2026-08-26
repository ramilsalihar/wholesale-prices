import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useAuth } from '../features/auth.jsx';
import { useRouter } from '../shared/router.jsx';
import { signInWithGoogle } from '../service/auth.js';

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

export function LoginModal() {
  const t = useTheme();
  const { user, modalOpen, closeLogin, signOut } = useAuth();
  const router = useRouter();
  const btnRef = useRef(null);
  const [error, setError] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!modalOpen || user) return;

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
            } catch (e) {
              setError(e.message || 'Ошибка входа');
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
      .catch(() => setError('Не удалось загрузить Google Sign-In'));

    return () => { cancelled = true; };
  }, [modalOpen, user]);

  if (!modalOpen) return null;

  const name = user?.user_metadata?.full_name || user?.email || '';
  const email = user?.email || '';

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
        borderRadius: 4,
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        width: 'calc(100% - 32px)', maxWidth: 380,
        padding: '28px 24px',
        fontFamily: "'Lora', Georgia, 'Times New Roman', serif",
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
          /* Logged-in state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
            <Avatar user={user} size={64} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>{name}</div>
              <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>{email}</div>
            </div>
            <div style={{ width: '100%', height: 1, background: t.border }} />
            <button
              onClick={() => { closeLogin(); router.go({ screen: 'profile' }); }}
              style={{
                width: '100%', padding: '12px 0',
                background: 'transparent', color: t.btnInk,
                border: `1.5px solid ${t.btnBorder}`, borderRadius: 4, cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              ✏️ Редактировать профиль
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
          /* Sign-in state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            {/* Logo / branding */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 4,
                background: t.discountBg, color: t.primaryDark,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: 26,
              }}>
                🌷
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: t.ink, letterSpacing: '-0.02em' }}>
                Войти
              </div>
              <div style={{ fontSize: 13, color: t.muted, marginTop: 6, lineHeight: 1.5 }}>
                Отслеживайте заказы и сохраняйте адреса доставки
              </div>
            </div>

            {error && (
              <div style={{
                width: '100%', padding: '10px 14px',
                background: 'rgba(222,53,11,0.06)',
                border: '1px solid rgba(222,53,11,0.2)',
                borderRadius: 4, fontSize: 13, color: '#DE350B',
              }}>
                {error}
              </div>
            )}

            {/* Google button container */}
            <div ref={btnRef} style={{ display: 'flex', justifyContent: 'center', width: '100%' }} />

            <div style={{ fontSize: 11, color: t.muted, textAlign: 'center', lineHeight: 1.6 }}>
              Входя, вы соглашаетесь с условиями использования
            </div>
          </div>
        )}
      </div>
    </>
  );
}
