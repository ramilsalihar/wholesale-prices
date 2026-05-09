import React from 'react';
import { useTheme } from '../../shared/theme.jsx';
import { fmtRub } from './model.js';

export function PriceTag({ price, old, big = false, size = 'md' }) {
  const t = useTheme();
  const fs = big ? 28 : (size === 'lg' ? 22 : 16);
  const oldFs = big ? 14 : (size === 'lg' ? 12 : 11);
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
      <span style={{ fontWeight: 900, fontSize: fs, color: t.primary, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
        {fmtRub(price)}
      </span>
      {old && old > price && (
        <span style={{ fontSize: oldFs, color: t.muted, textDecoration: 'line-through', fontWeight: 500 }}>
          {fmtRub(old)}
        </span>
      )}
    </div>
  );
}
