import React from 'react';
import ReactDOM from 'react-dom/client';
import WebApp from './app/WebApp.jsx';
import AdminApp from './admin/AdminApp.jsx';

const isAdmin = window.location.pathname.startsWith('/admin');

ReactDOM.createRoot(document.getElementById('root')).render(
  isAdmin ? <AdminApp /> : <WebApp />
);
