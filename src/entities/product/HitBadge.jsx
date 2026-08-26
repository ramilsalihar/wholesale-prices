import React from 'react';
import { useTheme } from '../../shared/theme.jsx';
import { Icon } from '../../shared/ui/Icon.jsx';

export function HitBadge({ style }) {
  const t = useTheme();
  return (
    <div style={{
      background: t.discountBg, color: t.discountInk,
      padding: '3px 8px', borderRadius: 4, fontWeight: 600, fontSize: 11,
      letterSpacing: '0.04em', textTransform: 'uppercase',
      display: 'inline-flex', alignItems: 'center', gap: 4, ...style,
    }}>
      {Icon.flame({ width: 12, height: 12 })} ХИТ
    </div>
  );
}
