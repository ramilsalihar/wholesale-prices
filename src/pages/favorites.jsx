import React from 'react';
import { useTheme } from '../shared/theme.jsx';
import { useRouter } from '../shared/router.jsx';
import { useFavorites } from '../features/favorites.jsx';
import { Button } from '../shared/ui/Button.jsx';
import { ProductCard } from '../entities/product/ProductCard.jsx';

export function FavoritesScreen({ device }) {
  const t = useTheme();
  const router = useRouter();
  const favs = useFavorites();
  const isDesk = device === 'desktop';

  if (!favs || favs.list.length === 0) {
    return (
      <div style={{
        background: t.bg, color: t.ink, minHeight: '100%',
        padding: '60px 24px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14,
      }}>
        <div style={{ fontSize: 56 }}>🤍</div>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.01em' }}>Избранное пусто</div>
        <div style={{ fontSize: 14, color: t.muted, maxWidth: 280 }}>
          Нажимайте на ♥ на карточках товаров — они сохранятся здесь.
        </div>
        <Button size="lg" onClick={() => router.go({ screen: 'catalog' })}>Перейти в каталог</Button>
      </div>
    );
  }

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: '100%' }}>
      <div style={{ padding: isDesk ? '24px 40px 40px' : '14px 16px 16px' }}>
        <h1 style={{ fontSize: isDesk ? 32 : 22, fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 20px' }}>
          Избранное · {favs.list.length}
        </h1>
        <div style={{
          display: 'grid', gap: isDesk ? 16 : 10,
          gridTemplateColumns: isDesk ? 'repeat(auto-fill, minmax(190px, 1fr))' : 'repeat(2, 1fr)',
        }}>
          {favs.list.map((p) => (
            <ProductCard key={p.id} p={p} onClick={() => router.go({ screen: 'pdp', id: p.id })} />
          ))}
        </div>
      </div>
    </div>
  );
}
