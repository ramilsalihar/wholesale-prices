import React, { useState, useEffect } from 'react';
import { useAdminAuth } from './hooks/useAdminAuth.js';
import AdminLogin from './AdminLogin.jsx';
import { AdminShell } from './layout/AdminShell.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Categories } from './pages/Categories.jsx';
import { Products } from './pages/Products.jsx';
import { Vendors } from './pages/Vendors.jsx';
import { Users } from './pages/Users.jsx';
import { Banners } from './pages/Banners.jsx';
import { Orders } from './pages/Orders.jsx';
import { Settings } from './pages/Settings.jsx';
import { fetchUserRole } from '../service/vendors.js';
import { AT } from './adminTheme.js';

function Placeholder({ screen }) {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: AT.ink, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
        {{
          orders: 'Заказы',
          products: 'Товары',
          vendors: 'Вендоры',
          users: 'Пользователи',
          categories: 'Категории',
          banners: 'Баннеры',
          settings: 'Настройки',
        }[screen] ?? screen}
      </h1>
      <div style={{
        background: AT.surface,
        border: `1px solid ${AT.border}`,
        borderRadius: AT.radiusLg,
        padding: 48,
        textAlign: 'center',
        color: AT.muted,
        fontSize: 14,
        fontWeight: 500,
      }}>
        Раздел в разработке
      </div>
    </div>
  );
}

function ScreenContent({ screen }) {
  switch (screen) {
    case 'dashboard':  return <Dashboard />;
    case 'vendors':    return <Vendors />;
    case 'products':   return <Products />;
    case 'orders':     return <Orders />;
    case 'users':      return <Users />;
    case 'categories': return <Categories />;
    case 'banners':    return <Banners />;
    case 'settings':   return <Settings />;
    default:           return <Placeholder screen={screen} />;
  }
}

export default function AdminApp() {
  const { session, loading, signOut } = useAdminAuth();
  const [screen, setScreen] = useState('dashboard');
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      setRoleLoading(true);
      fetchUserRole(session.user.id)
        .then(r => {
          // Fallback: trial admin account is always treated as admin
          if (session.user.email === 'admin@gmail.com') {
            setRole('admin');
          } else {
            setRole(r || 'user');
          }
        })
        .catch(() => {
          if (session.user.email === 'admin@gmail.com') {
            setRole('admin');
          } else {
            setRole('user');
          }
        })
        .finally(() => setRoleLoading(false));
    } else {
      setRole(null);
    }
  }, [session?.user?.id]);

  if (loading || roleLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        fontFamily: 'Manrope, sans-serif',
        color: AT.muted,
        fontSize: 14,
        fontWeight: 500,
        background: AT.bg,
      }}>
        Загрузка панели управления...
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  // ── ROUTE PROTECTION FOR /admin ────────────────────────────────────
  // Only users with role === 'admin' can access AdminShell
  if (role !== 'admin') {
    const isVendor = role === 'vendor';
    return (
      <div style={{
        minHeight: '100dvh',
        background: AT.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'Manrope, sans-serif',
      }}>
        <div style={{
          background: AT.surface,
          borderRadius: AT.radiusLg,
          border: `1px solid ${AT.border}`,
          padding: '40px 32px',
          maxWidth: 480,
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>
            {isVendor ? '🌸' : '🔒'}
          </div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: AT.ink }}>
            {isVendor ? 'Кабинет продавца Flowo' : 'Доступ к панели запрещён'}
          </h2>
          <p style={{ fontSize: 14, color: AT.muted, margin: '12px 0 24px', lineHeight: 1.6 }}>
            {isVendor ? (
              <>Вы авторизованы как <strong>Вендор ({session.user.email})</strong>. Панель супер-администратора предназначена только для управляющего платформой. Ваши букеты и заказы находятся в панели продавца:</>
            ) : (
              <>Вы авторизованы как <strong>Покупатель ({session.user.email})</strong>. У вас нет прав доступа к административной панели платформы Flowo.</>
            )}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {isVendor ? (
              <a
                href="/vendor"
                style={{
                  display: 'block',
                  padding: '12px',
                  background: AT.primary,
                  color: '#fff',
                  borderRadius: AT.radius,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                }}
              >
                Перейти в Кабинет Продавца →
              </a>
            ) : (
              <a
                href="/"
                style={{
                  display: 'block',
                  padding: '12px',
                  background: AT.primary,
                  color: '#fff',
                  borderRadius: AT.radius,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                }}
              >
                На главную витрину Flowo →
              </a>
            )}

            <button
              onClick={signOut}
              style={{
                padding: '11px',
                background: AT.surfaceAlt,
                border: `1px solid ${AT.border}`,
                color: AT.ink,
                borderRadius: AT.radius,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Войти под другим аккаунтом (Администратор)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminShell screen={screen} go={setScreen} session={session} onSignOut={signOut}>
      <ScreenContent screen={screen} />
    </AdminShell>
  );
}
