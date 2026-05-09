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
  { id: 'b1', kicker: 'Скидка дня',       title: '−40% на всю декоративку',  sub: 'Maybelline · Loreal · Essence', cta: 'Забрать',   accent: 'primary' },
  { id: 'b2', kicker: 'Привет, новенький', title: '300 с на первый заказ',    sub: 'Промокод: ПЕРВЫЙ',              cta: 'Применить', accent: 'accent' },
  { id: 'b3', kicker: 'Новинки',          title: 'Корейский уход уже у нас',  sub: 'COSRX · Mizon · The Saem',      cta: 'Смотреть',  accent: 'orange' },
];
