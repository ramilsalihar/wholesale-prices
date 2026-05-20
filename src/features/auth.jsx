import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSession, onAuthStateChange, signOut as _signOut } from '../service/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getSession().then(s => {
      setSession(s);
      setUser(s?.user ?? null);
      setReady(true);
    });

    const { data: { subscription } } = onAuthStateChange(s => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s) setModalOpen(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await _signOut();
    setUser(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
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
