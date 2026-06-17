import { Image } from 'react-native';

// Destination photography — real city imagery for full-bleed cards & heroes.
//
// We resolve images through Wikimedia's `Special:FilePath/<file>?width=N`
// endpoint (same approach the home hero uses): it 302-redirects to a freshly
// sized, CDN-cached render and — unlike the raw `/thumb/.../800px-` URLs —
// reliably honors arbitrary widths (those return HTTP 400 past ~500px for many
// files). Falling back to a curated pool guarantees we never show a broken
// image for an unmapped city.

const FILEPATH = 'https://commons.wikimedia.org/wiki/Special:FilePath/';

// Raw Wikimedia Commons file names (human-readable; encoded at URL-build time).
const CITY_FILE: Record<string, string> = {
  오사카: 'Osaka_Castle_02bs3200.jpg',
  도쿄: 'Skyscrapers_of_Shinjuku_2009_January.jpg',
  나고야: 'Nagoya_Station_-_View_from_the_Main_Building_in_Nagoya_Campus_of_Aichi_University_2022-6-29.jpg',
  방콕: '4Y1A1159_Bangkok_(33536795515).jpg',
  다낭: 'Dragon_Bridge,_Da_Nang_during_day_-_20230819_(cropped).jpg',
  파리: 'La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques,_Paris_août_2014_(2).jpg',
  발리: 'TanahLot_2014.JPG',
  바르셀로나: 'Aerial_view_of_Barcelona,_Spain_(51227309370)_edited.jpg',
  뉴욕: 'View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_(cropped).jpg',
  프라하: 'Prague_(6365119737).jpg',
  이스탄불: 'Historical_peninsula_and_modern_skyline_of_Istanbul.jpg',
  리스본: 'Lisboa_-_Portugal_(52597836992).jpg',
  싱가포르: 'Marina_Bay_Sands_(I).jpg',
};

// Curated fallback pool — used for any city we haven't mapped. Tasteful, generic
// travel scenes so an unknown city still reads as "premium travel", never broken.
const FALLBACK_POOL = [
  CITY_FILE.파리,
  CITY_FILE.도쿄,
  CITY_FILE.바르셀로나,
  CITY_FILE.리스본,
  CITY_FILE.이스탄불,
];

// Soft accent pair (bg tint + text) per destination, for tags/badges that sit
// off-photo. Mirrors the editorial navy/rose palette.
const CITY_ACCENT: Record<string, { bg: string; text: string }> = {
  오사카: { bg: '#EDE3D8', text: '#7A5C3E' },
  도쿄: { bg: '#D8E2EE', text: '#3A5878' },
  나고야: { bg: '#D8E2EE', text: '#3A5878' },
  방콕: { bg: '#D8EAE0', text: '#3A6B55' },
  다낭: { bg: '#D8EAE8', text: '#2E6860' },
  파리: { bg: '#EAD8EA', text: '#6B3A6B' },
  발리: { bg: '#D8EAE0', text: '#3A6B55' },
  바르셀로나: { bg: '#F4E6E9', text: '#9E5563' },
  뉴욕: { bg: '#E2E4EA', text: '#454B5C' },
  프라하: { bg: '#EDE3D8', text: '#7A5C3E' },
  이스탄불: { bg: '#D8E2EE', text: '#3A5878' },
  리스본: { bg: '#F4E6E9', text: '#9E5563' },
  싱가포르: { bg: '#D8EAE8', text: '#2E6860' },
};
const DEFAULT_ACCENT = { bg: '#E2E4EA', text: '#454B5C' };

/** Normalize a destination string to its primary city key (e.g. "오사카, 일본" → "오사카"). */
export function cityKey(dest?: string): string {
  return (dest ?? '').split(/[,·]/)[0].trim();
}

// Stable string hash → index, so an unmapped city always resolves to the same
// fallback photo (no flicker between renders).
function hashIndex(s: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % mod;
}

/** Build a Special:FilePath URL for a Commons file at a given width. */
function fileUrl(file: string, width: number): string {
  return `${FILEPATH}${encodeURIComponent(file)}?width=${width}`;
}

/** Back-compat helper — rewrite the width on a destination URL we produced. */
export function atWidth(url: string, width: number): string {
  return url.replace(/([?&]width=)\d+/, `$1${width}`);
}

/**
 * Resolve a destination to a crisp photo URL.
 * @param dest  destination label (city or "city, country")
 * @param width target render width in px (default 800)
 */
export function getDestinationImage(dest?: string, width = 800): string {
  const key = cityKey(dest);
  const file = CITY_FILE[key] ?? FALLBACK_POOL[hashIndex(key || 'x', FALLBACK_POOL.length)];
  return fileUrl(file, width);
}

/** Soft accent colors for a destination (tag/badge tints). */
export function getDestinationAccent(dest?: string): { bg: string; text: string } {
  return CITY_ACCENT[cityKey(dest)] ?? DEFAULT_ACCENT;
}

/**
 * Warm the browser/native image cache for every mapped city so cards render
 * instantly once the user reaches the home/feed. Call once at startup (e.g. on
 * the splash, which sits idle during the intro animation). Failures are ignored.
 */
export function prefetchDestinations(width = 800): void {
  Object.values(CITY_FILE).forEach((file) => {
    Image.prefetch(fileUrl(file, width)).catch(() => {});
  });
}

export { CITY_FILE };
