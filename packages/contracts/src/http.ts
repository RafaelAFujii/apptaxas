import { z } from 'zod';

export const roleSchema = z.enum(['contractor', 'freelancer']);
export const loginSchema = z.object({
  cpf: z.string().min(11),
  password: z.string().min(1),
});
export const registerSchema = z.object({
  cpf: z.string().min(11),
  name: z.string().trim().min(1),
  password: z.string().min(1),
  passwordConfirmation: z.string().min(1),
  role: roleSchema,
});
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
export const createDemandSchema = z.object({
  role: z.string().trim().min(1),
  location: coordinatesSchema,
  address: z.string().trim().min(1),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  valueCents: z.number().int().nonnegative(),
  currency: z.string().length(3).default('BRL'),
  acceptanceDeadline: z.coerce.date(),
});
export const errorSchema = z.object({
  code: z.string(),
  message: z.string(),
  requestId: z.string(),
  details: z.record(z.unknown()).optional(),
});
export type CreateDemandRequest = z.infer<typeof createDemandSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
