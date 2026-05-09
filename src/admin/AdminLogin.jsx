import React, { useState } from 'react';
import { supabase } from '../service/supabase.js';
import { AT } from './adminTheme.js';

const inp = {
  display: 'block',
  width: '100%',
  padding: '10px 14px',
  border: `1.5px solid ${AT.border}`,
  borderRadius: AT.radius,
  fontSize: 15,
  fontFamily: 'Manrope, sans-serif',
  color: AT.ink,
  background: AT.surface,
  outline: 'none',
  marginTop: 6,
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: AT.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Manrope, sans-serif',
    }}>
      <div style={{
        background: AT.surface,
        borderRadius: AT.radiusLg,
        border: `1px solid ${AT.border}`,
        padding: '40px 40px 36px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: AT.ink, letterSpacing: '-0.02em' }}>
            Оптовые Цены
          </div>
          <div style={{ fontSize: 13, color: AT.muted, marginTop: 4, fontWeight: 500 }}>
            Панель управления
          </div>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: AT.inkLight }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inp}
              placeholder="admin@example.com"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: AT.inkLight }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={inp}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{
              background: AT.dangerBg,
              border: `1px solid rgba(222,53,11,0.2)`,
              color: AT.danger,
              borderRadius: AT.radius,
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              background: loading ? AT.muted : AT.primary,
              color: '#fff',
              border: 'none',
              borderRadius: AT.radius,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: 'Manrope, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '-0.01em',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        {import.meta.env.DEV && (
          <div style={{
            marginTop: 24,
            padding: '12px 14px',
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: AT.radius,
            fontSize: 12,
            color: '#92400E',
            fontWeight: 500,
            lineHeight: 1.6,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Тестовые данные (только dev)</div>
            <div>Email: <code style={{ background: '#FEF3C7', padding: '1px 4px', borderRadius: 3 }}>admin@gmail.com</code></div>
            <div>Пароль: <code style={{ background: '#FEF3C7', padding: '1px 4px', borderRadius: 3 }}>admin123</code></div>
          </div>
        )}
      </div>
    </div>
  );
}
