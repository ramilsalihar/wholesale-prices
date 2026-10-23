import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSession, onAuthStateChange, signOut as _signOut } from '../service/auth.js';
import { fetchUserRole } from '../service/vendors.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [ready, setReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function resolveRole(u) {
    if (!u) {
      setRole(null);
      return;
    }
    // Instant metadata role check (shows correct role before DB responds)
    const metaRole = u.user_metadata?.role;
    if (metaRole) {
      setRole(metaRole);
    }
    // Verify from DB profiles — but don't downgrade an elevated metadata role
    // (handles the case where the profiles row doesn't exist yet or migration hasn't run)
    try {
      const dbRole = await fetchUserRole(u.id);
      if (dbRole && dbRole !== 'user') {
        // DB explicitly says vendor/admin — always trust that
        setRole(dbRole);
      } else if (!metaRole || metaRole === 'user') {
        // No special metadata role → fall back to whatever DB says (or 'user')
        setRole(dbRole || 'user');
      }
      // If metaRole is 'vendor'/'admin' but DB says 'user' → keep metaRole (profiles row may not exist yet)
    } catch {
      if (!metaRole) setRole('user');
    }
  }

  useEffect(() => {
    getSession().then(s => {
      setSession(s);
      const u = s?.user ?? null;
      setUser(u);
      resolveRole(u).finally(() => setReady(true));
    });

    const { data: { subscription } } = onAuthStateChange(s => {
      setSession(s);
      const u = s?.user ?? null;
      setUser(u);
      resolveRole(u);
      if (s) setModalOpen(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await _signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  }

  const isVendor = role === 'vendor';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      session,
      role,
      isVendor,
      isAdmin,
      ready,
      modalOpen,
      openLogin: () => setModalOpen(true),
      closeLogin: () => setModalOpen(false),
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
