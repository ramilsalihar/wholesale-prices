import React from 'react';
import { useTheme } from '../../shared/theme.jsx';

export function DiscountBadge({ pct, style }) {
  const t = useTheme();
  return (
    <div style={{
      background: t.discountBg, color: t.discountInk,
      padding: '3px 8px', borderRadius: 6, fontWeight: 800, fontSize: 12,
      letterSpacing: '0.02em', whiteSpace: 'nowrap', ...style,
    }}>−{pct}%</div>
  );
}
