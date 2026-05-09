import React from 'react';
import { useTheme } from '../../shared/theme.jsx';

export function PromoBanner({ b, onClick, height = 140 }) {
  const t = useTheme();
  const palette = {
    primary: { bg: t.primary, ink: '#FFFFFF', accent: t.accent },
    accent:  { bg: t.accent,  ink: '#1A0A14', accent: t.primary },
    orange:  { bg: t.accent2, ink: '#FFFFFF', accent: t.accent },
  }[b.accent || 'primary'];
  return (
    <div onClick={onClick} style={{
      height, borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden',
      background: palette.bg, color: palette.ink, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85 }}>{b.kicker}</div>
        <div style={{ fontSize: 20, fontWeight: 900, marginTop: 6, letterSpacing: '-0.01em', lineHeight: 1.15, maxWidth: '70%' }}>{b.title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>{b.sub}</div>
        <div style={{
          padding: '6px 12px', borderRadius: 999,
          background: palette.accent, color: '#1A0A14',
          fontSize: 12, fontWeight: 800,
        }}>{b.cta} →</div>
      </div>
      <svg style={{ position: 'absolute', right: -30, top: -30, opacity: 0.2 }} width="180" height="180" viewBox="0 0 100 100">
        <path fill={palette.accent} d="M50 0 Q70 20 100 30 Q90 60 100 100 Q60 90 30 100 Q40 60 0 50 Q30 40 50 0 Z" />
      </svg>
    </div>
  );
}
