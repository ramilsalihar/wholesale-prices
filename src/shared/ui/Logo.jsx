export function Logo({ size = 40 }) {
  return (
    <img src="/assets/logo.png" alt="Оптовые цены" width={size} height={size}
      style={{ borderRadius: '50%', display: 'block', flexShrink: 0 }} />
  );
}
