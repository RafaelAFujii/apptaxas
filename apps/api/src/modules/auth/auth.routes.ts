import { randomUUID } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import { createUser, normalizeCpf, type User } from '@apptaxas/domain';
import { loginSchema, registerSchema } from '@apptaxas/contracts';
import { createAccessToken, verifyAccessToken } from './jwt.js';
import { sendError } from '../../infrastructure/http/errors.js';

const users = new Map<string, User>();
const refreshSessions = new Map<string, string>();

if (process.env.NODE_ENV !== 'production') {
  users.set('12345678900', {
    id: 'demo-user',
    cpf: '12345678900',
    name: 'Demonstração',
    password: 'admin',
    role: 'contractor',
    status: 'active',
  });
  users.set('12345678909', {
    id: 'test-freelancer',
    cpf: '12345678909',
    name: 'Freelancer de Teste',
    password: 'freelancer',
    role: 'freelancer',
    status: 'active',
  });
}

function sessionResponse(user: User) {
  const accessToken = createAccessToken({
    sub: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 900,
  });
  const refreshToken = `local-refresh-${randomUUID()}`;
  refreshSessions.set(refreshToken, user.id);
  return {
    accessToken,
    refreshToken,
    expiresIn: 900,
    user: { id: user.id, cpf: user.cpf, name: user.name, role: user.role },
  };
}

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post('/v1/auth/register', async (request, reply) => {
    try {
      const input = registerSchema.parse(request.body);
      const cpf = normalizeCpf(input.cpf);
      if (users.has(cpf)) {
        return reply.code(409).send({
          code: 'CPF_DUPLICADO',
          message: 'Este CPF já está cadastrado.',
          requestId: request.id,
        });
      }
      const user = createUser({ ...input, cpf, id: randomUUID() });
      users.set(user.cpf, user);
      return reply.code(201).send({
        user: { id: user.id, cpf: user.cpf, name: user.name, role: user.role },
      });
    } catch (error) {
      return sendError(reply, request, error);
    }
  });

  app.post('/v1/auth/login', async (request, reply) => {
    try {
      const input = loginSchema.parse(request.body);
      const user = users.get(normalizeCpf(input.cpf));
      if (!user || user.password !== input.password || user.status !== 'active') {
        return reply.code(401).send({
          code: 'CREDENCIAIS_INVALIDAS',
          message: 'CPF ou senha inválidos.',
          requestId: request.id,
        });
      }
      return reply.send(sessionResponse(user));
    } catch (error) {
      return sendError(reply, request, error);
    }
  });

  app.post('/v1/auth/refresh', async (request, reply) => {
    const token = (request.body as { refreshToken?: string } | undefined)?.refreshToken;
    const userId = token ? refreshSessions.get(token) : undefined;
    const user = userId
      ? [...users.values()].find((candidate) => candidate.id === userId)
      : undefined;
    if (!user)
      return reply
        .code(401)
        .send({ code: 'SESSAO_INVALIDA', message: 'Sessão inválida.', requestId: request.id });
    if (token) refreshSessions.delete(token);
    return reply.send(sessionResponse(user));
  });

  app.post('/v1/auth/logout', async (request, reply) => {
    const token = (request.body as { refreshToken?: string } | undefined)?.refreshToken;
    if (token) refreshSessions.delete(token);
    return reply.code(204).send();
  });

  app.get('/v1/me', async (request, reply) => {
    try {
      const header = request.headers.authorization;
      if (!header?.startsWith('Bearer '))
        return reply.code(401).send({
          code: 'NAO_AUTENTICADO',
          message: 'Autenticação necessária.',
          requestId: request.id,
        });
      const claims = verifyAccessToken(header.slice(7));
      const user = [...users.values()].find((candidate) => candidate.id === claims.sub);
      if (!user)
        return reply.code(401).send({
          code: 'USUARIO_INEXISTENTE',
          message: 'Usuário não encontrado.',
          requestId: request.id,
        });
      return reply.send({ id: user.id, cpf: user.cpf, name: user.name, role: user.role });
    } catch (error) {
      return sendError(reply, request, error);
    }
  });
}
