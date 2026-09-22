import type { FastifyInstance } from 'fastify';
import { requireRole } from '../auth/role-guard.js';
import { sendError } from '../../infrastructure/http/errors.js';
import { setAvailability, updateLocation, type FreelancerAvailability } from '@apptaxas/domain';

const state = new Map<string, FreelancerAvailability>();

export async function registerAvailabilityRoutes(app: FastifyInstance) {
  app.put<{
    Body: { status: 'online' | 'offline'; locationPermission?: 'granted' | 'denied' | 'unknown' };
  }>('/v1/freelancer/availability', async (request, reply) => {
    try {
      const claims = requireRole(request, 'freelancer');
      const current = state.get(claims.sub) ?? {
        freelancerId: claims.sub,
        status: 'offline',
        locationPermission: request.body.locationPermission ?? 'unknown',
      };
      const next = setAvailability(
        {
          ...current,
          locationPermission: request.body.locationPermission ?? current.locationPermission,
        },
        request.body.status,
      );
      state.set(claims.sub, next);
      return reply.send(next);
    } catch (error) {
      return sendError(reply, request, error);
    }
  });

  app.put<{
    Body: { latitude: number; longitude: number; accuracyMeters: number; recordedAt?: string };
  }>('/v1/freelancer/location', async (request, reply) => {
    try {
      const claims = requireRole(request, 'freelancer');
      const current = state.get(claims.sub) ?? {
        freelancerId: claims.sub,
        status: 'offline',
        locationPermission: 'granted',
      };
      const next = updateLocation(current, {
        ...request.body,
        recordedAt: new Date(request.body.recordedAt ?? Date.now()),
      });
      state.set(claims.sub, next);
      return reply.send(next);
    } catch (error) {
      return sendError(reply, request, error);
    }
  });
}
