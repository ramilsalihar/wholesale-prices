import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';
import { AdminSidebar } from './AdminSidebar.jsx';
import { AdminTopBar } from './AdminTopBar.jsx';

function useMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

export function AdminShell({ screen, go, session, onSignOut, children }) {
  const mobile = useMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleGo(s) {
    go(s);
    if (mobile) setDrawerOpen(false);
  }

  return (
    <div style={{ minHeight: '100dvh', background: AT.bg, fontFamily: 'Manrope, sans-serif' }}>
      <AdminTopBar
        screen={screen}
        session={session}
        onSignOut={onSignOut}
        mobile={mobile}
        drawerOpen={drawerOpen}
        onToggleDrawer={() => setDrawerOpen(v => !v)}
      />

      {mobile && drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 15,
          }}
        />
      )}

      <AdminSidebar
        screen={screen}
        go={handleGo}
        mobile={mobile}
        drawerOpen={drawerOpen}
      />

      <main style={{
        marginLeft: mobile ? 0 : AT.sidebarW,
        paddingTop: AT.topbarH,
        minHeight: '100dvh',
      }}>
        <div style={{ padding: mobile ? 16 : 32 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
