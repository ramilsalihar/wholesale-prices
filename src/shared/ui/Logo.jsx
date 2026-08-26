import React from 'react';

const RED = '#E5231B';
const CREAM = '#FAF3E8';

export function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', flexShrink: 0 }}>
      <rect x="0" y="0" width="100" height="100" fill={RED} />
      <g fill={CREAM}>
        <polygon points="50,20 58.5,28 50,36 41.5,28" />
        <polygon points="32,23 41.5,28 47,49 32,44" />
        <polygon points="68,23 58.5,28 53,49 68,44" />
        <rect x="47.5" y="52" width="5" height="27" />
        <polygon points="47.5,79 52.5,79 50,88" />
        <polygon points="28,58 47,63 49,83 28,76" />
        <polygon points="72,58 53,63 51,83 72,76" />
      </g>
    </svg>
  );
}
