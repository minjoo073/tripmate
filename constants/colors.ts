export const Colors = {
  // Core palette
  primary: '#3B5178',        // Muted Navy
  primaryLight: '#EBF0F8',   // Soft Blue-Gray
  accent: '#C4875A',         // Sunset Warm (use sparingly)
  accentLight: '#F5EDE4',    // Warm Ivory tint
  olive: '#6E7D62',          // Olive Gray (verified)
  dustBlue: '#6B8CAD',       // Dust Blue

  // Dark theme (for confirmed / special screens)
  darkBg: '#1E222A',         // Deep Charcoal Navy — "밤 비행기 + 도시 야경"
  darkCard: 'rgba(255,255,255,0.04)',
  darkBorder: 'rgba(255,255,255,0.08)',
  darkBorder2: 'rgba(255,255,255,0.14)',
  muteGold: '#C6A56A',       // Muted Gold (replaces warm brown)
  muteGoldFaint: 'rgba(198,165,106,0.15)',
  muteGoldBorder: 'rgba(198,165,106,0.3)',

  // Backgrounds
  bg: '#F8F4EF',             // Warm Ivory
  bgDeep: '#F0EAE2',         // Soft Beige
  bgCard: '#FDFBF9',         // Near-white warm

  // Surfaces
  card: '#FFFFFF',
  cardBorder: '#EAE4DC',     // Warm sand border
  cardShadow: 'rgba(42, 33, 24, 0.05)',

  // Text
  textPrimary: '#2A2118',    // Warm near-black
  textSecondary: '#7A706A',  // Warm gray
  textMuted: '#ADA49C',      // Muted warm gray
  textOnDark: '#FFFFFF',

  // Legacy aliases
  white: '#FFFFFF',
  stamp: '#8B4040',
  inputBg: '#FFFFFF',
  inputBorder: '#EAE4DC',
  navBorder: '#EAE4DC',
  textPlaceholder: '#ADA49C',
  cardDark: '#1C3F4F',
  chatBg: '#F0EAE2',
  primaryBg: '#EBF0F8',
  pointYellow: '#E8C882',
  pointBlueGray: '#EBF0F8',
  pointPurple: 'rgba(180, 140, 160, 0.20)',
  pointTeal: '#B4D9CC',
  shadowCard: 'rgba(42, 33, 24, 0.04)',
  shadowButton: 'rgba(59, 81, 120, 0.18)',
  success: '#B4D9CC',
  warm: '#C4875A',
  green: '#5B9E6E',
  red: '#C05050',
};

export const Typography = {
  h1: { fontSize: 30, fontWeight: '300' as const, lineHeight: 40, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '400' as const, lineHeight: 30, letterSpacing: -0.3 },
  h3: { fontSize: 17, fontWeight: '500' as const, lineHeight: 24 },
  editorial: { fontSize: 26, fontWeight: '300' as const, lineHeight: 36, letterSpacing: -0.5 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 11, fontWeight: '400' as const, lineHeight: 16, letterSpacing: 0.3 },
  label: { fontSize: 10, fontWeight: '700' as const, lineHeight: 16, letterSpacing: 2.5, textTransform: 'uppercase' as const },
};

// Font families — SUIT for web, system for native
export const Font = {
  base: 'SUIT, -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
  serif: '"Cormorant Garamond", "Georgia", serif',
};
