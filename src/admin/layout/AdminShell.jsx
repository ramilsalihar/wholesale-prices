import React from 'react';
import { AT } from '../adminTheme.js';
import { AdminSidebar } from './AdminSidebar.jsx';
import { AdminTopBar } from './AdminTopBar.jsx';

export function AdminShell({ screen, go, session, onSignOut, children }) {
  return (
    <div style={{ minHeight: '100dvh', background: AT.bg, fontFamily: 'Manrope, sans-serif' }}>
      <AdminTopBar screen={screen} session={session} onSignOut={onSignOut} />
      <AdminSidebar screen={screen} go={go} />
      <main style={{
        marginLeft: AT.sidebarW,
        paddingTop: AT.topbarH,
        minHeight: '100dvh',
      }}>
        <div style={{ padding: 32 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
