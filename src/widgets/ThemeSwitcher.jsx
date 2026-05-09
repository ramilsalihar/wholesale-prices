import React from 'react';

export const SWATCHES = [
  { key: 'magnit',   dot: '#E6097A' },
  { key: 'noir',     dot: '#0A0A0A' },
  { key: 'boutique', dot: '#FAF7F4', outline: true },
];

export function ThemeSwitcher({ themeKey, setThemeKey }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {SWATCHES.map((s) => (
        <button key={s.key} title={s.key} onClick={() => setThemeKey(s.key)} style={{
          width: 20, height: 20, borderRadius: '50%', border: 'none',
          cursor: 'pointer', padding: 0, background: s.dot, flexShrink: 0,
          boxShadow: s.key === themeKey
            ? '0 0 0 2px #fff, 0 0 0 4px #E6097A'
            : s.outline ? 'inset 0 0 0 1.5px rgba(0,0,0,0.18)' : 'none',
        }} />
      ))}
    </div>
  );
}
