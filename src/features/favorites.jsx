import React from 'react';
import { PRODUCTS } from '../entities/product/model.js';

export const FavoritesContext = React.createContext(null);
export const useFavorites = () => React.useContext(FavoritesContext);

export function FavoritesProvider({ children }) {
  const [ids, setIds] = React.useState(new Set());
  const toggle = (id) => setIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const has = (id) => ids.has(id);
  const list = PRODUCTS.filter((p) => ids.has(p.id));
  const count = ids.size;
  return (
    <FavoritesContext.Provider value={{ toggle, has, list, count }}>
      {children}
    </FavoritesContext.Provider>
  );
}
