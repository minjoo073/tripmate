import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/jwt.js';
import { HttpError } from '../middleware/error.js';
import { requireAuth } from '../middleware/auth.js';
import { userDto } from '../lib/dto.js';

const router = Router();

const SignupBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nickname: z.string().min(1).max(40),
});

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/signup', async (req, res, next) => {
  try {
    const body = SignupBody.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw new HttpError(409, 'email_taken');

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: { email: body.email, passwordHash, nickname: body.nickname },
    });
    const token = signToken(user.id);
    res.json({ id: user.id, email: user.email, nickname: user.nickname, avatar: user.avatar ?? undefined, token });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = LoginBody.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw new HttpError(401, 'invalid_credentials');
    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) throw new HttpError(401, 'invalid_credentials');
    const token = signToken(user.id);
    res.json({ id: user.id, email: user.email, nickname: user.nickname, avatar: user.avatar ?? undefined, token });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) throw new HttpError(404, 'not_found');
    res.json({ ...userDto(user), email: user.email });
  } catch (err) {
    next(err);
  }
});

export default router;
