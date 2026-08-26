import React from 'react';
import { useTheme } from '../theme.jsx';

// Outline-first per commands/styles/redesign-spec.md §5 — no solid accent
// fills. Hover/press/focus are themed in JS since inline style objects can't
// express :hover/:focus-visible.
export function Button({ onClick, children, variant = 'primary', size = 'md', block = false, icon, style = {} }) {
  const t = useTheme();
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const base = {
    cursor: 'pointer', fontWeight: 600, letterSpacing: '0.01em',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'inherit', borderRadius: 4,
    transition: 'transform .06s, background .12s, border-color .12s, color .12s, box-shadow .12s',
    width: block ? '100%' : 'auto', whiteSpace: 'nowrap',
  };
  const sizes = {
    sm: { padding: '8px 16px', fontSize: 13 },
    md: { padding: '12px 24px', fontSize: 14 },
    lg: { padding: '16px 32px', fontSize: 16 },
  };

  const variants = {
    // Outline accent — the primary action, never filled.
    primary: {
      background: hover || pressed ? t.discountBg : 'transparent',
      color: pressed ? t.primaryDark : t.btnInk,
      border: `1.5px solid ${pressed ? t.primaryDark : t.btnBorder}`,
    },
    // Tonal — a light accent tint, not a solid accent fill.
    accent: {
      background: pressed ? t.discountBg : (hover ? t.surfaceAlt : t.discountBg),
      color: t.primaryDark,
      border: '1.5px solid transparent',
    },
    // Quiet hairline action.
    ghost: {
      background: 'transparent',
      color: t.ink,
      border: `1.5px solid ${hover || pressed ? t.primary : t.border}`,
    },
    // Lowest-emphasis chrome.
    light: {
      background: t.surfaceAlt,
      color: t.ink,
      border: `1.5px solid ${hover ? t.border : 'transparent'}`,
    },
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={(e) => { setPressed(true); e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={(e) => { setPressed(false); e.currentTarget.style.transform = ''; }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...base, ...sizes[size], ...variants[variant],
        boxShadow: focused ? `0 0 0 2px ${t.bg}, 0 0 0 4px ${t.primary}` : 'none',
        ...style,
      }}
    >
      {icon}{children}
    </button>
  );
}
