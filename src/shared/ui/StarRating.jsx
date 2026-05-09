import React from 'react';
import { useTheme } from '../theme.jsx';
import { Icon } from './Icon.jsx';

export function StarRating({ rating, reviews, compact = false }) {
  const t = useTheme();
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: t.accent2 }}>
      {Icon.star(true)}
      <span style={{ fontSize: compact ? 12 : 13, fontWeight: 700, color: t.ink }}>{rating}</span>
      {reviews != null && (
        <span style={{ fontSize: compact ? 11 : 12, color: t.muted, fontWeight: 500 }}>· {reviews}</span>
      )}
    </div>
  );
}
