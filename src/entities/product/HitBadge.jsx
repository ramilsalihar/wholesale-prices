import React from 'react';
import { useTheme } from '../../shared/theme.jsx';
import { Icon } from '../../shared/ui/Icon.jsx';

export function HitBadge({ style }) {
  const t = useTheme();
  return (
    <div style={{
      background: t.accent, color: '#1A0A14',
      padding: '3px 8px', borderRadius: 6, fontWeight: 800, fontSize: 11,
      letterSpacing: '0.04em', textTransform: 'uppercase',
      display: 'inline-flex', alignItems: 'center', gap: 4, ...style,
    }}>
      {Icon.flame()} ХИТ
    </div>
  );
}
