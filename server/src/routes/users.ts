import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { userDto } from '../lib/dto.js';

const router = Router();

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
