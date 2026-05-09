import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useCart } from '../features/cart.jsx';
import { fmtRub } from '../entities/product/model.js';
import { Button } from '../shared/ui/Button.jsx';
import { ProductImage } from '../entities/product/ProductImage.jsx';

function Stepper({ step, steps }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: i + 1 <= step ? t.primary : t.surfaceAlt,
            color: i + 1 <= step ? '#fff' : t.muted,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 13, flexShrink: 0,
          }}>{i + 1}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: i + 1 <= step ? t.ink : t.muted }}>{s}</div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: t.border, marginLeft: 4 }} />}
        </div>
      ))}
    </div>
  );
}

function Block({ title, children }) {
  const t = useTheme();
  return (
    <div style={{ background: t.surface, borderRadius: 16, padding: 18, marginBottom: 12, boxShadow: `inset 0 0 0 1px ${t.border}` }}>
      <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  const t = useTheme();
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 12, color: t.muted, fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{
        width: '100%', padding: '12px 14px', borderRadius: 10,
        border: `1.5px solid ${t.border}`, background: t.bg, color: t.ink,
        fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
      }} />
    </label>
  );
}

function RadioRow({ checked, onClick, t: title, s: sub }) {
  const t = useTheme();
  return (
    <button onClick={onClick} style={{
      background: checked ? t.surfaceAlt : 'transparent',
      border: `1.5px solid ${checked ? t.primary : t.border}`, cursor: 'pointer',
      padding: '12px 14px', borderRadius: 12, textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit', width: '100%',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${checked ? t.primary : t.border}`,
        background: checked ? t.primary : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}>{checked && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.ink }}>{title}</div>
        <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{sub}</div>
      </div>
    </button>
  );
}

function Row({ k, v, accent }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
      <span style={{ color: t.muted }}>{k}</span>
      <span style={{ fontWeight: 800, color: accent ? t.accent2 : t.ink }}>{v}</span>
    </div>
  );
}

export function CheckoutScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const cart = useCart();
  const isDesk = device === 'desktop';
  const [delivery, setDelivery] = React.useState('courier');
  const [pay, setPay] = React.useState('sbp');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [addr, setAddr] = React.useState('');

  const deliveryFee = delivery === 'pickup' ? 0 : (cart.subtotal >= 1500 ? 0 : 199);
  const total = cart.subtotal + deliveryFee;

  const place = () => { cart.clear(); router.go({ screen: 'order_done' }); };

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesk ? '1.4fr 1fr' : '1fr',
        gap: isDesk ? 32 : 0,
        padding: isDesk ? '24px 40px 40px' : '14px 16px 16px',
      }}>
        <div>
          <h1 style={{ fontSize: isDesk ? 32 : 22, fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 16px' }}>Оформление</h1>
          <Stepper step={1} steps={['Контакты', 'Доставка', 'Оплата']} />

          <Block title="1. Контактные данные">
            <Field label="Имя" value={name} onChange={setName} placeholder="Анна" />
            <Field label="Телефон" value={phone} onChange={setPhone} placeholder="+7 (___) ___-__-__" />
            <Field label="E-mail" value="" onChange={() => {}} placeholder="вы@почта.ру" />
          </Block>

          <Block title="2. Доставка">
            <RadioRow checked={delivery === 'courier'} onClick={() => setDelivery('courier')} t="Курьер" s="Завтра до 22:00 · 199 с (бесплатно от 1 500 с)" />
            <RadioRow checked={delivery === 'pickup'}  onClick={() => setDelivery('pickup')}  t="Самовывоз" s="Сегодня после 18:00 · бесплатно · 12 точек в Бишкеке" />
            <RadioRow checked={delivery === 'post'}    onClick={() => setDelivery('post')}    t="Кыргыз Почтасы" s="3–7 дней · от 199 с" />
            {delivery !== 'pickup' && (
              <Field label="Адрес доставки" value={addr} onChange={setAddr} placeholder="Бишкек, ул. Чуй, 1, кв 5" />
            )}
          </Block>

          <Block title="3. Оплата">
            <RadioRow checked={pay === 'sbp'}   onClick={() => setPay('sbp')}   t="СБП"          s="Через приложение банка · без комиссии" />
            <RadioRow checked={pay === 'card'}   onClick={() => setPay('card')}  t="Картой онлайн" s="Visa, Mastercard, МИР" />
            <RadioRow checked={pay === 'split'}  onClick={() => setPay('split')} t="Долями"        s="4 платежа без переплат · одобрение за 1 минуту" />
            <RadioRow checked={pay === 'cash'}   onClick={() => setPay('cash')}  t="При получении" s="Наличными или картой курьеру" />
          </Block>

          {!isDesk && <Button block size="lg" onClick={place} style={{ marginTop: 16 }}>Оформить · {fmtRub(total)}</Button>}
        </div>

        <div style={{ position: isDesk ? 'sticky' : 'static', top: 20, alignSelf: 'flex-start' }}>
          <div style={{ background: t.surface, borderRadius: 16, padding: 20, boxShadow: `inset 0 0 0 1.5px ${t.border}` }}>
            <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 12 }}>Ваш заказ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12, maxHeight: 220, overflowY: 'auto' }}>
              {cart.list.slice(0, 4).map((p) => (
                <div key={p.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, flexShrink: 0 }}><ProductImage p={p} padding={4} /></div>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 12 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ color: t.muted }}>×{p.qty}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>{fmtRub(p.price * p.qty)}</div>
                </div>
              ))}
              {cart.list.length > 4 && <div style={{ fontSize: 12, color: t.muted }}>и ещё {cart.list.length - 4}…</div>}
            </div>
            <Row k="Товары" v={fmtRub(cart.subtotal)} />
            <Row k="Скидка" v={`−${fmtRub(cart.saved)}`} accent />
            <Row k="Доставка" v={deliveryFee === 0 ? 'Бесплатно' : fmtRub(deliveryFee)} />
            <div style={{ borderTop: `1.5px dashed ${t.border}`, margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>К оплате</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: t.primary }}>{fmtRub(total)}</span>
            </div>
            {isDesk && <Button block size="lg" onClick={place}>Оформить</Button>}
            <div style={{ fontSize: 11, color: t.muted, textAlign: 'center', marginTop: 10 }}>
              Нажимая «Оформить», вы соглашаетесь с условиями и обработкой персональных данных.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
