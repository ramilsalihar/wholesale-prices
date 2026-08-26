import React from 'react';

// Ramps generated from theme.json's two anchors (accent #b68235, neutral axis
// between bg #f3f2f2 and text #201f1d) via OKLCH — see
// commands/styles/redesign-spec.md §2. Steps: 100/200/300 = tints, 500 = base,
// 700-900 = text-on-tint / pressed.
// accent: 100 #fff1d0, 200 #fcdbb1, 300 #e8c08c, 400 #c99b5d, 500 #b68235,
//         600 #8c6220, 700 #614006, 800 #392000, 900 #180700
// neutral: 100 #f6f5f2, 200 #e3e1de, 300 #c9c7c3, 400 #a7a4a0, 500 #807d78,
//          600 #615e5a, 700 #403e3b, 800 #22211f, 900 #0a0908

export const THEMES = {
  classical: {
    name: 'Classical',
    desc: 'Editorial: Cormorant Garamond + Lora, bronze accent as stroke',
    bg: '#f3f2f2',
    surface: '#eae9e9',
    surfaceAlt: '#f6f5f2',
    pageBg: '#f3f2f2',
    primary: '#b68235',
    primaryDark: '#614006',
    accent: '#b68235',
    accent2: '#b68235',
    ink: '#201f1d',
    muted: '#807d78',
    border: 'rgba(32,31,29,0.12)',
    headerBg: '#eae9e9',
    headerInk: '#201f1d',
    cardBg: '#f3f2f2',
    // Price tags are an explicit exception to "color as stroke, never fill" —
    // kept filled as a merchandising signal (redesign-spec.md §5).
    priceTagBg: '#b68235',
    priceTagInk: '#f6f5f2',
    // Outline-only buttons: transparent fill, accent border + text.
    btnBg: 'transparent',
    btnInk: '#b68235',
    btnBorder: '#b68235',
    discountBg: '#fff1d0',
    discountInk: '#614006',
  },
};

export const ThemeContext = React.createContext(THEMES.classical);
export const useTheme = () => React.useContext(ThemeContext);
