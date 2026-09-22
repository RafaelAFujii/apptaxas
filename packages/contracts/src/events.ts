import { z } from 'zod';

export const eventEnvelopeSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  version: z.number().int().positive(),
  occurredAt: z.string().datetime(),
  aggregateId: z.string(),
  payload: z.record(z.unknown()),
});
export type EventEnvelope = z.infer<typeof eventEnvelopeSchema>;
