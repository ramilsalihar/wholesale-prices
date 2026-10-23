import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import WebApp from './app/WebApp.jsx';
import AdminApp from './admin/AdminApp.jsx';
import VendorApp from './vendor/VendorApp.jsx';

const pathname = window.location.pathname;
const isAdmin = pathname.startsWith('/admin');
const isVendor = pathname.startsWith('/vendor');

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    {isAdmin ? (
      <AdminApp />
    ) : isVendor ? (
      <VendorApp />
    ) : (
      <WebApp />
    )}
    <Analytics />
  </>
);
