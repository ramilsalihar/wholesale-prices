import React from 'react';
import { useTheme } from '../theme.jsx';
import { Icon } from './Icon.jsx';

export function SearchField({ placeholder = 'Поиск косметики, брендов…', onFocus }) {
  const t = useTheme();
  return (
    <div onClick={onFocus} style={{
      background: t.surface, color: t.ink,
      borderRadius: 12, padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: `inset 0 0 0 1.5px ${t.border}`, cursor: 'text',
    }}>
      <span style={{ color: t.muted, display: 'flex' }}>{Icon.search()}</span>
      <span style={{ flex: 1, color: t.muted, fontSize: 14 }}>{placeholder}</span>
      <span style={{ color: t.primary, display: 'flex' }}>{Icon.filter()}</span>
    </div>
  );
}
