import React from 'react';
import { useTheme } from '../theme.jsx';

export function Button({ onClick, children, variant = 'primary', size = 'md', block = false, icon, style = {} }) {
  const t = useTheme();
  const base = {
    border: 'none', cursor: 'pointer', fontWeight: 700, letterSpacing: '0.01em',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'inherit', transition: 'transform .06s, box-shadow .12s, filter .12s',
    width: block ? '100%' : 'auto', whiteSpace: 'nowrap',
  };
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 13, borderRadius: 8 },
    md: { padding: '12px 20px', fontSize: 14, borderRadius: 10 },
    lg: { padding: '16px 28px', fontSize: 16, borderRadius: 12 },
  };
  const variants = {
    primary: { background: t.btnBg, color: t.btnInk },
    accent:  { background: t.accent, color: '#1A0A14' },
    ghost:   { background: 'transparent', color: t.ink, boxShadow: `inset 0 0 0 1.5px ${t.border}` },
    light:   { background: t.surfaceAlt, color: t.ink },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
      onMouseUp={(e) => e.currentTarget.style.transform = ''}
      onMouseLeave={(e) => e.currentTarget.style.transform = ''}
    >
      {icon}{children}
    </button>
  );
}
