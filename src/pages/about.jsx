import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { Icon } from '../shared/ui/Icon.jsx';
import { Logo } from '../shared/ui/Logo.jsx';
import { DesktopFooter } from '../widgets/DesktopFooter.jsx';

export function AboutScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const isDesk = device === 'desktop';

  const stats = [
    { n: '12 000+', l: 'отзывов покупателей' },
    { n: '23',      l: 'бренда в каталоге' },
    { n: '12',      l: 'точек самовывоза' },
    { n: '2019',    l: 'год основания' },
  ];

  const values = [
    { icon: Icon.shield, title: 'Только оригиналы', desc: 'Прямые договоры с производителями и официальными дистрибьюторами. Каждая партия проходит проверку.' },
    { icon: Icon.truck,  title: 'Быстрая доставка', desc: 'По Бишкеку — на следующий день. По Кыргызстану — 2–7 дней. Бесплатно при заказе от 1 500 с.' },
    { icon: Icon.heart,  title: 'Возврат без вопросов', desc: '14 дней на возврат любого товара. Просто напишите нам — оформим без лишних документов.' },
    { icon: Icon.flame,  title: 'Оптовые цены', desc: 'Закупаем большими партиями и передаём экономию вам. Скидки до 60% от розничной цены.' },
  ];

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
      <div style={{
        background: `linear-gradient(135deg, ${t.primary} 0%, #8b004a 100%)`,
        padding: isDesk ? '60px 40px 56px' : '36px 20px 40px',
        color: '#fff', textAlign: isDesk ? 'left' : 'center',
        display: 'flex', alignItems: 'center', gap: 32,
        flexDirection: isDesk ? 'row' : 'column',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isDesk ? 'flex-start' : 'center', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <Logo size={isDesk ? 64 : 52} />
            <div>
              <div style={{ fontWeight: 900, fontSize: isDesk ? 22 : 18, letterSpacing: '0.04em', lineHeight: 1 }}>ОПТОВЫЕ ЦЕНЫ</div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4, lineHeight: 1.3 }}>САМЫЙ БОЛЬШОЙ МАГАЗИН<br/>КОСМЕТИКИ В КЫРГЫЗСТАНЕ</div>
            </div>
          </div>
          <h1 style={{ fontSize: isDesk ? 42 : 28, fontWeight: 900, margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Красота доступна каждому
          </h1>
          <p style={{ fontSize: isDesk ? 17 : 14, opacity: 0.9, lineHeight: 1.65, margin: 0, maxWidth: 520 }}>
            Мы верим, что качественная косметика не должна стоить дорого. С 2019 года доставляем оригинальную косметику и парфюмерию жителям Кыргызстана по ценам, которые раньше были только у оптовиков.
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, flexShrink: 0,
          width: isDesk ? 320 : '100%',
        }}>
          {stats.map((s) => (
            <div key={s.n} style={{
              background: 'rgba(255,255,255,0.15)', borderRadius: 14,
              padding: isDesk ? '18px 16px' : '14px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: isDesk ? 30 : 26, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4, fontWeight: 600 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: isDesk ? '56px 40px' : '32px 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: isDesk ? 28 : 22, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 20 }}>Наша история</h2>
          <div style={{ fontSize: isDesk ? 16 : 14, lineHeight: 1.75, color: t.ink, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0 }}>
              Всё началось с простого вопроса: почему косметика одного и того же бренда в Бишкеке стоит в два раза дороже, чем у производителя? Основатели компании долго работали в оптовой торговле и знали ответ — длинная цепочка посредников.
            </p>
            <p style={{ margin: 0 }}>
              В 2019 году мы открыли прямые контракты с дистрибьюторами Nivea, Pantene, Maybelline, Vichy и других топовых брендов. Убрали лишние звенья — и передали разницу покупателям.
            </p>
            <p style={{ margin: 0 }}>
              Сегодня мы доставляем по всему Кыргызстану: из Бишкека до Оша, из Джалал-Абада до отдалённых районов через Кыргыз Почтасы. Более 12 000 довольных покупателей оставили нам свои отзывы.
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: t.surfaceAlt, padding: isDesk ? '56px 40px' : '32px 20px' }}>
        <h2 style={{ fontSize: isDesk ? 28 : 22, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 32, textAlign: 'center' }}>Наши принципы</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesk ? 'repeat(2, 1fr)' : '1fr',
          gap: 16, maxWidth: 900, margin: '0 auto',
        }}>
          {values.map((v, i) => (
            <div key={i} style={{
              background: t.surface, borderRadius: 16, padding: isDesk ? '24px 28px' : '20px',
              display: 'flex', gap: 16, alignItems: 'flex-start',
              boxShadow: `inset 0 0 0 1px ${t.border}`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: t.primary,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {v.icon()}
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: t.muted, lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: isDesk ? '56px 40px' : '32px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: isDesk ? 28 : 22, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>Свяжитесь с нами</h2>
        <p style={{ color: t.muted, fontSize: 14, marginBottom: 28 }}>Мы всегда рады ответить на вопросы</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <a
            href="https://www.instagram.com/optovye_ceny01_/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: t.surface, borderRadius: 14, padding: '16px 24px',
              boxShadow: `inset 0 0 0 1px ${t.border}`, minWidth: 180,
              textDecoration: 'none', color: 'inherit', display: 'block',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 800, fontSize: 14 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={t.primary}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
              @optovye_ceny01_
            </div>
            <div style={{ fontSize: 12, color: t.muted, marginTop: 4 }}>Instagram · написать в Direct</div>
          </a>
          {[
            { label: 'Бишкек, Кыргызстан', sub: 'доставка по всей КР' },
            { label: 'пн-вс · 9:00–22:00', sub: 'часы работы' },
          ].map((c) => (
            <div key={c.label} style={{
              background: t.surface, borderRadius: 14, padding: '16px 24px',
              boxShadow: `inset 0 0 0 1px ${t.border}`, minWidth: 180,
            }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{c.label}</div>
              <div style={{ fontSize: 12, color: t.muted, marginTop: 4 }}>{c.sub}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => router.go({ screen: 'catalog' })}
          style={{
            background: t.primary, color: '#fff', border: 'none', cursor: 'pointer',
            padding: '14px 32px', borderRadius: 14, fontWeight: 900, fontSize: 16,
            fontFamily: 'inherit', letterSpacing: '0.01em',
          }}
        >
          Перейти к каталогу
        </button>
      </div>

      {isDesk && <DesktopFooter />}
    </div>
  );
}
