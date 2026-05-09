# Оптовые Цены — Claude Context

B2C e-commerce for cosmetics/perfumery (Kyrgyzstan/Bishkek). Currency: сом (с). Production React app.

## Quick Reference

@commands/overview.md
@commands/architecture.md
@commands/styles.md
@commands/data.md
@commands/components.md

## Key Rules

- All styles are **inline JS objects** via `useTheme()`. No CSS files, no Tailwind, no class names.
- Font is **Manrope** only. Do not introduce other fonts.
- Every component must work across all 4 themes — always use `t.*` tokens, never hardcode colors.
- Each artboard in `App.jsx` is fully isolated: own theme, own cart, own router. Do not share state across artboards.
- No external dependencies beyond React 18 + Vite. Do not add libraries without asking.
- UI text is in **Russian**.

## Dev Server

```bash
npm run dev   # http://localhost:5173
npm run build
```

## Custom Slash Commands

| Command                   | What it does                          |
|--------------------------|---------------------------------------|
| `/project:context`        | Load all context docs                 |
| `/project:new-screen`     | Add a new screen (pass screen name)   |
| `/project:new-theme`      | Add a new theme variant               |
| `/project:add-product`    | Add products to catalog               |
