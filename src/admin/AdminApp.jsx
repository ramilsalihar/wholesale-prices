import React, { useState } from 'react';
import { useAdminAuth } from './hooks/useAdminAuth.js';
import AdminLogin from './AdminLogin.jsx';
import { AdminShell } from './layout/AdminShell.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Categories } from './pages/Categories.jsx';
import { Products } from './pages/Products.jsx';
import { AT } from './adminTheme.js';

function Placeholder({ screen }) {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: AT.ink, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
        {{
          orders: 'Заказы',
          products: 'Товары',
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
    case 'categories': return <Categories />;
    case 'products':   return <Products />;
    default:           return <Placeholder screen={screen} />;
  }
}

export default function AdminApp() {
  const { session, loading, signOut } = useAdminAuth();
  const [screen, setScreen] = useState('dashboard');

  if (loading) {
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
        Загрузка...
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  return (
    <AdminShell screen={screen} go={setScreen} session={session} onSignOut={signOut}>
      <ScreenContent screen={screen} />
    </AdminShell>
  );
}
