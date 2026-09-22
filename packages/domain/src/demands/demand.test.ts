import { describe, expect, it } from 'vitest';
import { cancelDemand, createDemand } from './demand.js';

const now = new Date('2026-09-22T10:00:00.000Z');
const input = {
  id: 'demand-1',
  contractorId: 'contractor-1',
  role: 'kitchen_assistant',
  location: { latitude: -23.55, longitude: -46.63 },
  addressSnapshot: 'Rua Central, 10',
  startsAt: new Date('2026-09-23T18:00:00.000Z'),
  endsAt: new Date('2026-09-23T23:00:00.000Z'),
  valueCents: 18000,
  currency: 'BRL',
  acceptanceDeadline: new Date('2026-09-23T16:00:00.000Z'),
};

describe('demand', () => {
  it('creates an active demand with valid fields', () => {
    expect(createDemand(input, now).status).toBe('active');
  });

  it.each([
    ['role', { role: '' }],
    ['address', { addressSnapshot: '' }],
    ['schedule', { startsAt: new Date('2026-09-21T18:00:00.000Z') }],
    ['money', { valueCents: 1.5 }],
  ])('rejects invalid %s', (_, override) => {
    expect(() => createDemand({ ...input, ...override }, now)).toThrow();
  });

  it('cancels an active demand', () => {
    expect(cancelDemand(createDemand(input, now)).status).toBe('cancelled');
  });
});
