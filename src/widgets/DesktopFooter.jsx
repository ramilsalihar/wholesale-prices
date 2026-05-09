import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { Logo } from '../shared/ui/Logo.jsx';

export function DesktopFooter() {
  const t = useTheme();
  return (
    <div style={{ background: t.headerBg, color: t.headerInk, padding: '40px 40px 24px', marginTop: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 32, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Logo size={48} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: '0.04em' }}>ОПТОВЫЕ ЦЕНЫ</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>выбор · косметика · доставка</div>
            </div>
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.6, maxWidth: 320 }}>
            Косметика и парфюмерия по оптовым ценам. Прямые поставки от производителей. 100% оригинал, гарантия качества.
          </div>
        </div>
        {[
          { h: 'Покупателям', l: ['Доставка и оплата', 'Возврат', 'Гарантия', 'Программа лояльности'] },
          { h: 'Компания',    l: ['О нас', 'Магазины', 'Вакансии', 'Контакты'] },
          { h: 'Контакты',    l: ['8 (312) 123-45-67', 'help@optcen.kg', 'Бишкек, пр. Чуй 12', 'пн-вс · 9:00–22:00'] },
        ].map((col) => (
          <div key={col.h}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.7 }}>{col.h}</div>
            {col.l.map((x) => <div key={x} style={{ fontSize: 13, opacity: 0.9, marginBottom: 6, cursor: 'pointer' }}>{x}</div>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 16, display: 'flex',
        justifyContent: 'space-between', fontSize: 12, opacity: 0.7 }}>
        <span>© 2026 Оптовые Цены 01. Все права защищены.</span>
        <span>Политика конфиденциальности · Оферта</span>
      </div>
    </div>
  );
}
