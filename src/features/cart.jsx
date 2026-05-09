import React from 'react';
import { PRODUCTS } from '../entities/product/model.js';

export const CartContext = React.createContext(null);
export const useCart = () => React.useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = React.useState({});
  const add = (id, qty = 1) => setItems((s) => ({ ...s, [id]: (s[id] || 0) + qty }));
  const remove = (id) => setItems((s) => { const next = { ...s }; delete next[id]; return next; });
  const setQty = (id, qty) => setItems((s) => {
    if (qty <= 0) { const next = { ...s }; delete next[id]; return next; }
    return { ...s, [id]: qty };
  });
  const clear = () => setItems({});
  const count = Object.values(items).reduce((a, b) => a + b, 0);
  const list = Object.entries(items).map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return p ? { ...p, qty } : null;
  }).filter(Boolean);
  const subtotal = list.reduce((a, x) => a + x.price * x.qty, 0);
  const oldTotal = list.reduce((a, x) => a + (x.old || x.price) * x.qty, 0);
  const saved = oldTotal - subtotal;
  return (
    <CartContext.Provider value={{ items, list, add, remove, setQty, clear, count, subtotal, saved }}>
      {children}
    </CartContext.Provider>
  );
}
