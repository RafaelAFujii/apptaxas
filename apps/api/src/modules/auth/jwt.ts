import { createHmac, timingSafeEqual } from 'node:crypto';

export type AuthClaims = { sub: string; role: 'contractor' | 'freelancer'; exp: number };

const secret = () => process.env.JWT_ACCESS_SECRET ?? 'local-development-secret';
const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');

export function createAccessToken(claims: AuthClaims): string {
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode(claims);
  const unsigned = `${header}.${payload}`;
  const signature = createHmac('sha256', secret()).update(unsigned).digest('base64url');
  return `${unsigned}.${signature}`;
}

export function verifyAccessToken(token: string): AuthClaims {
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) throw new Error('invalid token');
  const unsigned = `${header}.${payload}`;
  const expected = createHmac('sha256', secret()).update(unsigned).digest('base64url');
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected)))
    throw new Error('invalid token');
  const claims = JSON.parse(Buffer.from(payload, 'base64url').toString()) as AuthClaims;
  if (claims.exp <= Math.floor(Date.now() / 1000)) throw new Error('expired token');
  return claims;
}
