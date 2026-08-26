import React from 'react';
import { useTheme } from '../../shared/theme.jsx';

export function PromoBanner({ b, onClick, height = 140 }) {
  const t = useTheme();
  if (!b) return null;
  return (
    <div onClick={onClick} style={{
      height, borderRadius: 4, padding: 20, position: 'relative', overflow: 'hidden',
      background: t.surface, border: `1px solid ${t.border}`, color: t.ink, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.primaryDark }}>{b.kicker}</div>
        <div style={{
          fontSize: 22, fontWeight: 600, marginTop: 6, letterSpacing: '-0.01em', lineHeight: 1.15,
          maxWidth: '70%', color: t.ink, fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}>{b.title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 12, color: t.muted, fontWeight: 400 }}>{b.sub}</div>
        <div style={{
          padding: '6px 12px', borderRadius: 4, border: `1.5px solid ${t.primary}`,
          color: t.primary, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
        }}>{b.cta} →</div>
      </div>
      <svg style={{ position: 'absolute', right: -20, top: -20, opacity: 0.5 }} width="140" height="140" viewBox="0 0 100 100">
        <path fill="none" stroke={t.border} strokeWidth="1" d="M50 0 Q70 20 100 30 Q90 60 100 100 Q60 90 30 100 Q40 60 0 50 Q30 40 50 0 Z" />
      </svg>
    </div>
  );
}
