/**
 * @typedef {Object} Category
 * @property {string} id     - Category identifier
 * @property {string} ru     - Display name in Russian
 * @property {string} emoji  - Representative emoji
 */

/** @type {Category[]} */
export const CATEGORIES = [
  { id: 'bouquets',   ru: 'Букеты',                 emoji: '💐' },
  { id: 'box',        ru: 'Композиции в коробках',  emoji: '🎁' },
  { id: 'mono',       ru: 'Моно-букеты',             emoji: '🌷' },
  { id: 'wedding',    ru: 'Свадебная флористика',    emoji: '👰' },
  { id: 'plants',     ru: 'Комнатные растения',      emoji: '🪴' },
  { id: 'potted',     ru: 'Кашпо и горшечные',       emoji: '🏺' },
  { id: 'sympathy',   ru: 'Траурные композиции',     emoji: '🕊️' },
  { id: 'seasonal',   ru: 'Сезонные предложения',    emoji: '🌸' },
  { id: 'gifts',      ru: 'Подарочные наборы',       emoji: '🎀' },
];
