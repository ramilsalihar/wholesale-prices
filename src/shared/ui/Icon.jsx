export const Icon = {
  search: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  ),
  cart: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 4h2l2.4 12.5a2 2 0 0 0 2 1.5h8.2a2 2 0 0 0 2-1.4L22 8H6" />
      <circle cx="9" cy="21" r="1.5" /><circle cx="18" cy="21" r="1.5" />
    </svg>
  ),
  user: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  ),
  heart: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20.8 5.6a5.5 5.5 0 0 0-8.8.7 5.5 5.5 0 0 0-8.8-.7 5.7 5.7 0 0 0 0 7.9L12 22.4l8.8-8.9a5.7 5.7 0 0 0 0-7.9z" />
    </svg>
  ),
  back: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  menu: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  ),
  star: (filled = true, p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...p}>
      <polygon points="12 2 15.1 8.6 22 9.5 17 14.4 18.2 21.4 12 18 5.8 21.4 7 14.4 2 9.5 8.9 8.6 12 2" />
    </svg>
  ),
  truck: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="1" y="6" width="13" height="11" rx="1" /><path d="M14 9h4l3 4v4h-7" />
      <circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" />
    </svg>
  ),
  shield: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5l-8-3z" />
    </svg>
  ),
  plus: (p = {}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}>
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  minus: (p = {}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  trash: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  check: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  filter: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="3 4 21 4 14 13 14 20 10 22 10 13 3 4" />
    </svg>
  ),
  flame: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2c1 4-2 5-2 8a4 4 0 0 0 8 0c0-1-.4-2-1-3 .5 4-3 5-3 2 0-2 2-3-2-7zM6 14a4 4 0 0 0 8 0c0-2-2-4-2-5-1 1-1 2-2 2-2 0-2-2-2-2-1 1-2 3-2 5z" />
    </svg>
  ),
};
