# Redesign spec — "Classical" system → Оптовые Цены

Source: `commands/styles/ds-reference/` (`theme.json`, `readme.md`, foundation/component HTML pages).
`styles.css`, `templates/`, `assets/` referenced by that readme were **not** included in the bundle — exact ramp hexes, spacing px and shadow values aren't materialized. Everything below is derived from `theme.json`'s seed params + the written guidance. Generate the actual 9-step OKLCH ramps at implementation time (design tool or a small script) rather than hand-guessing hex values — hand-picked steps will drift from "same perceptual weight per step" the system promises.

This is a **spec to work from**, not applied code. Nothing in the live app changes until you act on it.

---

## 1. What's changing (identity swap, not a tweak)

| Axis | Now (live) | Classical |
|---|---|---|
| Font | Manrope only | Cormorant Garamond (headings) + Lora (body) |
| Styling | Inline JS objects via `useTheme()`, no CSS files | Single `styles.css`, CSS custom properties |
| Palette | Magenta `#E6097A` / yellow `#F4D423` / orange `#F89020`, 3 active themes | Mono bronze `#b68235` on near-white, single palette |
| Buttons/cards | Solid CTAs, filled price tags | Outline-only, color as stroke, no fills |
| Icons | Custom SVG functions (`Icon.jsx`) | Lucide icon set |
| Elevation | — | Whisper shadows (`--shadow-sm/md/lg`), no heavy drop shadows |

Every row above is a `CLAUDE.md` / `commands/styles.md` **Key Rule** today. Redesigning means those rules get rewritten as part of the work, not just the components.

---

## 2. Color

theme.json seed:
```
bg #f3f2f2   surface #eae9e9   text #201f1d
accent #b68235   accent2 #ac803e (near-duplicate — treat as one role, mono scheme)
```

Ramp rule (from readme): each role gets a 100–900 tonal ramp generated in OKLCH on a shared perceptual lightness scale.
- 100–300 → tints, hovers, subtle borders
- 500 → the role's base
- 700–900 → text-on-tint, pressed states

Contrast note: accent-on-ground is only ~3:1 — fine for icons/chrome, **not** body text. Paragraph-size accent text must use the 700 step, not the raw accent.

### Mapping to project's `t.*` shape (`src/shared/theme.jsx`)

| `t.*` token | Classical value |
|---|---|
| `t.bg` / `t.pageBg` | `#f3f2f2` |
| `t.surface` / `t.surfaceAlt` | `#eae9e9` |
| `t.ink` | `#201f1d` |
| `t.muted` | accent-neutral 500–600 step (needs generated ramp) |
| `t.primary` | `#b68235` |
| `t.primaryDark` | accent 700 step |
| `t.accent` / `t.accent2` | same value — mono scheme, no second hue |
| `t.border` | hairline — accent-neutral 200 step, low alpha |
| `t.headerBg` / `t.headerInk` | surface / ink — no colored header bar in this system |
| `t.cardBg` | bordered, not filled — see open decision below |
| `t.priceTagBg` / `t.priceTagInk` | conflicts with "color as stroke" — see open decision |
| `t.btnBg` / `t.btnInk` | transparent bg + accent border — current shape has no "border-only button" token |
| `t.discountBg` / `t.discountInk` | tag styling, accent ramp tint |

**Gaps**: the current token shape assumes filled buttons/price tags/cards. Classical draws everything with borders. You'll need new tokens (e.g. `t.btnBorder`, `t.cardBorder`) rather than repurposing the fill tokens — repurposing would silently break any place still expecting a filled surface.

---

## 3. Type

- Headings: Cormorant Garamond, weights 400/600 — bold is never used, semibold is the ceiling
- Body: Lora
- Scale: H1 42 · H2 32 · H3 25 · body 15 · caption 13
- Body copy is **justified**; tight leading
- Bigger text = lighter weight (display sizes take the normal cut, not heavier)
- Tabular numerals for kickers/tables/figures (prices, ratings counts); running prose keeps text figures

Rule change required: `CLAUDE.md` Key Rules says "Font is **Manrope** only. Do not introduce other fonts." That line has to be rewritten, and `index.html`'s Google Fonts `<link>` swapped to load Cormorant Garamond + Lora.

---

## 4. Layout & spacing

- Base unit 4px, density multiplier 1.15× — i.e. the existing spacing scale gets scaled up ~15%, not replaced
- Radius flat at 4px everywhere (current app likely has larger/varied radii on cards, buttons, price tags — audit and flatten)
- Hairline dividers between sections instead of surface-color blocks
- Justified grid, generous whitespace — "Do" section in the reference explicitly says don't crowd margins

---

## 5. Components — mapping to existing project components

| Classical class | Project component | Change needed |
|---|---|---|
| `.btn-primary/-secondary/-ghost/-icon/-block` | `Button.jsx` | `variant="primary"` currently implies filled — needs an outline treatment; `outline`/`ghost` variants already exist and are the closer starting point |
| `.tag` | `HitBadge.jsx`, `DiscountBadge.jsx` | switch from filled pill to outline/tinted tag |
| `.card` + `.elev-sm/md/lg` | `ProductCard.jsx` | border instead of filled `cardBg`; shadows go from whatever's current to the whisper-level `--shadow-*` |
| `.field`/`.input`/`.radio`/`.seg` | checkout form fields | restyle to bordered native-element look, no custom chrome |
| `.nav` | `TopBar.jsx` / `MobileHeader.jsx` | header loses the magenta fill, becomes surface-colored with a hairline bottom border |
| `.table` | none currently — n/a unless checkout/orders gets a table view | |
| `.dialog` | none currently — n/a unless a modal gets added | |
| `.plate` | `ProductImage.jsx` | wrap generated product art in a matted border instead of edge-to-edge |

### Open decision: price tags

`PriceTag.jsx` currently renders a **filled** magenta/yellow chip (`t.priceTagBg`/`t.priceTagInk`) — this is a merchandising signal, not decoration. Classical's "color as stroke, never fill" rule would flatten that into a bordered tag, which may hurt scannability on a discount-driven catalog. Decide explicitly whether price tags are an intentional exception to the stroke-only rule, or whether they follow it like everything else — don't let this get decided implicitly by whoever codes it first.

---

## 6. Icons — dependency conflict

Classical specifies **Lucide** icons throughout. `CLAUDE.md` currently locks dependencies to `@supabase/supabase-js` only, "ask before adding others." Lucide would be a new external package (or hand-copied SVGs, avoiding the dependency but losing auto-updates). This needs an explicit yes/no before implementation — flagging here so it isn't added silently mid-redesign.

---

## 7. Do / Don't (carried from the reference, apply as-is)

**Do**: justify body copy at a comfortable measure; draw structure with borders/rules/underlines; keep the airy 1.15× spacing; mat photographs with a plate-style wrapper.

**Don't**: fill cards or buttons with solid accent color; use heavy drop shadows; tighten leading or crowd margins; swap in a sans-serif for emphasis (weight/italics carry that job instead).

---

## 8. Sequencing checklist

1. Decide the 4 open items above: font-rule rewrite, Lucide dependency, price-tag exception, whether this replaces all 3 themes or becomes a 4th theme variant alongside `magnit`/`noir`/`boutique`.
2. Generate the real OKLCH ramps from the `theme.json` anchors (100–900 per role) — don't hand-pick hexes.
3. Add new border-only tokens to `THEMES` in `src/shared/theme.jsx` rather than repurposing fill tokens.
4. Update `index.html` fonts, `commands/styles.md`, and `CLAUDE.md` Key Rules together so they stop contradicting the code.
5. Work outward from `Button.jsx` and `ProductCard.jsx` (highest reuse) before touching page-level layouts.
