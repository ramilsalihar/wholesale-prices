/**
 * @typedef {Object} Category
 * @property {string} id     - Category identifier
 * @property {string} ru     - Display name in Russian
 * @property {string} emoji  - Representative emoji
 */

/** @type {Category[]} */
export const CATEGORIES = [
  { id: 'face',   ru: 'Уход за лицом',  emoji: '🌸' },
  { id: 'hair',   ru: 'Волосы',          emoji: '💇' },
  { id: 'body',   ru: 'Тело',            emoji: '🧴' },
  { id: 'makeup', ru: 'Макияж',          emoji: '💄' },
  { id: 'parfum', ru: 'Парфюмерия',      emoji: '🌷' },
  { id: 'mens',   ru: 'Мужское',         emoji: '🪒' },
  { id: 'kids',   ru: 'Детское',         emoji: '🧸' },
  { id: 'home',   ru: 'Дом',             emoji: '🏠' },
  { id: 'gifts',  ru: 'Подарки',         emoji: '🎁' },
];
