import type { FastifyInstance } from 'fastify';
import { createDemandSchema } from '@apptaxas/contracts';
import { requireRole } from '../auth/role-guard.js';
import { sendError } from '../../infrastructure/http/errors.js';
import { DemandService } from './demand.service.js';

export async function registerDemandRoutes(app: FastifyInstance, service: DemandService) {
  app.post('/v1/demands', async (request, reply) => {
    try {
      const claims = requireRole(request, 'contractor');
      const input = createDemandSchema.parse(request.body);
      return reply.code(201).send(service.create(claims.sub, input));
    } catch (error) {
      return sendError(reply, request, error);
    }
  });

  app.get('/v1/demands', async (request, reply) => {
    try {
      return reply.send(service.list(requireRole(request, 'contractor').sub));
    } catch (error) {
      return sendError(reply, request, error);
    }
  });

  app.post<{ Params: { demandId: string } }>(
    '/v1/demands/:demandId/cancel',
    async (request, reply) => {
      try {
        const claims = requireRole(request, 'contractor');
        return reply.send(service.cancel(claims.sub, request.params.demandId));
      } catch (error) {
        return sendError(reply, request, error);
      }
    },
  );
}
