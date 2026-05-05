Add a new visual theme variant.

Steps:
1. Read @commands/styles.md for the full token shape
2. Add theme object to `THEMES` in `src/store.jsx` — must define all ~18 tokens
3. Add variant entry to `VARIANTS` array in `src/App.jsx`
4. Theme auto-propagates to all screens via `useTheme()`

Theme name/description: $ARGUMENTS
