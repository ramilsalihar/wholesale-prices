import React, { useState, useEffect } from 'react';
import { AT } from '../adminTheme.js';

function useMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

function StatCard({ label, value, sub, color, mobile }) {
  return (
    <div style={{
      background: AT.surface,
      border: `1px solid ${AT.border}`,
      borderRadius: AT.radiusLg,
      padding: mobile ? '14px 16px' : '20px 24px',
    }}>
      <div style={{ fontSize: mobile ? 10 : 13, fontWeight: 600, color: AT.muted, letterSpacing: '0.02em', marginBottom: mobile ? 6 : 10 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: mobile ? 24 : 32, fontWeight: 800, color: color ?? AT.ink, letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: AT.muted, marginTop: 6, fontWeight: 500 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontSize: 16,
      fontWeight: 700,
      color: AT.ink,
      margin: '32px 0 16px',
      letterSpacing: '-0.01em',
    }}>
      {children}
    </h2>
  );
}

export function Dashboard() {
  const mobile = useMobile();
  return (
    <div>
      <h1 style={{ fontSize: mobile ? 18 : 22, fontWeight: 800, color: AT.ink, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
        Дашборд
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: mobile ? 12 : 16 }}>
        <StatCard label="Заказы сегодня" value="—" sub="Подключите orders" mobile={mobile} />
        <StatCard label="Выручка сегодня" value="—" sub="Подключите orders" color={AT.success} mobile={mobile} />
        <StatCard label="Новые заказы" value="—" sub="Ожидают подтверждения" color={AT.warning} mobile={mobile} />
        <StatCard label="Всего товаров" value="23" sub="Статичная модель" color={AT.primary} mobile={mobile} />
      </div>

      <SectionHeading>Последние заказы</SectionHeading>

      <div style={{
        background: AT.surface,
        border: `1px solid ${AT.border}`,
        borderRadius: AT.radiusLg,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Manrope, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${AT.border}`, background: AT.surfaceAlt }}>
              {['ID заказа', 'Дата', 'Телефон', 'Итого', 'Статус'].map(h => (
                <th key={h} style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  fontSize: 12,
                  fontWeight: 700,
                  color: AT.muted,
                  letterSpacing: '0.04em',
                }}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} style={{
                padding: '40px 16px',
                textAlign: 'center',
                fontSize: 14,
                color: AT.muted,
                fontWeight: 500,
              }}>
                Заказы появятся после подключения таблицы orders в Supabase
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeading>Быстрые действия</SectionHeading>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Добавить товар', phase: 'Phase 3' },
          { label: 'Управление заказами', phase: 'Phase 2' },
          { label: 'Редактировать баннеры', phase: 'Phase 4' },
          { label: 'Категории', phase: 'Phase 4' },
        ].map(({ label, phase }) => (
          <div key={label} style={{
            background: AT.surface,
            border: `1px solid ${AT.border}`,
            borderRadius: AT.radius,
            padding: '14px 18px',
            cursor: 'default',
            opacity: 0.6,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: AT.ink }}>{label}</div>
            <div style={{ fontSize: 11, color: AT.muted, marginTop: 2 }}>{phase} · В разработке</div>
          </div>
        ))}
      </div>
    </div>
  );
}
