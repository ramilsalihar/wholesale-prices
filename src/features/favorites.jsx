import React from 'react';
import { useData } from './data.jsx';

export const FavoritesContext = React.createContext(null);
export const useFavorites = () => React.useContext(FavoritesContext);

export function FavoritesProvider({ children }) {
  const { products } = useData();
  const [ids, setIds] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('favorites') || '[]')); } catch { return new Set(); }
  });

  React.useEffect(() => { localStorage.setItem('favorites', JSON.stringify([...ids])); }, [ids]);
  const toggle = (id) => setIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const has = (id) => ids.has(id);
  const list = products.filter((p) => ids.has(p.id));
  const count = ids.size;
  return (
    <FavoritesContext.Provider value={{ toggle, has, list, count }}>
      {children}
    </FavoritesContext.Provider>
  );
}
