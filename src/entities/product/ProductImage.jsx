import React from 'react';

export function ProductImage({ p, padding = 20 }) {
  const [h, s, l] = p?.hue ?? [300, 50, 75];
  const tint = `hsl(${h}, ${s}%, ${l}%)`;
  const tintDark = `hsl(${h}, ${Math.min(s + 5, 100)}%, ${Math.max(l - 25, 25)}%)`;
  const bgFar = `hsl(${h}, ${Math.max(s - 30, 20)}%, 96%)`;
  const bgNear = `hsl(${h}, ${Math.max(s - 20, 25)}%, 90%)`;

  const Bottle = () => (
    <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%' }}>
      <rect x="42" y="6" width="16" height="14" rx="2" fill={tintDark} />
      <path d="M30 28 Q50 22 70 28 L72 130 Q50 138 28 130 Z" fill={tint} />
      <rect x="32" y="58" width="36" height="32" rx="4" fill="white" opacity="0.9" />
      <text x="50" y="76" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="800" fill={tintDark}>{p.brand.split(' ')[0].toUpperCase()}</text>
      <text x="50" y="86" textAnchor="middle" fontFamily="system-ui" fontSize="6" fill={tintDark}>{p.vol}</text>
      <ellipse cx="40" cy="38" rx="6" ry="14" fill="white" opacity="0.25" />
    </svg>
  );
  const Jar = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="50" cy="22" rx="34" ry="6" fill={tintDark} />
      <rect x="16" y="22" width="68" height="60" fill={tint} />
      <ellipse cx="50" cy="82" rx="34" ry="6" fill={tintDark} opacity="0.6" />
      <rect x="22" y="38" width="56" height="32" rx="3" fill="white" opacity="0.92" />
      <text x="50" y="56" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="800" fill={tintDark}>{p.brand.split(' ')[0].toUpperCase()}</text>
      <text x="50" y="66" textAnchor="middle" fontFamily="system-ui" fontSize="6" fill={tintDark}>{p.vol}</text>
      <ellipse cx="32" cy="34" rx="8" ry="3" fill="white" opacity="0.4" />
    </svg>
  );
  const Tube = () => (
    <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%' }}>
      <path d="M30 14 Q50 6 70 14 L66 124 Q50 132 34 124 Z" fill={tint} />
      <rect x="34" y="124" width="32" height="8" fill={tintDark} />
      <rect x="38" y="40" width="24" height="60" rx="2" fill="white" opacity="0.92" />
      <text x="50" y="62" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="800" fill={tintDark}>{p.brand.split(' ')[0].toUpperCase()}</text>
      <text x="50" y="74" textAnchor="middle" fontFamily="system-ui" fontSize="5" fill={tintDark}>{p.vol}</text>
      <ellipse cx="40" cy="34" rx="4" ry="14" fill="white" opacity="0.3" />
    </svg>
  );
  const Lipstick = () => (
    <svg viewBox="0 0 80 140" style={{ width: '100%', height: '100%' }}>
      <path d="M28 10 L52 10 L48 50 L32 50 Z" fill={tintDark} />
      <rect x="22" y="50" width="36" height="14" fill="#222" />
      <rect x="20" y="64" width="40" height="68" rx="3" fill={tint} />
      <rect x="24" y="80" width="32" height="32" rx="2" fill="white" opacity="0.9" />
      <text x="40" y="96" textAnchor="middle" fontFamily="system-ui" fontSize="7" fontWeight="800" fill={tintDark}>{p.brand.split(' ')[0].toUpperCase()}</text>
      <text x="40" y="106" textAnchor="middle" fontFamily="system-ui" fontSize="5" fill={tintDark}>№643</text>
      <ellipse cx="28" cy="80" rx="3" ry="20" fill="white" opacity="0.3" />
    </svg>
  );
  const Flask = () => (
    <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%' }}>
      <rect x="42" y="6" width="16" height="20" rx="1" fill="#333" />
      <path d="M22 28 L78 28 L82 130 Q50 138 18 130 Z" fill={tint} stroke={tintDark} strokeWidth="1.5" />
      <rect x="30" y="60" width="40" height="36" rx="2" fill="white" opacity="0.95" />
      <text x="50" y="78" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="800" fill={tintDark}>{p.brand.toUpperCase()}</text>
      <text x="50" y="88" textAnchor="middle" fontFamily="system-ui" fontSize="5" fill={tintDark}>{p.vol}</text>
      <rect x="36" y="36" width="6" height="60" fill="white" opacity="0.35" />
    </svg>
  );
  const Stick = () => (
    <svg viewBox="0 0 80 140" style={{ width: '100%', height: '100%' }}>
      <rect x="20" y="6" width="40" height="14" rx="2" fill={tintDark} />
      <rect x="16" y="20" width="48" height="112" rx="6" fill={tint} />
      <rect x="22" y="50" width="36" height="42" rx="2" fill="white" opacity="0.95" />
      <text x="40" y="70" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="800" fill={tintDark}>{p.brand.toUpperCase()}</text>
      <text x="40" y="82" textAnchor="middle" fontFamily="system-ui" fontSize="5" fill={tintDark}>{p.vol}</text>
    </svg>
  );
  const Palette = () => (
    <svg viewBox="0 0 140 100" style={{ width: '100%', height: '100%' }}>
      <rect x="6" y="14" width="128" height="76" rx="6" fill="#1a1a1a" />
      <rect x="6" y="6" width="128" height="14" rx="6" fill={tintDark} />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={20 + (i % 6) * 18} cy={36 + Math.floor(i / 6) * 22} r="7"
          fill={`hsl(${(h + i * 30) % 360}, 70%, ${50 + (i % 3) * 10}%)`} />
      ))}
    </svg>
  );
  const Bar = () => (
    <svg viewBox="0 0 120 100" style={{ width: '100%', height: '100%' }}>
      <rect x="12" y="20" width="96" height="60" rx="10" fill={tint} />
      <rect x="20" y="32" width="80" height="36" rx="4" fill="white" opacity="0.9" />
      <text x="60" y="52" textAnchor="middle" fontFamily="system-ui" fontSize="11" fontWeight="800" fill={tintDark}>{p.brand.toUpperCase()}</text>
      <text x="60" y="64" textAnchor="middle" fontFamily="system-ui" fontSize="6" fill={tintDark}>{p.vol}</text>
    </svg>
  );
  const Spray = () => (
    <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%' }}>
      <rect x="38" y="6" width="24" height="10" fill="#333" />
      <rect x="34" y="16" width="32" height="6" fill={tintDark} />
      <rect x="22" y="22" width="56" height="110" rx="3" fill={tint} />
      <rect x="28" y="50" width="44" height="44" rx="2" fill="white" opacity="0.92" />
      <text x="50" y="70" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="800" fill={tintDark}>{p.brand.toUpperCase()}</text>
      <text x="50" y="82" textAnchor="middle" fontFamily="system-ui" fontSize="5" fill={tintDark}>{p.vol}</text>
    </svg>
  );
  const Pencil = () => (
    <svg viewBox="0 0 60 160" style={{ width: '100%', height: '100%' }}>
      <path d="M20 6 L40 6 L36 18 L24 18 Z" fill="#333" />
      <rect x="18" y="18" width="24" height="120" fill={tint} />
      <rect x="20" y="60" width="20" height="40" fill="white" opacity="0.9" />
      <text x="30" y="80" textAnchor="middle" fontFamily="system-ui" fontSize="6" fontWeight="800" fill={tintDark}>{p.brand.toUpperCase()}</text>
      <path d="M18 138 L42 138 L30 156 Z" fill={tintDark} />
    </svg>
  );

  const ShapeComp = {
    bottle: Bottle, jar: Jar, tube: Tube, lipstick: Lipstick, flask: Flask,
    stick: Stick, palette: Palette, bar: Bar, spray: Spray, pencil: Pencil,
  }[p.shape] || Bottle;

  return (
    <div style={{
      width: '100%', aspectRatio: '1 / 1',
      background: `radial-gradient(circle at 30% 20%, ${bgFar}, ${bgNear})`,
      borderRadius: 12, position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: `calc(100% - ${padding * 2}px)`, height: `calc(100% - ${padding * 2}px)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ShapeComp />
      </div>
    </div>
  );
}
