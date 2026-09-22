import type { FastifyInstance } from 'fastify';
import { canDisplayMicrotraining } from '@apptaxas/domain';
import { requireRole } from '../auth/role-guard.js';
import { sendError } from '../../infrastructure/http/errors.js';

export async function registerMicrotrainingRoutes(app: FastifyInstance) {
  app.get<{ Params: { assignmentId: string } }>(
    '/v1/assignments/:assignmentId/microtrainings',
    async (request, reply) => {
      try {
        requireRole(request, 'freelancer');
        const training = {
          id: 'training-1',
          title: 'Kitchen arrival',
          summary: 'Quick arrival checklist',
          contentReference: 'speckit://kitchen-arrival',
          durationSeconds: 90,
          status: 'published' as const,
        };
        return reply.send({
          assignmentId: request.params.assignmentId,
          items: canDisplayMicrotraining(training) ? [training] : [],
        });
      } catch (error) {
        return sendError(reply, request, error);
      }
    },
  );
}
