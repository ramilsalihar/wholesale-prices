import React from 'react';
import { useTheme } from '../../shared/theme.jsx';
import { fmtRub } from './model.js';

export function PriceTag({ price, old, big = false, size = 'md' }) {
  const t = useTheme();
  const fs = big ? 28 : (size === 'lg' ? 22 : 16);
  const oldFs = big ? 14 : (size === 'lg' ? 12 : 11);
  // Accent-on-ground is ~3:1 — enough for large display figures, not for
  // paragraph-size text (redesign-spec.md §2), so smaller sizes read in the
  // dark ramp step instead of the raw accent.
  const priceColor = fs >= 22 ? t.primary : t.primaryDark;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
      <span style={{
        fontWeight: 600, fontSize: fs, color: priceColor, letterSpacing: '-0.01em',
        whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
      }}>
        {fmtRub(price)}
      </span>
      {old && old > price && (
        <span style={{
          fontSize: oldFs, color: t.muted, textDecoration: 'line-through', fontWeight: 400,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {fmtRub(old)}
        </span>
      )}
    </div>
  );
}
