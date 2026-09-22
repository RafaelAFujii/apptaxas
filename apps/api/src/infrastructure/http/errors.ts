import type { FastifyReply, FastifyRequest } from 'fastify';

export function sendError(reply: FastifyReply, request: FastifyRequest, error: unknown) {
  const statusCode =
    typeof error === 'object' && error && 'statusCode' in error ? Number(error.statusCode) : 422;
  const message = error instanceof Error ? error.message : 'request failed';
  return reply.code(statusCode).send({
    code: statusCode === 403 ? 'ROLE_DENIED' : 'VALIDATION_ERROR',
    message,
    requestId: request.id,
  });
}
