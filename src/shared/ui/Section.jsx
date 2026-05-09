import React from 'react';
import { useTheme } from '../theme.jsx';

export function Section({ title, sub, children, device, onSeeAll }) {
  const t = useTheme();
  const isDesk = device === 'desktop';
  return (
    <div style={{ marginTop: isDesk ? 36 : 20 }}>
      <div style={{ padding: isDesk ? '0 40px 14px' : '0 16px 10px',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: isDesk ? 28 : 20, fontWeight: 900, color: t.ink,
            letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</div>
          {sub && <div style={{ fontSize: isDesk ? 14 : 12, color: t.muted, marginTop: 4, fontWeight: 500 }}>{sub}</div>}
        </div>
        {onSeeAll && (
          <button onClick={onSeeAll} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: t.primary, fontWeight: 800, fontSize: isDesk ? 14 : 13, whiteSpace: 'nowrap',
          }}>смотреть все →</button>
        )}
      </div>
      {children}
    </div>
  );
}

export function Carousel({ children, device }) {
  const isDesk = device === 'desktop';
  return (
    <div style={{
      display: 'flex', gap: isDesk ? 16 : 10,
      overflowX: 'auto', scrollbarWidth: 'none',
      padding: isDesk ? '0 40px' : '0 16px',
      scrollSnapType: 'x mandatory',
    }}>
      {React.Children.map(children, (c, i) => (
        <div key={i} style={{ scrollSnapAlign: 'start' }}>{c}</div>
      ))}
    </div>
  );
}
