// Matching score model — documented in the portfolio as design intent.
// 매칭률 = 일정(0.35) + 스타일(0.30) + 성향(0.20) + 신뢰도(0.15), each normalized to 0..100.

import type { Trip, User, TravelPersonality } from '@prisma/client';

/** Day-overlap between two ranges, expressed as fraction of mine (0..1). */
function scheduleOverlap(mine: Trip, other: Trip): number {
  const myStart = mine.startDate.getTime();
  const myEnd = mine.endDate.getTime();
  const otherStart = other.startDate.getTime();
  const otherEnd = other.endDate.getTime();
  const overlapStart = Math.max(myStart, otherStart);
  const overlapEnd = Math.min(myEnd, otherEnd);
  if (overlapEnd <= overlapStart) return 0;
  const overlapDays = (overlapEnd - overlapStart) / (1000 * 60 * 60 * 24);
  const myDays = Math.max(1, (myEnd - myStart) / (1000 * 60 * 60 * 24));
  return Math.min(1, overlapDays / myDays);
}

/** Cosine similarity over presence/absence of style tags. */
function styleSimilarity(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const set = new Set([...a, ...b]);
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const tag of set) {
    const va = a.includes(tag) ? 1 : 0;
    const vb = b.includes(tag) ? 1 : 0;
    dot += va * vb;
    magA += va * va;
    magB += vb * vb;
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / Math.sqrt(magA * magB);
}

/** Personality similarity: 1 - avg(|a_i - b_i|) / 100 over 7 dimensions (0..1).
 *  Returns 0.5 (neutral) when either side has no personality record. */
function personalitySimilarity(
  a: TravelPersonality | null,
  b: TravelPersonality | null,
): number {
  if (!a || !b) return 0.5;
  const fields = ['pace', 'time', 'companion', 'stay', 'dining', 'plan', 'budget'] as const;
  const avgDiff = fields.reduce((sum, f) => sum + Math.abs(a[f] - b[f]), 0) / fields.length;
  return 1 - avgDiff / 100;
}

/** Trust score normalized to 0..1. Verified gets a small floor. */
function trustNormalized(u: Pick<User, 'trustScore' | 'isVerified' | 'rating'>): number {
  const base = Math.min(100, Math.max(0, u.trustScore)) / 100;
  const verifiedBoost = u.isVerified ? 0.1 : 0;
  const ratingBoost = (u.rating / 5) * 0.1;
  return Math.min(1, base + verifiedBoost + ratingBoost);
}

export function matchRate(
  mine: Trip,
  myStyles: string[],
  other: Trip,
  otherUser: Pick<User, 'travelStyles' | 'trustScore' | 'isVerified' | 'rating'>,
  myPersonality: TravelPersonality | null,
  otherPersonality: TravelPersonality | null,
): number {
  const schedule = scheduleOverlap(mine, other);
  const style = styleSimilarity(myStyles, otherUser.travelStyles);
  const personality = personalitySimilarity(myPersonality, otherPersonality);
  const trust = trustNormalized(otherUser);
  // 매칭률 = 일정(0.35) + 스타일(0.30) + 성향(0.20) + 신뢰도(0.15)
  const score = schedule * 35 + style * 30 + personality * 20 + trust * 15;
  return Math.round(score);
}
