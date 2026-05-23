import React from 'react';
import { useData } from './data.jsx';

export const CartContext = React.createContext(null);
export const useCart = () => React.useContext(CartContext);

export function CartProvider({ children }) {
  const { products } = useData();
  const [items, setItems] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('cart_items') || '{}'); } catch { return {}; }
  });
  const [giftBoxes, setGiftBoxes] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('cart_giftboxes') || '[]'); } catch { return []; }
  });

  React.useEffect(() => { localStorage.setItem('cart_items', JSON.stringify(items)); }, [items]);
  React.useEffect(() => { localStorage.setItem('cart_giftboxes', JSON.stringify(giftBoxes)); }, [giftBoxes]);

  const add = (id, qty = 1) => setItems((s) => ({ ...s, [id]: (s[id] || 0) + qty }));
  const remove = (id) => setItems((s) => { const next = { ...s }; delete next[id]; return next; });
  const setQty = (id, qty) => setItems((s) => {
    if (qty <= 0) { const next = { ...s }; delete next[id]; return next; }
    return { ...s, [id]: qty };
  });
  const clear = () => { setItems({}); setGiftBoxes([]); };

  const addGiftBox = (box) => setGiftBoxes(prev => [...prev, { ...box, id: 'gb_' + Date.now() }]);
  const removeGiftBox = (id) => setGiftBoxes(prev => prev.filter(b => b.id !== id));

  const list = Object.entries(items).map(([id, qty]) => {
    const p = products.find((x) => x.id === id);
    return p ? { ...p, qty } : null;
  }).filter(Boolean);

  const subtotal = list.reduce((a, x) => a + x.price * x.qty, 0)
    + giftBoxes.reduce((a, b) => a + b.totalPrice, 0);
  const oldTotal = list.reduce((a, x) => a + (x.old || x.price) * x.qty, 0);
  const saved = oldTotal - list.reduce((a, x) => a + x.price * x.qty, 0);
  const count = Object.values(items).reduce((a, b) => a + b, 0) + giftBoxes.length;

  return (
    <CartContext.Provider value={{
      items, list, add, remove, setQty, clear, count, subtotal, saved,
      giftBoxes, addGiftBox, removeGiftBox,
    }}>
      {children}
    </CartContext.Provider>
  );
}
