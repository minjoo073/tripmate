import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error(
    '[tripmate] JWT_SECRET 환경변수가 설정되지 않았습니다. 서버를 시작하기 전에 .env 에 JWT_SECRET 을 설정해주세요.',
  );
}
const SECRET = secret;
const EXPIRES_IN = '30d';

export interface TokenPayload {
  sub: string; // user id
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
