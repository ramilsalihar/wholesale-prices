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
    { n: '24',      l: 'позиции в каталоге' },
    { n: '12',      l: 'точек самовывоза' },
    { n: '2019',    l: 'год основания' },
  ];

  const values = [
    { icon: Icon.shield, title: 'Только свежие цветы', desc: 'Собственные теплицы и прямые поставки от проверенных плантаций. Каждая партия проходит контроль свежести.' },
    { icon: Icon.truck,  title: 'Быстрая доставка', desc: 'По Бишкеку — день в день, от 1 часа. По Кыргызстану — 1–3 дня. Бесплатно при заказе от 1 500 с.' },
    { icon: Icon.heart,  title: 'Гарантия свежести', desc: 'Если букет завял раньше срока — заменим бесплатно. Просто напишите нам, без лишних документов.' },
    { icon: Icon.flame,  title: 'Авторская флористика', desc: 'Собственная студия и штатные флористы. Собираем букеты и композиции под любой повод.' },
  ];

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
      <div style={{
        background: t.surface, borderBottom: `1px solid ${t.border}`,
        padding: isDesk ? '60px 40px 56px' : '36px 20px 40px',
        color: t.ink, textAlign: isDesk ? 'left' : 'center',
        display: 'flex', alignItems: 'center', gap: 32,
        flexDirection: isDesk ? 'row' : 'column',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isDesk ? 'flex-start' : 'center', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <Logo size={isDesk ? 64 : 52} />
            <div>
              <div style={{ fontWeight: 600, fontSize: isDesk ? 22 : 18, letterSpacing: '0.04em', lineHeight: 1 }}>ЦВЕТОЧНЫЙ ДОМ</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 4, lineHeight: 1.3 }}>СВЕЖИЕ ЦВЕТЫ<br/>И АВТОРСКАЯ ФЛОРИСТИКА В БИШКЕКЕ</div>
            </div>
          </div>
          <h1 style={{
            fontSize: isDesk ? 42 : 28, fontWeight: 600, margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.1,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
          }}>
            Красивые букеты — каждому поводу
          </h1>
          <p style={{ fontSize: isDesk ? 17 : 14, color: t.muted, lineHeight: 1.65, margin: 0, maxWidth: 520 }}>
            Мы верим, что свежие цветы должны быть доступны быстро и без переплат. С 2019 года доставляем букеты и композиции жителям Кыргызстана напрямую от теплиц, минуя посредников.
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, flexShrink: 0,
          width: isDesk ? 320 : '100%',
        }}>
          {stats.map((s) => (
            <div key={s.n} style={{
              background: t.discountBg, borderRadius: 4,
              padding: isDesk ? '18px 16px' : '14px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: isDesk ? 30 : 26, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1, color: t.primaryDark, fontVariantNumeric: 'tabular-nums' }}>{s.n}</div>
              <div style={{ fontSize: 12, color: t.primaryDark, marginTop: 4, fontWeight: 600 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: isDesk ? '56px 40px' : '32px 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: isDesk ? 28 : 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 20, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Наша история</h2>
          <div style={{ fontSize: isDesk ? 16 : 14, lineHeight: 1.75, color: t.ink, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0 }}>
              Всё началось с простого вопроса: почему свежий букет в Бишкеке часто оказывается вчерашним завозом с рынка? Основатели компании много лет работали с тепличными хозяйствами и знали, как доставлять цветы напрямую, без потери свежести.
            </p>
            <p style={{ margin: 0 }}>
              В 2019 году мы открыли собственную флористическую студию и наладили прямые поставки от проверенных плантаций Кыргызстана и соседних стран. Убрали лишние звенья — и передали разницу и свежесть покупателям.
            </p>
            <p style={{ margin: 0 }}>
              Сегодня мы доставляем по всему Кыргызстану: из Бишкека до Оша, из Джалал-Абада до отдалённых районов. Более 12 000 довольных покупателей оставили нам свои отзывы.
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: t.surfaceAlt, padding: isDesk ? '56px 40px' : '32px 20px' }}>
        <h2 style={{ fontSize: isDesk ? 28 : 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 32, textAlign: 'center', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Наши принципы</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesk ? 'repeat(2, 1fr)' : '1fr',
          gap: 16, maxWidth: 900, margin: '0 auto',
        }}>
          {values.map((v, i) => (
            <div key={i} style={{
              background: t.surface, borderRadius: 4, padding: isDesk ? '24px 28px' : '20px',
              display: 'flex', gap: 16, alignItems: 'flex-start',
              border: `1px solid ${t.border}`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 4, background: t.discountBg,
                color: t.primaryDark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {v.icon()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: t.muted, lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: isDesk ? '56px 40px' : '32px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: isDesk ? 28 : 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Свяжитесь с нами</h2>
        <p style={{ color: t.muted, fontSize: 14, marginBottom: 28 }}>Мы всегда рады ответить на вопросы</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <a
            href="https://www.instagram.com/optovye_ceny01_/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: t.surface, borderRadius: 4, padding: '16px 24px',
              border: `1px solid ${t.border}`, minWidth: 0, flex: '1 1 160px',
              textDecoration: 'none', color: 'inherit', display: 'block',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600, fontSize: 14 }}>
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
              background: t.surface, borderRadius: 4, padding: '16px 24px',
              border: `1px solid ${t.border}`, minWidth: 0, flex: '1 1 160px',
            }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.label}</div>
              <div style={{ fontSize: 12, color: t.muted, marginTop: 4 }}>{c.sub}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => router.go({ screen: 'catalog' })}
          style={{
            background: 'transparent', color: t.btnInk, border: `1.5px solid ${t.btnBorder}`, cursor: 'pointer',
            padding: '14px 32px', borderRadius: 4, fontWeight: 600, fontSize: 16,
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
