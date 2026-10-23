import React, { useState, useEffect } from 'react';
import { useAdminAuth } from './hooks/useAdminAuth.js';
import AdminLogin from './AdminLogin.jsx';
import { AdminShell } from './layout/AdminShell.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Categories } from './pages/Categories.jsx';
import { Products } from './pages/Products.jsx';
import { Vendors } from './pages/Vendors.jsx';
import { Brands } from './pages/Brands.jsx';
import { Banners } from './pages/Banners.jsx';
import { Orders } from './pages/Orders.jsx';
import { Stores } from './pages/Stores.jsx';
import { Settings } from './pages/Settings.jsx';
import { Features } from './pages/Features.jsx';
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
          categories: 'Категории',
          banners: 'Баннеры',
          stores: 'Магазины',
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
        Раздел в разработке — см. PLAN.md для деталей
      </div>
    </div>
  );
}

function ScreenContent({ screen }) {
  switch (screen) {
    case 'dashboard':  return <Dashboard />;
    case 'orders':     return <Orders />;
    case 'products':   return <Products />;
    case 'vendors':    return <Vendors />;
    case 'categories': return <Categories />;
    case 'brands':     return <Brands />;
    case 'banners':    return <Banners />;
    case 'stores':     return <Stores />;
    case 'settings':   return <Settings />;
    case 'features':   return <Features />;
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

  // If a vendor logs into /admin, direct them to their vendor dashboard
  if (role === 'vendor') {
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
          padding: '36px 32px',
          maxWidth: 460,
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🌸</div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: AT.ink }}>
            Кабинет Вендора
          </h2>
          <p style={{ fontSize: 14, color: AT.muted, margin: '12px 0 24px', lineHeight: 1.6 }}>
            Вы авторизованы как продавец (Вендор). Панель супер-администратора предназначена для главного руководства. Управляйте своими товарами и магазином в Кабинете Вендора:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            <button
              onClick={signOut}
              style={{
                padding: '10px',
                background: 'transparent',
                border: `1px solid ${AT.border}`,
                color: AT.muted,
                borderRadius: AT.radius,
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Сменить аккаунт / Выйти
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
