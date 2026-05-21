import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useData } from '../features/data.jsx';
import { fmtRub } from '../entities/product/model.js';
import { ProductImage } from '../entities/product/ProductImage.jsx';
import { loadGifts, deleteGift } from '../features/giftsStorage.js';
import { DesktopFooter } from '../widgets/DesktopFooter.jsx';

const RECIPIENTS = {
  mama: { label: 'Маме', icon: '👩' },
  friend: { label: 'Подруге', icon: '👯' },
  love: { label: 'Любимой', icon: '💕' },
  sister: { label: 'Сестре', icon: '👧' },
  colleague: { label: 'Коллеге', icon: '💼' },
  self: { label: 'Себе', icon: '✨' },
};

const OCCASIONS = {
  birthday: { label: 'День рождения', icon: '🎂' },
  march8: { label: '8 Марта', icon: '🌹' },
  newyear: { label: 'Новый год', icon: '🎄' },
  justso: { label: 'Просто так', icon: '🫶' },
};

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function GiftCard({ gift, products, onContinue, onDelete, isDesk }) {
  const t = useTheme();
  const router = useRouter();
  const isDraft = gift.status === 'draft';
  const recipient = RECIPIENTS[gift.recipient];
  const occasion = OCCASIONS[gift.occasion];
  const selectedProducts = products.filter(p => (gift.selectedProducts || []).includes(p.id));
  const stepsTotal = 4;

  return (
    <div style={{
      background: t.surface, borderRadius: 16,
      border: `1px solid ${isDraft ? t.primary + '40' : t.border}`,
      overflow: 'hidden',
    }}>
      {/* Header stripe */}
      <div style={{
        background: isDraft
          ? `linear-gradient(90deg, ${t.primary}18, transparent)`
          : `linear-gradient(90deg, ${t.surfaceAlt}, transparent)`,
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{recipient?.icon ?? '🎁'}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: t.ink }}>
              {recipient?.label ?? 'Набор'}{occasion ? ` · ${occasion.label}` : ''}
            </div>
            <div style={{ fontSize: 11, color: t.muted, marginTop: 1 }}>{fmtDate(gift.updatedAt)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: isDraft ? `${t.primary}18` : 'rgba(0,135,90,0.1)',
            color: isDraft ? t.primary : '#00875A',
          }}>
            {isDraft ? `Черновик · шаг ${gift.step + 1}/${stepsTotal}` : 'Завершён'}
          </span>
        </div>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Product thumbnails */}
        {selectedProducts.length > 0 ? (
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            {selectedProducts.map(p => (
              <div key={p.id} style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <ProductImage p={p} padding={0} radius={0} />
              </div>
            ))}
            {selectedProducts.length === 0 && (
              <div style={{ fontSize: 13, color: t.muted }}>Товары ещё не выбраны</div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: t.muted, marginBottom: 12 }}>Товары ещё не выбраны</div>
        )}

        {/* Letter preview */}
        {gift.letter?.trim() && (
          <div style={{
            background: t.surfaceAlt, borderRadius: 8, padding: '8px 12px',
            fontSize: 12, color: t.muted, fontStyle: 'italic',
            lineHeight: 1.5, marginBottom: 12,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            «{gift.letter.trim()}»
          </div>
        )}

        {/* Footer: total + actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: t.primary }}>
            {selectedProducts.length > 0 ? fmtRub(selectedProducts.reduce((s, p) => s + p.price, 0)) : '—'}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => onDelete(gift.id)}
              style={{
                padding: '7px 12px', borderRadius: 8, border: `1.5px solid rgba(222,53,11,0.25)`,
                background: 'transparent', color: '#DE350B',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >Удалить</button>
            {isDraft ? (
              <button
                onClick={() => onContinue(gift.id)}
                style={{
                  padding: '7px 16px', borderRadius: 8, border: 'none',
                  background: t.primary, color: '#fff',
                  fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Продолжить →</button>
            ) : (
              <button
                onClick={() => router.go({ screen: 'gift_builder', repeatId: gift.id })}
                style={{
                  padding: '7px 16px', borderRadius: 8, border: `1.5px solid ${t.border}`,
                  background: 'transparent', color: t.ink,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Повторить</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MyGiftsScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const { products } = useData();
  const isDesk = device === 'desktop';

  const [gifts, setGifts] = React.useState(() => loadGifts());
  const [tab, setTab] = React.useState('drafts');

  function refresh() { setGifts(loadGifts()); }

  function handleDelete(id) {
    if (!window.confirm('Удалить этот набор?')) return;
    deleteGift(id);
    refresh();
  }

  function handleContinue(id) {
    router.go({ screen: 'gift_builder', draftId: id });
  }

  const drafts = gifts.filter(g => g.status === 'draft');
  const history = gifts.filter(g => g.status === 'completed');

  const TabBtn = ({ value, label, count }) => (
    <button onClick={() => setTab(value)} style={{
      padding: '8px 18px', borderRadius: 999,
      border: `1.5px solid ${tab === value ? t.primary : t.border}`,
      background: tab === value ? t.primary : 'transparent',
      color: tab === value ? '#fff' : t.ink,
      fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {label}
      {count > 0 && (
        <span style={{
          background: tab === value ? 'rgba(255,255,255,0.25)' : t.surfaceAlt,
          borderRadius: 999, fontSize: 11, fontWeight: 800,
          padding: '1px 6px', lineHeight: '16px',
          color: tab === value ? '#fff' : t.muted,
        }}>{count}</span>
      )}
    </button>
  );

  const current = tab === 'drafts' ? drafts : history;

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
      <div style={{
        background: t.surfaceAlt,
        padding: isDesk ? '24px 40px 20px' : '14px 16px 16px',
        borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Мои подарки
        </div>
        <div style={{ fontSize: isDesk ? 32 : 22, fontWeight: 900, marginTop: 4, letterSpacing: '-0.02em' }}>
          🎁 Подарочные наборы
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <TabBtn value="drafts" label="Черновики" count={drafts.length} />
          <TabBtn value="history" label="История" count={history.length} />
        </div>
      </div>

      <div style={{ padding: isDesk ? '24px 40px' : '16px' }}>
        {current.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: t.muted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>
              {tab === 'drafts' ? '📝' : '📦'}
            </div>
            <div style={{ fontWeight: 900, fontSize: 17, color: t.ink, marginBottom: 8 }}>
              {tab === 'drafts' ? 'Нет черновиков' : 'История пуста'}
            </div>
            <div style={{ fontSize: 14, marginBottom: 20 }}>
              {tab === 'drafts'
                ? 'Начните собирать подарочный набор'
                : 'Здесь появятся завершённые наборы'}
            </div>
            <button
              onClick={() => router.go({ screen: 'gift_builder' })}
              style={{
                background: t.primary, color: '#fff', border: 'none',
                padding: '11px 24px', borderRadius: 12,
                fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >🎁 Собрать набор</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {current.map(gift => (
              <GiftCard
                key={gift.id}
                gift={gift}
                products={products}
                onContinue={handleContinue}
                onDelete={handleDelete}
                isDesk={isDesk}
              />
            ))}
          </div>
        )}
      </div>

      {gifts.length > 0 && (
        <div style={{ padding: isDesk ? '0 40px 32px' : '0 16px 24px', textAlign: 'center' }}>
          <button
            onClick={() => router.go({ screen: 'gift_builder' })}
            style={{
              background: t.primary, color: '#fff', border: 'none',
              padding: '12px 28px', borderRadius: 12,
              fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >+ Новый набор</button>
        </div>
      )}

      {isDesk && <DesktopFooter />}
    </div>
  );
}
