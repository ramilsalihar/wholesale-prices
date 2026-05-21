const KEY = 'optovye_gifts';

export function loadGifts() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function saveGift(gift) {
  const all = loadGifts();
  const idx = all.findIndex(g => g.id === gift.id);
  const updated = { ...gift, updatedAt: new Date().toISOString() };
  if (idx >= 0) all[idx] = updated;
  else all.unshift(updated);
  localStorage.setItem(KEY, JSON.stringify(all));
  return updated;
}

export function deleteGift(id) {
  localStorage.setItem(KEY, JSON.stringify(loadGifts().filter(g => g.id !== id)));
}

export function newGiftId() {
  return 'g' + Date.now();
}
