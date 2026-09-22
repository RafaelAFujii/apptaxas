import type { FastifyInstance } from 'fastify';
import { requireRole } from '../auth/role-guard.js';
import { sendError } from '../../infrastructure/http/errors.js';
import { OfferService } from './offer.service.js';

export async function registerOfferRoutes(app: FastifyInstance, service: OfferService) {
  app.post<{ Params: { offerId: string } }>(
    '/v1/offers/:offerId/accept',
    async (request, reply) => {
      try {
        const claims = requireRole(request, 'freelancer');
        const key = String(request.headers['idempotency-key'] ?? '');
        if (!key)
          return reply.code(422).send({
            code: 'IDEMPOTENCY_KEY_REQUIRED',
            message: 'Idempotency-Key is required',
            requestId: request.id,
          });
        return reply.send(service.accept(request.params.offerId, claims.sub, key));
      } catch (error) {
        return sendError(reply, request, error);
      }
    },
  );

  app.post<{ Params: { offerId: string } }>(
    '/v1/offers/:offerId/decline',
    async (request, reply) => {
      try {
        return reply.send(
          service.decline(request.params.offerId, requireRole(request, 'freelancer').sub),
        );
      } catch (error) {
        return sendError(reply, request, error);
      }
    },
  );
}
