import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { postDto } from '../lib/dto.js';

const router = Router();

const CategorySchema = z.enum(['mate', 'tips', 'review']);

router.get('/posts', optionalAuth, async (req, res, next) => {
  try {
    const category = typeof req.query.category === 'string' ? CategorySchema.safeParse(req.query.category).data : undefined;
    const city = typeof req.query.city === 'string' && req.query.city !== '전체' ? req.query.city : undefined;

    const posts = await prisma.post.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(city ? { trip: { destination: city } } : {}),
      },
      include: { author: true, trip: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json(posts.map(postDto));
  } catch (err) {
    next(err);
  }
});

router.get('/posts/:id', optionalAuth, async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id! },
      include: { author: true, trip: true },
    });
    if (!post) throw new HttpError(404, 'not_found');
    res.json(postDto(post));
  } catch (err) {
    next(err);
  }
});

const CreateBody = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  category: CategorySchema,
  travelStyles: z.array(z.string()).default([]),
  tripId: z.string().optional(),
});

router.post('/posts', requireAuth, async (req, res, next) => {
  try {
    const body = CreateBody.parse(req.body);
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        category: body.category,
        travelStyles: body.travelStyles,
        tripId: body.tripId ?? null,
        authorId: req.userId!,
      },
      include: { author: true, trip: true },
    });
    res.json(postDto(post));
  } catch (err) {
    next(err);
  }
});

router.post('/posts/:id/like', requireAuth, async (req, res, next) => {
  try {
    const userId = req.userId!;
    const postId = req.params.id!;
    const existing = await prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.postLike.delete({ where: { postId_userId: { postId, userId } } }),
        prisma.post.update({ where: { id: postId }, data: { likesCount: { decrement: 1 } } }),
      ]);
      res.json({ liked: false });
    } else {
      await prisma.$transaction([
        prisma.postLike.create({ data: { postId, userId } }),
        prisma.post.update({ where: { id: postId }, data: { likesCount: { increment: 1 } } }),
      ]);
      res.json({ liked: true });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
