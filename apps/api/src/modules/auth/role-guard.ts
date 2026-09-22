import type { FastifyRequest } from 'fastify';
import { verifyAccessToken, type AuthClaims } from './jwt.js';

export function requireRole(request: FastifyRequest, role: AuthClaims['role']): AuthClaims {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer '))
    throw Object.assign(new Error('authentication required'), { statusCode: 401 });
  let claims: AuthClaims;
  try {
    claims = verifyAccessToken(header.slice(7));
  } catch {
    throw Object.assign(new Error('invalid or expired token'), { statusCode: 401 });
  }
  if (claims.role !== role) throw Object.assign(new Error('role not allowed'), { statusCode: 403 });
  return claims;
}
