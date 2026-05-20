import React, { useEffect } from 'react';
import { AT } from '../adminTheme.js';

let injected = false;
function injectKeyframes() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const el = document.createElement('style');
  el.textContent = `@keyframes sk-shine{0%{background-position:200% center}100%{background-position:-200% center}}`;
  document.head.appendChild(el);
}

export function Bone({ w = '100%', h = 16, r = AT.radius, style = {} }) {
  injectKeyframes();
  return (
    <div style={{
      width: w, height: h, borderRadius: r, flexShrink: 0,
      background: `linear-gradient(90deg, ${AT.surfaceAlt} 25%, ${AT.border} 50%, ${AT.surfaceAlt} 75%)`,
      backgroundSize: '400% 100%',
      animation: 'sk-shine 1.4s ease-in-out infinite',
      ...style,
    }} />
  );
}

// ── Table skeleton (Categories, Brands) ─────────────────────────

export function TableRowSkeleton({ cols }) {
  return (
    <tr>
      {cols.map((c, i) => (
        <td key={i} style={{ padding: '13px 16px' }}>
          <Bone w={c.w ?? '80%'} h={c.h ?? 14} r={c.r ?? AT.radius} />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 6, cols }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </tbody>
  );
}

// ── Products table skeleton ──────────────────────────────────────

export function ProductsTableSkeleton({ rows = 7 }) {
  return (
    <TableSkeleton rows={rows} cols={[
      { w: 40, h: 40, r: 8 },    // thumbnail
      { w: '55%' },               // name
      { w: '70%' },               // category
      { w: 60 },                  // price
      { w: 64, h: 22, r: 999 },  // status badge
      { w: 80 },                  // actions placeholder
    ]} />
  );
}

// ── Orders table skeleton ────────────────────────────────────────

export function OrdersTableSkeleton({ rows = 8 }) {
  return (
    <TableSkeleton rows={rows} cols={[
      { w: 80, h: 13 },           // order id
      { w: 90, h: 11 },           // date
      { w: '50%' },               // customer
      { w: 110 },                 // phone
      { w: 24 },                  // items count
      { w: 70 },                  // total
      { w: 80, h: 22, r: 999 },  // status badge
    ]} />
  );
}

// ── Brands card grid skeleton ────────────────────────────────────

export function BrandsTableSkeleton({ rows = 8 }) {
  return (
    <TableSkeleton rows={rows} cols={[
      { w: 36, h: 36, r: 8 },   // avatar
      { w: '50%' },              // name
      { w: 40 },                 // sort
      { w: 64, h: 22, r: 999 }, // status badge
      { w: 80 },                 // actions
    ]} />
  );
}

// ── Category table skeleton ──────────────────────────────────────

export function CategoriesTableSkeleton({ rows = 9 }) {
  return (
    <TableSkeleton rows={rows} cols={[
      { w: 32, h: 32, r: 6 },   // emoji placeholder
      { w: 60 },                 // id
      { w: '55%' },              // name
      { w: 24 },                 // sort
      { w: 100 },                // actions
    ]} />
  );
}

// ── Banner card list skeleton ────────────────────────────────────

function BannerCardSkeleton() {
  return (
    <div style={{
      background: AT.surface, border: `1px solid ${AT.border}`,
      borderRadius: AT.radiusLg, overflow: 'hidden',
      display: 'flex', gap: 0,
    }}>
      <Bone w={280} h={120} r={0} />
      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bone w="60%" h={14} />
        <Bone w="40%" h={11} />
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <Bone w={70} h={28} r={AT.radius} />
          <Bone w={70} h={28} r={AT.radius} />
        </div>
      </div>
    </div>
  );
}

export function BannersSkeleton({ count = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {Array.from({ length: count }).map((_, i) => <BannerCardSkeleton key={i} />)}
    </div>
  );
}

// ── Store card grid skeleton ─────────────────────────────────────

function StoreCardSkeleton() {
  return (
    <div style={{
      background: AT.surface, border: `1px solid ${AT.border}`,
      borderRadius: AT.radiusLg, overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px 14px', borderBottom: `1px solid ${AT.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Bone w={44} h={44} r={10} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Bone w="65%" h={14} />
          <Bone w="40%" h={11} />
        </div>
      </div>
      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bone w="80%" h={13} />
        <Bone w="45%" h={13} />
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <Bone w={70} h={28} r={AT.radius} />
          <Bone w={70} h={28} r={AT.radius} />
        </div>
      </div>
    </div>
  );
}

export function StoresSkeleton({ count = 4 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => <StoreCardSkeleton key={i} />)}
    </div>
  );
}

// ── Settings skeleton ────────────────────────────────────────────

function SettingsCard({ rows = 2 }) {
  return (
    <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 24 }}>
      <Bone w={100} h={13} style={{ marginBottom: 18 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Bone w={80} h={10} />
            <Bone w="100%" h={36} r={AT.radius} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SettingsCard rows={2} />
        <SettingsCard rows={3} />
      </div>
      <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: 24 }}>
        <Bone w={120} h={13} style={{ marginBottom: 18 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map(i => <Bone key={i} w="100%" h={52} r={AT.radius} />)}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard skeleton ───────────────────────────────────────────

export function DashboardSkeleton() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Bone w={100} h={11} />
            <Bone w={80} h={32} />
            <Bone w={120} h={11} />
          </div>
        ))}
      </div>
      <Bone w={120} h={16} style={{ marginBottom: 16 }} />
      <div style={{ background: AT.surface, border: `1px solid ${AT.border}`, borderRadius: AT.radiusLg, overflow: 'hidden' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ display: 'flex', gap: 24, padding: '13px 16px', borderBottom: `1px solid ${AT.border}` }}>
            <Bone w={80} h={13} />
            <Bone w={90} h={13} />
            <Bone w={110} h={13} />
            <Bone w={60} h={13} />
            <Bone w={64} h={22} r={999} />
          </div>
        ))}
      </div>
    </div>
  );
}
