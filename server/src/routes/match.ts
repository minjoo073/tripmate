import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { matchRate } from '../lib/score.js';
import { tripDto, userDto } from '../lib/dto.js';

const router = Router();

const FindBody = z.object({
  destination: z.string().default(''),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  travelStyles: z.array(z.string()).default([]),
  anyGender: z.boolean().default(true),
  gender: z.enum(['무관', '여성', '남성']).optional(),
  ageGroup: z.enum(['무관', '20대', '30대', '40대+']).optional(),
  scheduleOverlap: z.boolean().default(false),
  verifiedOnly: z.boolean().default(false),
});

function ageBucket(age: number) {
  if (age >= 20 && age < 30) return '20대';
  if (age >= 30 && age < 40) return '30대';
  if (age >= 40) return '40대+';
  return '기타';
}

router.post('/find', requireAuth, async (req, res, next) => {
  try {
    const filter = FindBody.parse(req.body);
    const myUserId = req.userId!;

    // Find my active trip (used as reference for schedule overlap).
    const myTrip = await prisma.trip.findFirst({
      where: { userId: myUserId, isActive: true },
      orderBy: { startDate: 'desc' },
    });

    // My personality for similarity scoring.
    const myPersonality = await prisma.travelPersonality.findUnique({
      where: { userId: myUserId },
    });

    // Candidate trips: active, not mine, optionally filtered.
    const candidates = await prisma.trip.findMany({
      where: {
        isActive: true,
        userId: { not: myUserId },
        ...(filter.destination
          ? {
              OR: [
                { destination: { contains: filter.destination, mode: 'insensitive' } },
                { country: { contains: filter.destination, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(filter.travelStyles.length
          ? { travelStyles: { hasSome: filter.travelStyles } }
          : {}),
      },
      include: { user: { include: { personality: true } } },
      take: 200,
    });

    const myStyles = myTrip?.travelStyles ?? filter.travelStyles;

    const ranked = candidates
      .filter((t) => {
        if (filter.verifiedOnly && !t.user.isVerified) return false;
        if (filter.gender && filter.gender !== '무관') {
          const want = filter.gender === '여성' ? 'female' : 'male';
          if (t.user.gender !== want) return false;
        }
        if (filter.ageGroup && filter.ageGroup !== '무관') {
          if (ageBucket(t.user.age) !== filter.ageGroup) return false;
        }
        return true;
      })
      .map((t) => ({
        user: userDto(t.user),
        trip: tripDto(t),
        matchRate: myTrip
          ? matchRate(myTrip, myStyles, t, t.user, myPersonality, t.user.personality ?? null)
          : 50,
      }))
      .sort((a, b) => b.matchRate - a.matchRate)
      .slice(0, 10);

    res.json(ranked);
  } catch (err) {
    next(err);
  }
});

router.get('/recommended', requireAuth, async (req, res, next) => {
  try {
    const myUserId = req.userId!;
    const myTrip = await prisma.trip.findFirst({
      where: { userId: myUserId, isActive: true },
      orderBy: { startDate: 'desc' },
    });

    // My personality for similarity scoring.
    const myPersonality = await prisma.travelPersonality.findUnique({
      where: { userId: myUserId },
    });

    const candidates = await prisma.trip.findMany({
      where: { isActive: true, userId: { not: myUserId } },
      include: { user: { include: { personality: true } } },
      take: 50,
    });

    const myStyles = myTrip?.travelStyles ?? [];

    const top = candidates
      .map((t) => ({
        user: userDto(t.user),
        trip: tripDto(t),
        matchRate: myTrip
          ? matchRate(myTrip, myStyles, t, t.user, myPersonality, t.user.personality ?? null)
          : 70,
      }))
      .sort((a, b) => b.matchRate - a.matchRate)
      .slice(0, 3);

    res.json(top);
  } catch (err) {
    next(err);
  }
});

export default router;
