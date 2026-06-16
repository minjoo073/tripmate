import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { userDto, personalityDto } from '../lib/dto.js';

const router = Router();

const PersonalityBody = z.object({
  pace:      z.number().int().min(0).max(100),
  time:      z.number().int().min(0).max(100),
  companion: z.number().int().min(0).max(100),
  stay:      z.number().int().min(0).max(100),
  dining:    z.number().int().min(0).max(100),
  plan:      z.number().int().min(0).max(100),
  budget:    z.number().int().min(0).max(100),
});

const DEFAULT_PERSONALITY_INTS = {
  pace: 50, time: 50, companion: 50, stay: 50, dining: 50, plan: 50, budget: 50,
} as const;

/** GET /users/me/personality — 내 성향 조회 (없으면 7필드 50 기본값) */
router.get('/me/personality', requireAuth, async (req, res, next) => {
  try {
    const p = await prisma.travelPersonality.findUnique({ where: { userId: req.userId! } });
    res.json(p ? personalityDto(p) : DEFAULT_PERSONALITY_INTS);
  } catch (err) {
    next(err);
  }
});

/** PUT /users/me/personality — 성향 upsert */
router.put('/me/personality', requireAuth, async (req, res, next) => {
  try {
    const data = PersonalityBody.parse(req.body);
    const p = await prisma.travelPersonality.upsert({
      where:  { userId: req.userId! },
      update: data,
      create: { userId: req.userId!, ...data },
    });
    res.json(personalityDto(p));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id! } });
    if (!user) throw new HttpError(404, 'not_found');
    res.json(userDto(user));
  } catch (err) {
    next(err);
  }
});

router.post('/:id/like', requireAuth, async (req, res, next) => {
  try {
    const fromId = req.userId!;
    const toId = req.params.id!;
    if (fromId === toId) throw new HttpError(400, 'cannot_like_self');
    await prisma.like.upsert({
      where: { fromId_toId: { fromId, toId } },
      update: {},
      create: { fromId, toId },
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
