import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt.js';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

function extractUserId(req: Request): string | null {
  const header = req.header('authorization');
  if (!header) return null;
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  return verifyToken(token)?.sub ?? null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userId = extractUserId(req);
  if (!userId) return res.status(401).json({ error: 'unauthorized' });
  req.userId = userId;
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const userId = extractUserId(req);
  if (userId) req.userId = userId;
  next();
}
