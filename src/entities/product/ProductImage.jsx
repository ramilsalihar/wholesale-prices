import React from 'react';

function DefaultPlaceholder() {
  return (
    <div style={{
      width: '100%', aspectRatio: '1 / 1',
      background: '#F0F0F0',
      borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="8" width="28" height="34" rx="4" fill="#C8C8C8" />
        <rect x="16" y="16" width="16" height="10" rx="2" fill="white" opacity="0.7" />
        <circle cx="24" cy="33" r="4" fill="white" opacity="0.5" />
      </svg>
    </div>
  );
}

export function ProductImage({ p, padding = 20, radius = 12, src }) {
  const imgSrc = src ?? p?.image_url;

  if (!imgSrc) {
    return <DefaultPlaceholder />;
  }

  return (
    <div style={{
      width: '100%', aspectRatio: '1 / 1',
      background: '#F8F8F8',
      borderRadius: radius, overflow: 'hidden',
      position: 'relative',
    }}>
      <img
        src={imgSrc}
        alt={p?.name}
        style={{
          position: 'absolute',
          top: padding, right: padding, bottom: padding, left: padding,
          width: `calc(100% - ${padding * 2}px)`,
          height: `calc(100% - ${padding * 2}px)`,
          objectFit: 'contain',
        }}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
  );
}
