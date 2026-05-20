import React from 'react';
import { useTheme } from '../theme.jsx';

export function Section({ title, sub, children, device, onSeeAll }) {
  const t = useTheme();
  const isDesk = device === 'desktop';
  return (
    <div style={{ marginTop: isDesk ? 36 : 20 }}>
      <div style={{ padding: isDesk ? '0 40px 14px' : '0 16px 10px',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: isDesk ? 28 : 20, fontWeight: 900, color: t.ink,
            letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</div>
          {sub && <div style={{ fontSize: isDesk ? 14 : 12, color: t.muted, marginTop: 4, fontWeight: 500 }}>{sub}</div>}
        </div>
        {onSeeAll && (
          <button onClick={onSeeAll} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: t.primary, fontWeight: 800, fontSize: isDesk ? 14 : 13, whiteSpace: 'nowrap',
          }}>смотреть все →</button>
        )}
      </div>
      {children}
    </div>
  );
}

export function Carousel({ children, device, autoScroll = false }) {
  const isDesk = device === 'desktop';
  const pad = isDesk ? 40 : 16;
  const gap = isDesk ? 16 : 10;
  const scrollRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const paused = React.useRef(false);
  const childArr = React.Children.toArray(children);

  React.useEffect(() => {
    if (!autoScroll || !scrollRef.current) return;
    const el = scrollRef.current;

    // Wait one frame so scrollWidth is measured after layout
    const startRaf = requestAnimationFrame(() => {
      const halfWidth = el.scrollWidth / 2;

      const tick = () => {
        if (!paused.current) {
          el.scrollLeft += 0.4;
          if (el.scrollLeft >= halfWidth) el.scrollLeft -= halfWidth;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    });

    const pause = () => { paused.current = true; };
    const resume = () => { paused.current = false; };
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume);

    return () => {
      cancelAnimationFrame(startRaf);
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
    };
  }, [autoScroll]);

  if (autoScroll) {
    return (
      <div
        ref={scrollRef}
        style={{
          display: 'flex', gap,
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          paddingBottom: 8,
        }}
      >
        {[...childArr, ...childArr].map((c, i) => (
          <div key={i} style={{ flexShrink: 0 }}>{c}</div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', gap,
      overflowX: 'auto', scrollbarWidth: 'none',
      scrollSnapType: 'x mandatory',
      paddingBottom: 8,
    }}>
      <div style={{ width: pad - gap, flexShrink: 0 }} />
      {childArr.map((c, i) => (
        <div key={i} style={{ scrollSnapAlign: 'start' }}>{c}</div>
      ))}
      <div style={{ width: pad - gap, flexShrink: 0 }} />
    </div>
  );
}
