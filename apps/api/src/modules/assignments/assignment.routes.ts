import type { FastifyInstance } from 'fastify';
import { requireRole } from '../auth/role-guard.js';
import { sendError } from '../../infrastructure/http/errors.js';

export async function registerAssignmentRoutes(app: FastifyInstance) {
  app.get<{ Params: { assignmentId: string } }>(
    '/v1/assignments/:assignmentId/route',
    async (request, reply) => {
      try {
        requireRole(request, 'freelancer');
        return reply.send({
          assignmentId: request.params.assignmentId,
          origin: 'Restaurant',
          destination: 'Work site',
          role: 'Kitchen assistant',
          valueCents: 18000,
          status: 'reserved',
          microtrainingArea: 'Speckit microtraining',
        });
      } catch (error) {
        return sendError(reply, request, error);
      }
    },
  );
}
