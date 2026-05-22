import React from 'react';

function PlaceholderIcon() {
  return (
    <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

export function ProductImage({ p, padding = 20, radius = 12, src }) {
  const imgSrc = src ?? p?.image_url;

  return (
    <div style={{
      width: '100%', aspectRatio: '1 / 1',
      background: '#F2F2F2',
      borderRadius: radius, overflow: 'hidden',
      position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={p?.name}
          style={{
            position: 'absolute',
            top: 0, right: 0, bottom: 0, left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
      ) : (
        <PlaceholderIcon />
      )}
    </div>
  );
}
