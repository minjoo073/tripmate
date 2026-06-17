export const Colors = {
  // Core palette
  primary: '#3B5178',        // Muted Navy
  primaryLight: '#EBF0F8',   // Soft Blue-Gray
  accent: '#C98B96',         // Brand sub — Dusty Rose (pairs with navy)
  accentLight: '#F4E6E9',    // Dusty Rose tint
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
  bg: '#F5F8FC',             // Cool Light Blue
  bgDeep: '#EBF0F6',         // Cool Blue-Gray
  bgCard: '#FAFCFF',         // Near-white cool

  // Surfaces
  card: '#FFFFFF',
  cardBorder: '#DDE4EE',     // Cool blue border
  cardShadow: 'rgba(28, 43, 58, 0.06)',

  // Text
  textPrimary: '#1C2B3A',    // Cool dark navy
  textSecondary: '#5B6E82',  // Cool blue-gray
  textMuted: '#8EA0B5',      // Cool muted blue-gray
  textOnDark: '#FFFFFF',

  // Legacy aliases
  white: '#FFFFFF',
  stamp: '#8B4040',
  inputBg: '#FFFFFF',
  inputBorder: '#DDE4EE',
  navBorder: '#DDE4EE',
  textPlaceholder: '#8EA0B5',
  cardDark: '#1C3F4F',
  chatBg: '#EBF0F6',
  primaryBg: '#EBF0F8',
  pointYellow: '#E8C882',
  pointBlueGray: '#EBF0F8',
  pointPurple: 'rgba(180, 140, 160, 0.20)',
  pointTeal: '#B4D9CC',
  shadowCard: 'rgba(42, 33, 24, 0.04)',
  shadowButton: 'rgba(59, 81, 120, 0.18)',
  success: '#B4D9CC',
  warm: '#C98B96',
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

// ── Elevation — layered, cool-navy shadows for real depth (premium feel) ──────
// Each level pairs a soft ambient shadow with a tighter key shadow via two values
// is not possible in RN, so we tune a single shadow per level toward "lifted, not
// muddy". Spread on web via elevation/boxShadow fallback.
export const Elevation = {
  none: {},
  // Resting surface — barely there, just separates card from bg
  sm: {
    shadowColor: 'rgba(28, 43, 58, 0.10)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  // Default card lift
  md: {
    shadowColor: 'rgba(28, 43, 58, 0.12)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 5,
  },
  // Featured / floating cards, sheets
  lg: {
    shadowColor: 'rgba(20, 32, 48, 0.18)',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 10,
  },
  // Hero / modal — dramatic
  xl: {
    shadowColor: 'rgba(16, 26, 40, 0.28)',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 1,
    shadowRadius: 48,
    elevation: 18,
  },
  // Primary-tinted lift for brand buttons
  primary: {
    shadowColor: 'rgba(59, 81, 120, 0.32)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 6,
  },
} as const;

// ── Radius — consistent rounding scale ────────────────────────────────────────
export const Radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

// ── Space — 4pt spacing scale ─────────────────────────────────────────────────
export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

// ── Editorial type — serif display headlines (Cormorant on web) ───────────────
// Pair with `className="editorial-label"` on web (see app/_layout.tsx) for the
// serif face; native falls back to the SUIT light weights which still read elegant.
export const Editorial = {
  display: {
    fontFamily: Font.serif,
    fontSize: 40,
    fontWeight: '300' as const,
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  hero: {
    fontFamily: Font.serif,
    fontSize: 32,
    fontWeight: '300' as const,
    lineHeight: 38,
    letterSpacing: -0.4,
  },
  title: {
    fontFamily: Font.serif,
    fontSize: 26,
    fontWeight: '400' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  // tiny tracked uppercase eyebrow — sits above editorial titles
  eyebrow: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 2.5,
    textTransform: 'uppercase' as const,
  },
} as const;

// Photo scrim gradients (bottom-up) for legible text over destination imagery.
export const Scrim = {
  // strong bottom → transparent top, for cards with text at the bottom
  bottom: ['rgba(16,24,38,0)', 'rgba(16,24,38,0.35)', 'rgba(16,24,38,0.82)'] as const,
  // even darken for hero overlays
  even: ['rgba(20,30,48,0.45)', 'rgba(20,30,48,0.55)'] as const,
  // top scrim for status-bar legibility
  top: ['rgba(16,24,38,0.55)', 'rgba(16,24,38,0)'] as const,
};
