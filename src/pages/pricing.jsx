import React from 'react';
import { useTheme } from '../shared/theme.jsx';

const WA_LINK = `https://wa.me/996700938211?text=${encodeURIComponent('Хочу поговорить насчет проекта Оптовые Цены')}`;

const PLANS = [
  {
    id: 'basic',
    name: 'Базовый',
    badge: 'Старт',
    price: '15 000',
    suffix: 'с/мес',
    note: 'или 75 000 с единоразово',
    desc: 'Клиентская витрина и панель управления',
    accentKey: 'muted',
    highlight: false,
    features: [
      'Клиентский сайт (до 10 страниц)',
      'Административная панель',
      'Каталог товаров',
      'Домен + хостинг включены',
      'SSL-сертификат',
      'Адаптация под мобильные',
    ],
    cta: 'Начать',
  },
  {
    id: 'business',
    name: 'Бизнес',
    badge: 'Популярный',
    price: '35 000',
    suffix: 'с/мес',
    note: 'или 180 000 с единоразово',
    desc: 'Полный бэкенд и программа лояльности',
    accentKey: 'primary',
    highlight: true,
    features: [
      'Всё из Базового',
      'Система заказов и доставки',
      'Личный кабинет покупателя',
      'Программа лояльности',
      'Push-уведомления',
      'Аналитика и отчёты',
      'Интеграция платёжных систем',
    ],
    cta: 'Выбрать',
  },
  {
    id: 'advanced',
    name: 'Расширенный',
    badge: 'Максимум',
    price: '80 000',
    suffix: 'с/мес',
    note: 'или 400 000 с единоразово',
    desc: 'AI-ассистент и мобильное приложение',
    accentKey: 'accent2',
    highlight: false,
    features: [
      'Всё из Бизнес',
      'AI-чат ассистент',
      'Мобильное приложение iOS + Android',
      'Персонализация рекомендаций',
      'Поддержка 24/7',
      'Ежемесячный аудит',
      'A/B тестирование',
    ],
    cta: 'Выбрать',
  },
  {
    id: 'partner',
    name: 'Партнёрство',
    badge: 'Без риска',
    price: '5%',
    suffix: 'с транзакции',
    note: 'Нет стартовых вложений',
    desc: 'Мы строим — вы платите только с продаж',
    accentKey: 'primaryDark',
    highlight: false,
    features: [
      'Полная разработка за наш счёт',
      'Все функции Расширенного',
      'Нет стартовых вложений',
      'Мы заинтересованы в вашем росте',
      'Прозрачная аналитика продаж',
      'Долгосрочное партнёрство',
    ],
    cta: 'Обсудить',
  },
];

function CheckIcon({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.116 1.532 5.845L.057 23.077a.75.75 0 0 0 .918.918l5.232-1.475A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.943 9.943 0 0 1-5.12-1.415l-.367-.218-3.804 1.072 1.072-3.804-.218-.367A9.943 9.943 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  );
}

function CalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function PlanCard({ plan, t }) {
  const accent = plan.accentKey === 'primary' ? t.primary
    : plan.accentKey === 'accent2' ? t.accent2
    : plan.accentKey === 'primaryDark' ? t.primaryDark
    : t.muted;

  return (
    <div style={{
      background: t.cardBg,
      borderRadius: 16,
      border: plan.highlight ? `2px solid ${t.primary}` : `1.5px solid ${t.border}`,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      position: 'relative',
      boxShadow: plan.highlight ? `0 4px 32px ${t.primary}20` : 'none',
    }}>
      {plan.highlight && (
        <div style={{
          position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
          background: t.primary, color: '#fff',
          borderRadius: 20, padding: '4px 16px',
          fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', whiteSpace: 'nowrap',
        }}>
          {plan.badge}
        </div>
      )}

      <div>
        {!plan.highlight && (
          <div style={{
            display: 'inline-flex',
            background: `${accent}18`,
            color: accent,
            borderRadius: 8, padding: '3px 10px',
            fontSize: 11, fontWeight: 800, letterSpacing: '0.04em',
            marginBottom: 8,
          }}>
            {plan.badge}
          </div>
        )}
        <div style={{ fontSize: 18, fontWeight: 900, color: t.ink, marginBottom: 4 }}>
          {plan.name}
        </div>
        <div style={{ fontSize: 13, color: t.muted, lineHeight: 1.5 }}>
          {plan.desc}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 34, fontWeight: 900, color: accent, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {plan.price}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: t.muted }}>
            {plan.suffix}
          </span>
        </div>
        {plan.note && (
          <div style={{ fontSize: 11, color: t.muted, marginTop: 5, opacity: 0.8 }}>
            {plan.note}
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckIcon color={accent} />
            <span style={{ fontSize: 13, color: t.ink, lineHeight: 1.4 }}>{f}</span>
          </div>
        ))}
      </div>

      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          background: plan.highlight ? t.primary : `${accent}15`,
          color: plan.highlight ? '#fff' : accent,
          borderRadius: 10,
          padding: '12px',
          textAlign: 'center',
          fontWeight: 800,
          fontSize: 14,
          textDecoration: 'none',
          border: plan.highlight ? 'none' : `1.5px solid ${accent}40`,
          marginTop: 4,
        }}
      >
        {plan.cta} →
      </a>
    </div>
  );
}

export function PricingScreen({ device }) {
  const t = useTheme();
  const isMobile = device === 'mobile';

  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{
        padding: isMobile ? '40px 16px 32px' : '60px 40px 48px',
        textAlign: 'center',
        background: `linear-gradient(180deg, ${t.primary}08 0%, transparent 100%)`,
      }}>
        <div style={{
          display: 'inline-flex',
          background: `${t.primary}18`,
          color: t.primary,
          borderRadius: 20, padding: '5px 16px',
          fontSize: 11, fontWeight: 800, letterSpacing: '0.08em',
          marginBottom: 16,
        }}>
          APRD · WEB РЕШЕНИЯ
        </div>
        <h1 style={{
          fontSize: isMobile ? 26 : 40,
          fontWeight: 900,
          color: t.ink,
          margin: '0 0 14px',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          Готовый магазин<br />за понятную цену
        </h1>
        <p style={{
          fontSize: isMobile ? 14 : 16,
          color: t.muted,
          margin: '0 auto',
          lineHeight: 1.7,
          maxWidth: 480,
        }}>
          Создаём интернет-магазины для бизнеса в Кыргызстане.
          Выберите план — от витрины до полного e-commerce с AI.
        </p>
      </div>

      <div style={{
        padding: isMobile ? '0 16px' : '0 40px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? 16 : 20,
        maxWidth: 880,
        margin: '0 auto',
      }}>
        {PLANS.map(plan => (
          <PlanCard key={plan.id} plan={plan} t={t} />
        ))}
      </div>

      <div style={{
        padding: isMobile ? '40px 16px 0' : '56px 40px 0',
        maxWidth: 880,
        margin: '0 auto',
      }}>
        <div style={{
          background: t.surface,
          borderRadius: 20,
          border: `1.5px solid ${t.border}`,
          padding: isMobile ? '28px 20px' : '40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 900, color: t.ink, marginBottom: 8 }}>
            Остались вопросы?
          </div>
          <div style={{ fontSize: 14, color: t.muted, marginBottom: 28, lineHeight: 1.7, maxWidth: 400, margin: '0 auto 28px' }}>
            Обсудим ваш проект, подберём план и ответим на любые вопросы.
          </div>

          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#25D366',
                color: '#fff',
                borderRadius: 12,
                padding: '12px 24px',
                fontWeight: 800,
                fontSize: 14,
                textDecoration: 'none',
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'center',
                fontFamily: 'inherit',
              }}
            >
              <WhatsAppIcon />
              Написать в WhatsApp
            </a>

            <a
              href="https://cal.com/ramil-salihar/45min"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: t.surfaceAlt,
                color: t.ink,
                border: `1.5px solid ${t.border}`,
                borderRadius: 12,
                padding: '12px 24px',
                fontWeight: 800,
                fontSize: 14,
                textDecoration: 'none',
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'center',
                fontFamily: 'inherit',
              }}
            >
              <CalIcon />
              Записаться на звонок
            </a>
          </div>

          <a
            href="https://aprd.kg/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              color: t.primary,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            aprd.kg →
          </a>
        </div>
      </div>
    </div>
  );
}
