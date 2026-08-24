/**
 * @typedef {'primary'|'accent'|'orange'} BannerAccent
 *
 * @typedef {Object} Banner
 * @property {string} id          - Unique identifier
 * @property {string} kicker      - Small label above the title
 * @property {string} title       - Main headline
 * @property {string} sub         - Subtitle / supporting text
 * @property {string} cta         - Call-to-action button label
 * @property {BannerAccent} accent - Color scheme key
 */

/** @type {Banner[]} */
export const BANNERS = [
  { id: 'b1', kicker: 'Скидка дня',       title: '−30% на все монобукеты',    sub: 'Розы · Тюльпаны · Пионы',      cta: 'Забрать',   accent: 'primary' },
  { id: 'b2', kicker: 'Привет, новенький', title: '300 с на первый заказ',     sub: 'Промокод: ПЕРВЫЙ',              cta: 'Применить', accent: 'accent' },
  { id: 'b3', kicker: 'Ко Дню всех влюблённых', title: 'Романтичные букеты уже в каталоге', sub: 'Доставка день в день', cta: 'Смотреть',  accent: 'orange' },
];
