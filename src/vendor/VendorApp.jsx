import React, { useState, useEffect } from 'react';
import { supabase } from '../service/supabase.js';
import { fetchCurrentVendor, upsertVendor, fetchUserRole } from '../service/vendors.js';
import { fetchVendorProducts } from '../service/vendorProducts.js';
import VendorAuth from './VendorAuth.jsx';
import { VendorShell } from './VendorShell.jsx';
import { VendorDashboard } from './pages/VendorDashboard.jsx';
import { VendorProducts } from './pages/VendorProducts.jsx';
import { VendorStoreSettings } from './pages/VendorStoreSettings.jsx';
import { VT } from './vendorTheme.js';

export default function VendorApp() {
  const [session, setSession] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [role, setRole] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('dashboard');
  const [openAddModalTrigger, setOpenAddModalTrigger] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadVendorData(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadVendorData(session.user);
      } else {
        setVendor(null);
        setRole(null);
        setProducts([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadVendorData(user) {
    setLoading(true);
    try {
      const dbRole = await fetchUserRole(user.id);
      const metaRole = user.user_metadata?.role;
      // Prefer DB role only when it's elevated (vendor/admin).
      // If DB returns 'user' but metadata says 'vendor' → trust metadata
      // (handles cases where profiles table is empty or migration hasn't run yet)
      const userRole = (dbRole && dbRole !== 'user') ? dbRole : (metaRole || 'user');
      setRole(userRole);

      // Route Protection: If user is an ordinary customer, deny access to vendor panel
      if (userRole !== 'vendor' && userRole !== 'admin') {
        setVendor(null);
        setProducts([]);
        setLoading(false);
        return;
      }

      let v = await fetchCurrentVendor(user.id);

      // Initialize vendor profile only if user is authorized as vendor
      if (!v && (userRole === 'vendor' || userRole === 'admin')) {
        const metadata = user.user_metadata || {};
        const shopName = metadata.shop_name || metadata.full_name || 'Цветочный салон';
        const defaultVendor = {
          id: user.id,
          name: shopName,
          email: user.email,
          phone: metadata.phone || '',
          city: metadata.city || 'Бишкек',
          address: metadata.address || '',
          description: metadata.description || '',
          status: 'approved',
          hours: '09:00 – 21:00',
          logo_url: '',
          banner_url: '',
          rating: 5.0,
          tier: 'small',
        };

        try {
          v = await upsertVendor(defaultVendor);
        } catch (saveErr) {
          console.warn('Could not upsert default vendor to DB, using local state:', saveErr);
          v = defaultVendor;
        }
      }

      setVendor(v);

      if (v) {
        const prods = await fetchVendorProducts(user.id);
        setProducts(prods);
      }
    } catch (err) {
      console.error('Error loading vendor data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSession(null);
    setVendor(null);
    setRole(null);
    setProducts([]);
  }

  function handleAddProductQuick() {
    setScreen('products');
    setOpenAddModalTrigger(true);
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: VT.bg,
        fontFamily: 'Manrope, sans-serif',
        color: VT.muted,
        fontSize: 14,
        fontWeight: 600,
        gap: 10,
      }}>
        <span style={{ fontSize: 24 }}>🌸</span>
        Загрузка панели вендора...
      </div>
    );
  }

  // If not logged in at all, show Vendor Sign In / Sign Up
  if (!session) {
    return <VendorAuth onAuthSuccess={(sess) => setSession(sess)} />;
  }

  // ── PROTECTED ROUTE CHECK: Ordinary Customer (User) ──────────────
  if (role === 'user') {
    return (
      <div style={{
        minHeight: '100dvh',
        background: VT.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'Manrope, sans-serif',
      }}>
        <div style={{
          background: VT.surface,
          borderRadius: VT.radiusLg,
          border: `1px solid ${VT.border}`,
          padding: '40px 32px',
          maxWidth: 480,
          textAlign: 'center',
          boxShadow: VT.shadowLg,
        }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: VT.ink }}>
            Доступ ограничен
          </h2>
          <p style={{ fontSize: 14, color: VT.muted, margin: '14px 0 24px', lineHeight: 1.6 }}>
            Вы авторизованы как <strong>Покупатель (User)</strong>. Панель вендора предназначена исключительно для зарегистрированных продавцов и цветочных салонов.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <a
              href="/"
              style={{
                padding: '11px 20px',
                borderRadius: VT.radius,
                border: 'none',
                background: VT.primary,
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              ← На витрину покупок
            </a>
            <button
              onClick={handleSignOut}
              style={{
                padding: '11px 18px',
                borderRadius: VT.radius,
                border: `1px solid ${VT.border}`,
                background: VT.surfaceAlt,
                color: VT.ink,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Сменить аккаунт
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── BLOCKED VENDOR CHECK ──────────────────────────────────────────
  if (vendor && vendor.status === 'blocked') {
    return (
      <div style={{
        minHeight: '100dvh',
        background: VT.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'Manrope, sans-serif',
      }}>
        <div style={{
          background: VT.surface,
          borderRadius: VT.radiusLg,
          border: `1px solid ${VT.border}`,
          padding: '40px 32px',
          maxWidth: 480,
          textAlign: 'center',
          boxShadow: VT.shadowLg,
        }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: VT.danger }}>
            Магазин временно приостановлен
          </h2>
          <p style={{ fontSize: 14, color: VT.muted, margin: '12px 0 24px', lineHeight: 1.6 }}>
            Доступ к публикации букетов магазина «{vendor.name}» был временно ограничен главным администратором маркетплейса Flowo.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={handleSignOut}
              style={{
                padding: '10px 18px',
                borderRadius: VT.radius,
                border: `1px solid ${VT.border}`,
                background: VT.surfaceAlt,
                color: VT.ink,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Выйти из аккаунта
            </button>
            <a
              href="/"
              style={{
                padding: '10px 18px',
                borderRadius: VT.radius,
                border: 'none',
                background: VT.primary,
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              На главную витрину
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── AUTHORIZED VENDOR INTERFACE ───────────────────────────────────
  return (
    <VendorShell
      screen={screen}
      onGoScreen={setScreen}
      vendor={vendor}
      onSignOut={handleSignOut}
    >
      {screen === 'dashboard' && (
        <VendorDashboard
          vendor={vendor}
          products={products}
          onGoScreen={setScreen}
          onAddProduct={handleAddProductQuick}
        />
      )}

      {screen === 'products' && (
        <VendorProducts
          vendor={vendor}
          products={products}
          setProducts={setProducts}
          initialModalOpen={openAddModalTrigger}
          onCloseInitialModal={() => setOpenAddModalTrigger(false)}
        />
      )}

      {screen === 'settings' && (
        <VendorStoreSettings
          vendor={vendor}
          onVendorUpdated={(updated) => setVendor(updated)}
        />
      )}
    </VendorShell>
  );
}
