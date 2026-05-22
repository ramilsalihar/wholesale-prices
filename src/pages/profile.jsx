import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useAuth } from '../features/auth.jsx';
import { useNotification } from '../features/notification.jsx';
import { fetchProfile, upsertProfile } from '../service/profile.js';

function Skel({ w = '100%', h = 14, r = 8, mb = 0 }) {
  const t = useTheme();
  return (
    <div style={{
      width: w, height: h, borderRadius: r, marginBottom: mb, flexShrink: 0,
      background: `linear-gradient(90deg, ${t.surfaceAlt} 25%, ${t.border} 50%, ${t.surfaceAlt} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'skel-shimmer 1.4s ease infinite',
    }} />
  );
}

function SkelField() {
  const t = useTheme();
  return (
    <div>
      <Skel w={80} h={11} r={6} mb={8} />
      <Skel w="100%" h={46} r={12} />
    </div>
  );
}

function SkelSection({ fields = 2 }) {
  const t = useTheme();
  return (
    <div style={{ marginBottom: 20 }}>
      <Skel w={120} h={11} r={6} mb={12} />
      <div style={{ background: t.surface, borderRadius: 16, padding: '16px', boxShadow: `inset 0 0 0 1px ${t.border}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Array.from({ length: fields }).map((_, i) => <SkelField key={i} />)}
      </div>
    </div>
  );
}

function ProfileSkeleton({ isDesk }) {
  return (
    <>
      <style>{`@keyframes skel-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <SkelSection fields={3} />
      <SkelSection fields={2} />
      <Skel w="100%" h={52} r={14} mb={12} />
      <Skel w="100%" h={46} r={14} />
    </>
  );
}

function Section({ title, children }) {
  const t = useTheme();
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: t.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ background: t.surface, borderRadius: 16, padding: '16px 16px', boxShadow: `inset 0 0 0 1px ${t.border}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

export function ProfileScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const notify = useNotification();
  const isDesk = device === 'desktop';

  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('Бишкек');
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    setFullName(user.user_metadata?.full_name ?? '');
    fetchProfile(user.id)
      .then(p => {
        if (p) {
          if (p.full_name) setFullName(p.full_name);
          if (p.phone) setPhone(p.phone);
          if (p.address) setAddress(p.address);
          if (p.city) setCity(p.city);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  function handlePhoneFocus() {
    if (!phone) setPhone('+996 ');
  }

  function handlePhoneChange(v) {
    if (!v.startsWith('+996')) v = '+996 ' + v.replace(/^\+?996?\s*/, '');
    setPhone(v);
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await upsertProfile(user.id, {
        full_name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim() || 'Бишкек',
      });
      notify?.show('Профиль сохранён ✓');
    } catch (e) {
      notify?.show('Ошибка: ' + (e.message || 'попробуйте снова'));
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.go({ screen: 'home' });
  }

  if (!user) {
    return (
      <div style={{ background: t.bg, color: t.ink, minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>Вы не вошли</div>
          <button onClick={() => router.back()} style={{
            background: t.primary, color: '#fff', border: 'none', borderRadius: 12,
            padding: '12px 24px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer',
          }}>Назад</button>
        </div>
      </div>
    );
  }

  const avatar = user.user_metadata?.avatar_url;
  const displayName = user.user_metadata?.full_name || user.email || '';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%', paddingBottom: 40 }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${t.primary} 0%, #b8005f 100%)`,
        padding: isDesk ? '32px 40px 28px' : '24px 16px 20px',
        color: '#fff',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        {avatar ? (
          <img src={avatar} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)', flexShrink: 0 }} />
        ) : (
          <div style={{
            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 900,
          }}>{initials}</div>
        )}
        <div>
          <div style={{ fontSize: isDesk ? 22 : 18, fontWeight: 900, letterSpacing: '-0.01em' }}>{displayName || 'Пользователь'}</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{user.email}</div>
        </div>
      </div>

      <div style={{ padding: isDesk ? '28px 40px' : '20px 16px' }}>
        {loading ? (
          <ProfileSkeleton isDesk={isDesk} />
        ) : (
          <>
            <Section title="Контактные данные">
              <label style={{ display: 'block' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.muted, marginBottom: 6 }}>Имя</div>
                <input
                  value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Айгуль Асанова"
                  style={{ width: '100%', padding: '13px 14px', borderRadius: 12, border: `1.5px solid ${t.border}`, background: t.bg, color: t.ink, fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </label>
              <label style={{ display: 'block' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.muted, marginBottom: 6 }}>Телефон</div>
                <input
                  value={phone}
                  onFocus={handlePhoneFocus}
                  onChange={e => handlePhoneChange(e.target.value)}
                  placeholder="+996 (700) 000-000"
                  type="tel"
                  style={{ width: '100%', padding: '13px 14px', borderRadius: 12, border: `1.5px solid ${t.border}`, background: t.bg, color: t.ink, fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </label>
              <label style={{ display: 'block' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.muted, marginBottom: 6 }}>E-mail</div>
                <input
                  value={user.email}
                  readOnly
                  style={{ width: '100%', padding: '13px 14px', borderRadius: 12, border: `1.5px solid ${t.border}`, background: t.surfaceAlt, color: t.muted, fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', cursor: 'not-allowed' }}
                />
                <div style={{ fontSize: 11, color: t.muted, marginTop: 4 }}>Привязан к Google-аккаунту</div>
              </label>
            </Section>

            <Section title="Адрес доставки">
              <label style={{ display: 'block' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.muted, marginBottom: 6 }}>Город</div>
                <input
                  value={city} onChange={e => setCity(e.target.value)}
                  placeholder="Бишкек"
                  style={{ width: '100%', padding: '13px 14px', borderRadius: 12, border: `1.5px solid ${t.border}`, background: t.bg, color: t.ink, fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </label>
              <label style={{ display: 'block' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.muted, marginBottom: 6 }}>Адрес</div>
                <input
                  value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="ул. Чуй, 1, кв. 5"
                  style={{ width: '100%', padding: '13px 14px', borderRadius: 12, border: `1.5px solid ${t.border}`, background: t.bg, color: t.ink, fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </label>
            </Section>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: '100%', padding: '15px', borderRadius: 14, border: 'none',
                background: saving ? t.border : t.primary, color: saving ? t.muted : '#fff',
                fontSize: 16, fontWeight: 900, cursor: saving ? 'default' : 'pointer',
                fontFamily: 'inherit', marginBottom: 12, transition: 'background 0.15s',
              }}
            >
              {saving ? 'Сохраняем…' : 'Сохранить изменения'}
            </button>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              style={{
                width: '100%', padding: '13px', borderRadius: 14,
                border: `1.5px solid ${t.border}`, background: 'transparent',
                color: t.muted, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Выйти из аккаунта
            </button>
          </>
        )}
      </div>
    </div>
  );
}
