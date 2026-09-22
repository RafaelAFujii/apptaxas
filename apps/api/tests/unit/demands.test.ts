import { describe, expect, it } from 'vitest';
import { DemandRepository } from '../../src/modules/demands/demand.repository.js';
import { DemandService } from '../../src/modules/demands/demand.service.js';

describe('DemandService', () => {
  it('creates, lists, and cancels a contractor demand', () => {
    const service = new DemandService(new DemandRepository());
    const demand = service.create('contractor-1', {
      role: 'server',
      location: { latitude: -23.55, longitude: -46.63 },
      address: 'Rua 1',
      startsAt: new Date(Date.now() + 86_400_000),
      endsAt: new Date(Date.now() + 90_000_000),
      valueCents: 10000,
      currency: 'BRL',
      acceptanceDeadline: new Date(Date.now() + 40_000_000),
    });
    expect(service.list('contractor-1')).toHaveLength(1);
    expect(service.cancel('contractor-1', demand.id).status).toBe('cancelled');
  });
});
