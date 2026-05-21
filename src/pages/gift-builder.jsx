import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useCart } from '../features/cart.jsx';
import { useNotification } from '../features/notification.jsx';
import { useData } from '../features/data.jsx';
import { fmtRub } from '../entities/product/model.js';
import { ProductImage } from '../entities/product/ProductImage.jsx';
import { loadGifts, saveGift, newGiftId } from '../features/giftsStorage.js';

const RECIPIENTS = [
  { key: 'mama',      label: 'Маме',     icon: '👩' },
  { key: 'friend',    label: 'Подруге',  icon: '👯' },
  { key: 'love',      label: 'Любимой',  icon: '💕' },
  { key: 'sister',    label: 'Сестре',   icon: '👧' },
  { key: 'colleague', label: 'Коллеге',  icon: '💼' },
  { key: 'self',      label: 'Себе',     icon: '✨' },
  { key: 'other',     label: 'Другому',  icon: '🎀' },
];

const OCCASIONS = [
  { key: 'birthday', label: 'День рождения', icon: '🎂' },
  { key: 'march8',   label: '8 Марта',       icon: '🌹' },
  { key: 'newyear',  label: 'Новый год',     icon: '🎄' },
  { key: 'justso',   label: 'Просто так',    icon: '🫶' },
  { key: 'other',    label: 'Другой повод',  icon: '🎊' },
];

const BUDGETS = [
  { key: 'lt500',     label: 'до 500 с',      test: p => p.price < 500 },
  { key: '500-1500',  label: '500–1 500 с',   test: p => p.price >= 500 && p.price < 1500 },
  { key: '1500-3000', label: '1 500–3 000 с', test: p => p.price >= 1500 && p.price < 3000 },
  { key: 'gt3000',    label: 'от 3 000 с',    test: p => p.price >= 3000 },
];

const TOTAL_STEPS = 5;
const MAX_ITEMS = 5;

function Chip({ active, onClick, icon, label, large }) {
  const t = useTheme();
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: large ? 'column' : 'row',
      alignItems: 'center', gap: large ? 6 : 8,
      padding: large ? '14px 16px' : '8px 16px',
      borderRadius: 14,
      border: `2px solid ${active ? t.primary : t.border}`,
      background: active ? `${t.primary}12` : t.surface,
      color: active ? t.primary : t.ink,
      fontSize: large ? 13 : 14, fontWeight: 700,
      cursor: 'pointer', fontFamily: 'inherit',
      transition: 'border-color 0.12s, background 0.12s, color 0.12s',
      flexShrink: 0,
      minWidth: large ? 90 : 'unset',
    }}>
      {icon && <span style={{ fontSize: large ? 24 : 16 }}>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

function ProgressBar({ step }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 4, borderRadius: 2,
          background: i < step ? t.primary : i === step ? `${t.primary}60` : t.border,
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  );
}

function StepLabel({ step }) {
  const t = useTheme();
  const labels = ['Кому и повод', 'Получатель', 'Бюджет', 'Выбор товаров', 'Письмо'];
  return (
    <div style={{ fontSize: 12, fontWeight: 700, color: t.muted, letterSpacing: '0.04em', marginBottom: 6 }}>
      ШАГ {step + 1} / {TOTAL_STEPS} · {labels[step].toUpperCase()}
    </div>
  );
}

export function GiftBuilderScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const { products } = useData();
  const cart = useCart();
  const notify = useNotification();
  const isDesk = device === 'desktop';

  const initDraft = React.useMemo(() => {
    const { draftId, repeatId } = router.route;
    const id = draftId || repeatId;
    if (!id) return null;
    return loadGifts().find(g => g.id === id) || null;
  }, []);

  const giftId = React.useRef(initDraft?.id || newGiftId());

  const [step, setStep] = React.useState(initDraft?.step ?? 0);
  const [recipient, setRecipient] = React.useState(initDraft?.recipient ?? null);
  const [occasion, setOccasion] = React.useState(initDraft?.occasion ?? null);
  const [recipientName, setRecipientName] = React.useState(initDraft?.recipientName ?? '');
  const [recipientPhone, setRecipientPhone] = React.useState(initDraft?.recipientPhone ?? '');
  const [budget, setBudget] = React.useState(initDraft?.budget ?? null);
  const [selected, setSelected] = React.useState(initDraft?.selectedProducts ?? []);
  const [letter, setLetter] = React.useState(initDraft?.letter ?? '');

  React.useEffect(() => {
    saveGift({
      id: giftId.current,
      status: 'draft',
      step,
      recipient,
      occasion,
      recipientName,
      recipientPhone,
      budget,
      selectedProducts: selected,
      letter,
      createdAt: initDraft?.createdAt || new Date().toISOString(),
    });
  }, [step, recipient, occasion, recipientName, recipientPhone, budget, selected, letter]);

  const budgetFilter = BUDGETS.find(b => b.key === budget);
  const filteredProducts = React.useMemo(() => {
    let list = [...products];
    if (budgetFilter) list = list.filter(budgetFilter.test);
    return list;
  }, [products, budget]);

  function toggleProduct(id) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < MAX_ITEMS ? [...prev, id] : prev
    );
  }

  function canNext() {
    if (step === 0) return !!(recipient && occasion);
    if (step === 1) return !!recipientName.trim();
    if (step === 2) return !!budget;
    if (step === 3) return selected.length > 0;
    return true;
  }

  const selectedProducts = products.filter(p => selected.includes(p.id));
  const totalPrice = selectedProducts.reduce((s, p) => s + p.price, 0);

  function handleFinish() {
    saveGift({
      id: giftId.current,
      status: 'completed',
      step,
      recipient,
      occasion,
      recipientName,
      recipientPhone,
      budget,
      selectedProducts: selected,
      letter,
      createdAt: initDraft?.createdAt || new Date().toISOString(),
    });
    cart.addGiftBox({
      recipientName,
      recipientPhone,
      recipient,
      occasion,
      products: selectedProducts,
      letter,
      totalPrice,
    });
    notify?.show('🎁 Подарочный набор добавлен в корзину!');
    router.go({ screen: 'cart' });
  }

  function handleSaveDraft() {
    notify?.show('Черновик сохранён');
    router.go({ screen: 'my_gifts' });
  }

  const pad = isDesk ? '0 40px' : '0 16px';

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${t.primary} 0%, #b8005f 100%)`,
        padding: isDesk ? '28px 40px 24px' : '20px 16px 18px',
        color: '#fff',
      }}>
        <div style={{ fontSize: isDesk ? 28 : 22, fontWeight: 900, letterSpacing: '-0.02em' }}>
          🎁 Собрать подарочный набор
        </div>
        <div style={{ fontSize: 13, marginTop: 4, opacity: 0.85 }}>
          Персональный подарок за несколько шагов
        </div>
      </div>

      <div style={{ padding: isDesk ? '28px 40px 0' : '20px 16px 0' }}>
        <ProgressBar step={step} />
        <StepLabel step={step} />
      </div>

      {/* Step 0: Кому + Повод */}
      {step === 0 && (
        <div style={{ padding: pad, paddingTop: 0 }}>
          <div style={{ padding: isDesk ? '0 0 20px' : '0 0 20px' }}>
            <div style={{ fontSize: isDesk ? 22 : 18, fontWeight: 900, marginBottom: 6 }}>Кому дарим?</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {RECIPIENTS.map(r => (
                <Chip key={r.key} large active={recipient === r.key}
                  onClick={() => setRecipient(r.key)} icon={r.icon} label={r.label} />
              ))}
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: isDesk ? 22 : 18, fontWeight: 900, marginBottom: 6 }}>Какой повод?</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {OCCASIONS.map(o => (
                <Chip key={o.key} large active={occasion === o.key}
                  onClick={() => setOccasion(o.key)} icon={o.icon} label={o.label} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Данные получателя */}
      {step === 1 && (
        <div style={{ padding: pad, paddingTop: 0 }}>
          <div style={{ fontSize: isDesk ? 22 : 18, fontWeight: 900, marginBottom: 6 }}>Данные получателя</div>
          <div style={{ fontSize: 13, color: t.muted, marginBottom: 20 }}>
            Чтобы правильно оформить и доставить набор
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.muted, marginBottom: 8 }}>
                Имя получателя *
              </div>
              <input
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                placeholder="Например, Айгуль"
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: 12,
                  border: `1.5px solid ${recipientName.trim() ? t.primary : t.border}`,
                  background: t.surface, color: t.ink,
                  fontSize: 15, fontFamily: 'inherit', outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.muted, marginBottom: 8 }}>
                Телефон получателя
                <span style={{ fontWeight: 400, marginLeft: 6 }}>— необязательно</span>
              </div>
              <input
                value={recipientPhone}
                onFocus={() => { if (!recipientPhone) setRecipientPhone('+996 '); }}
                onChange={e => {
                  let v = e.target.value;
                  if (!v.startsWith('+996')) v = '+996 ' + v.replace(/^\+?996?\s*/, '');
                  setRecipientPhone(v);
                }}
                placeholder="+996 (___) ___-___"
                type="tel"
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: 12,
                  border: `1.5px solid ${t.border}`,
                  background: t.surface, color: t.ink,
                  fontSize: 15, fontFamily: 'inherit', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Бюджет */}
      {step === 2 && (
        <div style={{ padding: pad, paddingTop: 0 }}>
          <div style={{ fontSize: isDesk ? 22 : 18, fontWeight: 900, marginBottom: 6 }}>Какой бюджет?</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {BUDGETS.map(b => (
              <Chip key={b.key} active={budget === b.key}
                onClick={() => setBudget(b.key)} label={b.label} />
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: t.muted }}>
            {budget
              ? `Найдено товаров: ${filteredProducts.length}`
              : 'Выберите диапазон, чтобы увидеть подходящие товары'}
          </div>
        </div>
      )}

      {/* Step 3: Выбор товаров */}
      {step === 3 && (
        <div>
          <div style={{ padding: isDesk ? '0 40px 12px' : '0 16px 12px', paddingTop: 0 }}>
            <div style={{ fontSize: isDesk ? 22 : 18, fontWeight: 900 }}>Выберите товары</div>
            <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>
              Выбрано {selected.length} из {MAX_ITEMS} · {fmtRub(totalPrice)}
            </div>
          </div>

          {selected.length > 0 && (
            <div style={{
              display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none',
              padding: isDesk ? '0 40px 16px' : '0 16px 16px',
            }}>
              {selectedProducts.map(p => (
                <div key={p.id} onClick={() => toggleProduct(p.id)} style={{
                  width: 60, height: 60, flexShrink: 0, borderRadius: 10, overflow: 'hidden',
                  outline: `2px solid ${t.primary}`, cursor: 'pointer', position: 'relative',
                }}>
                  <ProductImage p={p} padding={0} radius={0} />
                  <div style={{
                    position: 'absolute', top: 2, right: 2,
                    width: 16, height: 16, borderRadius: '50%',
                    background: t.primary, color: '#fff',
                    fontSize: 9, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✕</div>
                </div>
              ))}
              {Array.from({ length: MAX_ITEMS - selected.length }).map((_, i) => (
                <div key={i} style={{
                  width: 60, height: 60, flexShrink: 0, borderRadius: 10,
                  border: `2px dashed ${t.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: t.border,
                }}>+</div>
              ))}
            </div>
          )}

          <div style={{
            display: 'grid', gap: isDesk ? 16 : 10,
            gridTemplateColumns: isDesk ? 'repeat(auto-fill, minmax(180px, 1fr))' : 'repeat(2, 1fr)',
            padding: isDesk ? '0 40px' : '0 16px',
          }}>
            {filteredProducts.map(p => {
              const isSelected = selected.includes(p.id);
              return (
                <div key={p.id} onClick={() => toggleProduct(p.id)} style={{
                  cursor: 'pointer', borderRadius: 14, overflow: 'hidden',
                  outline: isSelected ? `3px solid ${t.primary}` : `1px solid ${t.border}`,
                  background: t.cardBg,
                  opacity: !isSelected && selected.length >= MAX_ITEMS ? 0.4 : 1,
                  transition: 'outline 0.12s, opacity 0.12s',
                }}>
                  <div style={{ position: 'relative' }}>
                    <ProductImage p={p} padding={0} radius={0} />
                    {isSelected && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: `${t.primary}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: t.primary, color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, fontWeight: 900,
                        }}>✓</div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '8px 10px 10px' }}>
                    <div style={{ fontSize: 11, color: t.muted, fontWeight: 700, textTransform: 'uppercase' }}>{p.brand}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25, marginTop: 2,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: t.primary, marginTop: 6 }}>{fmtRub(p.price)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Письмо + превью */}
      {step === 4 && (
        <div style={{ padding: pad, paddingTop: 0 }}>
          <div style={{ fontSize: isDesk ? 22 : 18, fontWeight: 900, marginBottom: 6 }}>Добавьте письмо</div>
          <div style={{ fontSize: 13, color: t.muted, marginBottom: 14 }}>
            Личное сообщение будет напечатано и вложено в набор
          </div>

          <textarea
            value={letter}
            onChange={e => setLetter(e.target.value)}
            placeholder={`Дорогая ${RECIPIENTS.find(r => r.key === recipient)?.label ?? ''}!\nЖелаю тебе...`}
            maxLength={300}
            style={{
              width: '100%', height: 120, borderRadius: 12,
              border: `1.5px solid ${t.border}`, background: t.surface,
              color: t.ink, padding: '12px 14px', fontSize: 14,
              fontFamily: 'inherit', resize: 'none', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ fontSize: 11, color: t.muted, textAlign: 'right', marginTop: 4 }}>
            {letter.length}/300
          </div>

          {/* Box preview */}
          <div style={{
            marginTop: 24, background: t.surfaceAlt, borderRadius: 16,
            padding: isDesk ? '20px 24px' : '16px',
          }}>
            <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 4 }}>🎁 Ваш набор</div>
            {recipientName && (
              <div style={{ fontSize: 13, color: t.muted, marginBottom: 12 }}>
                Для: <strong style={{ color: t.ink }}>{recipientName}</strong>
                {recipientPhone ? ` · ${recipientPhone}` : ''}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {selectedProducts.map(p => (
                <div key={p.id} style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                  <ProductImage p={p} padding={0} radius={0} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
              {selectedProducts.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: t.ink, fontWeight: 600 }}>{p.brand} · {p.name.slice(0, 28)}{p.name.length > 28 ? '…' : ''}</span>
                  <span style={{ color: t.muted, flexShrink: 0 }}>{fmtRub(p.price)}</span>
                </div>
              ))}
            </div>
            {letter.trim() && (
              <div style={{
                background: t.surface, borderRadius: 10, padding: '10px 12px',
                fontSize: 13, color: t.ink, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 12,
              }}>
                «{letter.trim()}»
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${t.border}`, paddingTop: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: t.muted }}>Итого</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: t.primary }}>{fmtRub(totalPrice)}</div>
              </div>
              <button onClick={handleFinish} style={{
                background: t.primary, color: '#fff', border: 'none',
                padding: '12px 24px', borderRadius: 12,
                fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                🛒 В корзину
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: t.bg, borderTop: `1px solid ${t.border}`,
        padding: isDesk ? '14px 40px' : '12px 16px',
        display: 'flex', gap: 10, zIndex: 20,
      }}>
        {step === 0 ? (
          <button onClick={handleSaveDraft} style={{
            flex: '0 0 auto', padding: '12px 14px', borderRadius: 12,
            border: `1.5px solid ${t.border}`, background: 'transparent',
            fontSize: 13, fontWeight: 700, color: t.muted,
            cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>💾 Сохранить</button>
        ) : (
          <button onClick={() => setStep(s => s - 1)} style={{
            flex: '0 0 auto', padding: '12px 20px', borderRadius: 12,
            border: `1.5px solid ${t.border}`, background: 'transparent',
            fontSize: 14, fontWeight: 700, color: t.ink,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>← Назад</button>
        )}
        {step < TOTAL_STEPS - 1 && (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            style={{
              flex: 1, padding: '13px 24px', borderRadius: 12, border: 'none',
              background: canNext() ? t.primary : t.border,
              color: canNext() ? '#fff' : t.muted,
              fontSize: 15, fontWeight: 800, cursor: canNext() ? 'pointer' : 'default',
              fontFamily: 'inherit', transition: 'background 0.15s',
            }}
          >
            {step === 3 && selected.length === 0 ? 'Выберите товары' : 'Далее →'}
          </button>
        )}
        {step === TOTAL_STEPS - 1 && letter.trim() === '' && (
          <button onClick={handleFinish} style={{
            flex: 1, padding: '13px 24px', borderRadius: 12, border: 'none',
            background: t.border, color: t.muted,
            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>Пропустить письмо →</button>
        )}
      </div>
    </div>
  );
}
