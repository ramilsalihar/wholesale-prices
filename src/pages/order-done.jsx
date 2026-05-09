import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { Button } from '../shared/ui/Button.jsx';

export function OrderDoneScreen() {
  const t = useTheme();
  const router = useRouter();
  const orderNo = React.useMemo(() => '#' + Math.floor(100000 + Math.random() * 900000), []);
  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%',
      padding: '40px 24px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: t.primary, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' }}>Заказ оформлен!</div>
      <div style={{ fontSize: 15, color: t.muted, maxWidth: 380, lineHeight: 1.5 }}>
        Заказ <b style={{ color: t.ink }}>{orderNo}</b> принят. Мы прислали детали на телефон и e-mail. Курьер свяжется с вами завтра до 12:00.
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Button onClick={() => router.go({ screen: 'home' })}>На главную</Button>
        <Button variant="ghost" onClick={() => router.go({ screen: 'home' })}>Мои заказы</Button>
      </div>
    </div>
  );
}
