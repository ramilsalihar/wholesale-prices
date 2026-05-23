import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useCart } from '../features/cart.jsx';
import { useAuth } from '../features/auth.jsx';
import { fmtRub } from '../entities/product/model.js';
import { Button } from '../shared/ui/Button.jsx';
import { ProductImage } from '../entities/product/ProductImage.jsx';
import { createOrder } from '../service/orders.js';
import { fetchProfile } from '../service/profile.js';

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

function Field({ label, value, onChange, placeholder, type = 'text', required, error }) {
  const t = useTheme();
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 12, color: error ? '#DE350B' : t.muted, fontWeight: 700, marginBottom: 4 }}>
        {label}{required && <span style={{ color: '#DE350B' }}> *</span>}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 10,
          border: `1.5px solid ${error ? '#DE350B' : t.border}`,
          background: error ? 'rgba(222,53,11,0.04)' : t.bg,
          color: t.ink, fontSize: 14, fontFamily: 'inherit',
          outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
      />
      {error && <div style={{ fontSize: 11, color: '#DE350B', marginTop: 4, fontWeight: 600 }}>{error}</div>}
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
  const { user } = useAuth();
  const isDesk = device === 'desktop';

  const [delivery, setDelivery] = React.useState('courier');
  const [pay, setPay] = React.useState('card');
  const [name, setName] = React.useState(user?.user_metadata?.full_name ?? '');
  const [phone, setPhone] = React.useState('+996 ');
  const [email, setEmail] = React.useState(user?.email ?? '');
  const [addr, setAddr] = React.useState('');
  const [placing, setPlacing] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [savedProfile, setSavedProfile] = React.useState(null);
  const [profileApplied, setProfileApplied] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then(p => {
      if (p && (p.full_name || p.phone || p.address)) setSavedProfile(p);
    }).catch(() => {});
  }, [user?.id]);

  function applyProfile() {
    if (!savedProfile) return;
    if (savedProfile.full_name) setName(savedProfile.full_name);
    if (savedProfile.phone) setPhone(savedProfile.phone);
    if (savedProfile.address) setAddr(savedProfile.address);
    setProfileApplied(true);
  }

  const deliveryFee = delivery === 'pickup' ? 0 : (cart.subtotal >= 1500 ? 0 : 199);
  const total = cart.subtotal + deliveryFee;

  function handlePhoneChange(val) {
    // Always keep +996 prefix
    if (!val.startsWith('+996')) {
      setPhone('+996 ');
      return;
    }
    // Allow only digits and spaces after +996
    const suffix = val.slice(4).replace(/[^\d\s]/g, '');
    setPhone('+996' + (suffix ? ' ' + suffix.trim().replace(/\s+/g, ' ') : ' '));
  }

  function validate() {
    const errs = {};
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 12) errs.phone = 'Введите номер в формате +996 XXX XXX XXX';
    if (!name.trim()) errs.name = 'Введите имя';
    if (delivery !== 'pickup' && !addr.trim()) errs.addr = 'Укажите адрес доставки';
    return errs;
  }

  async function place() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setPlacing(true);
    try {
      const order = await createOrder({
        items: cart.list.map(p => ({ id: p.id, name: p.name, brand: p.brand, price: p.price, qty: p.qty })),
        subtotal: cart.subtotal,
        delivery: deliveryFee,
        total,
        phone: phone.trim(),
        address: addr.trim() || null,
        city: 'Бишкек',
        payMethod: pay,
        deliveryMethod: delivery,
        userName: name.trim() || null,
        email: email.trim() || null,
        userId: user?.id ?? null,
        notes: null,
      });
      cart.clear();
      router.go({ screen: 'order_done', orderId: order.id, orderNum: order.id.slice(0, 8).toUpperCase() });
    } catch (e) {
      setFieldErrors({ submit: e.message || 'Ошибка при оформлении заказа' });
    } finally {
      setPlacing(false);
    }
  }

  const PlaceButton = ({ block }) => (
    <Button block={block} size="lg" onClick={place} disabled={placing} style={{ opacity: placing ? 0.7 : 1 }}>
      {placing ? 'Оформляем...' : (block && !isDesk ? `Оформить · ${fmtRub(total)}` : 'Оформить')}
    </Button>
  );

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%', overflowX: 'hidden', width: '100%' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesk ? '1.4fr 1fr' : '1fr',
        gap: isDesk ? 32 : 0,
        padding: isDesk ? '24px 40px 40px' : '14px 16px 16px',
      }}>
        <div>
          <h1 style={{ fontSize: isDesk ? 32 : 22, fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 16px' }}>Оформление</h1>
          <Stepper step={1} steps={['Контакты', 'Доставка', 'Оплата']} />

          {savedProfile && !profileApplied && (
            <div style={{
              background: `${t.primary}0c`, border: `1.5px solid ${t.primary}30`,
              borderRadius: 14, padding: '12px 14px', marginBottom: 12,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: t.primary, marginBottom: 3 }}>💾 Сохранённые данные</div>
                <div style={{ fontSize: 12, color: t.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {[savedProfile.full_name, savedProfile.phone, savedProfile.address].filter(Boolean).join(' · ')}
                </div>
              </div>
              <button onClick={applyProfile} style={{
                background: t.primary, color: '#fff', border: 'none',
                padding: '8px 14px', borderRadius: 10,
                fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
              }}>Применить</button>
            </div>
          )}

          <Block title="1. Контактные данные">
            <Field
              label="Имя" value={name} onChange={v => { setName(v); setFieldErrors(e => ({ ...e, name: '' })); }}
              placeholder="Айгерим" required
              error={fieldErrors.name}
            />
            <Field
              label="Телефон" value={phone}
              onChange={v => { handlePhoneChange(v); setFieldErrors(e => ({ ...e, phone: '' })); }}
              placeholder="+996 700 123 456" required
              error={fieldErrors.phone}
            />
            <Field
              label="E-mail" type="email" value={email}
              onChange={v => { setEmail(v); setFieldErrors(e => ({ ...e, email: '' })); }}
              placeholder="вы@почта.kg"
            />
          </Block>

          <Block title="2. Доставка">
            <RadioRow checked={delivery === 'courier'} onClick={() => setDelivery('courier')} t="Курьер" s="Завтра до 22:00 · 199 с (бесплатно от 1 500 с)" />
            <RadioRow checked={delivery === 'pickup'}  onClick={() => setDelivery('pickup')}  t="Самовывоз" s="Сегодня после 18:00 · бесплатно · 4 точки в Бишкеке" />
            {delivery !== 'pickup' && (
              <Field
                label="Адрес доставки" value={addr}
                onChange={v => { setAddr(v); setFieldErrors(e => ({ ...e, addr: '' })); }}
                placeholder="Бишкек, ул. Чуй, 1, кв 5" required
                error={fieldErrors.addr}
              />
            )}
          </Block>

          <Block title="3. Оплата">
            <RadioRow checked={pay === 'card'} onClick={() => setPay('card')} t="Картой онлайн" s="Visa, Финик" />
            <RadioRow checked={pay === 'cash'} onClick={() => setPay('cash')} t="При получении"  s="Наличными или картой курьеру" />
          </Block>

          {fieldErrors.submit && (
            <div style={{ background: 'rgba(222,53,11,0.06)', border: '1px solid rgba(222,53,11,0.2)', color: '#DE350B', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 12 }}>
              {fieldErrors.submit}
            </div>
          )}

          {!isDesk && <PlaceButton block />}
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
            {isDesk && <PlaceButton block />}
            <div style={{ fontSize: 11, color: t.muted, textAlign: 'center', marginTop: 10 }}>
              Нажимая «Оформить», вы соглашаетесь с условиями и обработкой персональных данных.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
