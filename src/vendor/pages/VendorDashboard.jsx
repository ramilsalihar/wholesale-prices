import React from 'react';
import { VT } from '../vendorTheme.js';

export function VendorDashboard({ vendor, products, onGoScreen, onAddProduct }) {
  const totalCount = products.length;
  const activeCount = products.filter(p => p.active !== false).length;
  const draftCount = totalCount - activeCount;
  const avgPrice = totalCount > 0
    ? Math.round(products.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / totalCount)
    : 0;

  const statusCfg = {
    approved: { label: 'АКТИВЕН И ПРИНИМАЕТ ЗАКАЗЫ', bg: VT.successBg, color: VT.success, icon: '✓' },
    pending: { label: 'НА ПРОВЕРКЕ АДМИНИСТРАТОРА', bg: VT.warningBg, color: VT.warning, icon: '⏳' },
    blocked: { label: 'ЗАБЛОКИРОВАН', bg: VT.dangerBg, color: VT.danger, icon: '✕' },
  }[vendor?.status ?? 'approved'] ?? { label: 'АКТИВЕН', bg: VT.successBg, color: VT.success, icon: '✓' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome & Status Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${VT.surface} 0%, ${VT.primaryBg} 100%)`,
        border: `1px solid ${VT.border}`,
        borderRadius: VT.radiusLg,
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: VT.shadowSm,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: VT.radiusLg,
            background: VT.surface,
            border: `1.5px solid ${VT.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            boxShadow: VT.shadowSm,
            overflow: 'hidden',
          }}>
            {vendor?.logo_url ? (
              <img src={vendor.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              '🌸'
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: VT.ink, letterSpacing: '-0.02em' }}>
                {vendor?.name || 'Мой цветочный магазин'}
              </h1>
              <span style={{
                background: statusCfg.bg,
                color: statusCfg.color,
                fontSize: 11,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 999,
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}>
                {statusCfg.icon} {statusCfg.label}
              </span>
            </div>
            <div style={{ fontSize: 13, color: VT.muted, marginTop: 4 }}>
              {vendor?.city || 'Бишкек'} · {vendor?.address || 'Адрес не указан'} · {vendor?.phone || 'Телефон не указан'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onAddProduct}
            style={{
              background: VT.primary,
              color: '#fff',
              border: 'none',
              borderRadius: VT.radius,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 2px 8px rgba(230,9,122,0.25)',
              transition: 'transform 0.1s',
            }}
          >
            <span style={{ fontSize: 16 }}>+</span> Добавить букет
          </button>
          <button
            onClick={() => onGoScreen('settings')}
            style={{
              background: VT.surface,
              color: VT.ink,
              border: `1.5px solid ${VT.border}`,
              borderRadius: VT.radius,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Настройки витрины
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
      }}>
        {[
          { label: 'Всего букетов и товаров', val: totalCount, icon: '💐', color: VT.primary },
          { label: 'Опубликовано на витрине', val: activeCount, icon: '🛍️', color: VT.success },
          { label: 'Скрыто / Черновики', val: draftCount, icon: '📦', color: VT.muted },
          { label: 'Средняя цена букета', val: `${avgPrice.toLocaleString('ru-RU')} с`, icon: '🏷️', color: VT.accent },
        ].map((m, i) => (
          <div key={i} style={{
            background: VT.surface,
            border: `1px solid ${VT.border}`,
            borderRadius: VT.radiusLg,
            padding: '18px 20px',
            boxShadow: VT.shadowSm,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: VT.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {m.label}
              </div>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: m.color, marginTop: 8, letterSpacing: '-0.02em' }}>
              {m.val}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Start & Florist Advice */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 16,
      }}>
        <div style={{
          background: VT.surface,
          border: `1px solid ${VT.border}`,
          borderRadius: VT.radiusLg,
          padding: '22px 24px',
          boxShadow: VT.shadowSm,
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: VT.ink, marginBottom: 12 }}>
            🌸 Недавние букеты вашего магазина
          </div>
          {products.length === 0 ? (
            <div style={{
              padding: '36px 16px',
              textAlign: 'center',
              color: VT.muted,
              fontSize: 14,
            }}>
              У вас пока нет добавленных букетов. Нажмите «+ Добавить букет», чтобы выставить свои цветы на витрину!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {products.slice(0, 4).map(p => (
                <div key={p.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: VT.surfaceAlt,
                  borderRadius: VT.radius,
                  border: `1px solid ${VT.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: VT.radius - 2,
                      overflow: 'hidden',
                      background: '#eee',
                      flexShrink: 0,
                    }}>
                      {p.image_url || p.images?.[0] ? (
                        <img src={p.image_url || p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌷</div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: VT.ink }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: VT.muted }}>{p.price} с {p.old ? `· скидка с ${p.old} с` : ''}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: p.active !== false ? VT.successBg : VT.surface,
                    color: p.active !== false ? VT.success : VT.muted,
                    border: `1px solid ${p.active !== false ? 'transparent' : VT.border}`,
                  }}>
                    {p.active !== false ? 'На витрине' : 'Скрыт'}
                  </span>
                </div>
              ))}
              <button
                onClick={() => onGoScreen('products')}
                style={{
                  marginTop: 6,
                  background: 'transparent',
                  border: `1.5px solid ${VT.border}`,
                  color: VT.primaryDark,
                  borderRadius: VT.radius,
                  padding: '9px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Посмотреть все букеты ({totalCount}) →
              </button>
            </div>
          )}
        </div>

        {/* Florist Tips */}
        <div style={{
          background: VT.surface,
          border: `1px solid ${VT.border}`,
          borderRadius: VT.radiusLg,
          padding: '22px 24px',
          boxShadow: VT.shadowSm,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: VT.ink }}>
            Советы для высоких продаж
          </div>
          <div style={{ fontSize: 13, color: VT.inkLight, lineHeight: 1.6, display: 'flex', gap: 10 }}>
            <span style={{ color: VT.primary, fontWeight: 800 }}>1.</span>
            <span>Загружайте качественные фото букетов при естественном дневном свете.</span>
          </div>
          <div style={{ fontSize: 13, color: VT.inkLight, lineHeight: 1.6, display: 'flex', gap: 10 }}>
            <span style={{ color: VT.primary, fontWeight: 800 }}>2.</span>
            <span>Указывайте точный состав букета (сорт роз, пионов, эвкалипта, ленты).</span>
          </div>
          <div style={{ fontSize: 13, color: VT.inkLight, lineHeight: 1.6, display: 'flex', gap: 10 }}>
            <span style={{ color: VT.primary, fontWeight: 800 }}>3.</span>
            <span>Поддерживайте актуальный статус: если цветы закончились, временно переключите букет в статус «Скрыт».</span>
          </div>
          <div style={{
            marginTop: 'auto',
            padding: '12px 14px',
            background: VT.primaryBg,
            borderRadius: VT.radius,
            fontSize: 12,
            color: VT.primaryDark,
            fontWeight: 600,
          }}>
            🌟 Доставка заказов выполняется курьерами Flowo либо вашей собственной курьерской службой.
          </div>
        </div>
      </div>
    </div>
  );
}
