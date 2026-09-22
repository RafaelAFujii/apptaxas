import { describe, expect, it } from 'vitest';
import { createDemand } from '@apptaxas/domain';
import { DemandRepository } from '../../src/modules/demands/demand.repository.js';
import { OfferService } from '../../src/modules/offers/offer.service.js';

describe('OfferService', () => {
  it('allows only one reservation for a demand', () => {
    const demands = new DemandRepository();
    const demand = createDemand(
      {
        id: 'demand-1',
        contractorId: 'contractor-1',
        role: 'server',
        location: { latitude: 0, longitude: 0 },
        addressSnapshot: 'Main',
        startsAt: new Date('2026-09-23T18:00:00Z'),
        endsAt: new Date('2026-09-23T20:00:00Z'),
        valueCents: 1000,
        currency: 'BRL',
        acceptanceDeadline: new Date('2026-09-23T17:00:00Z'),
      },
      new Date('2026-09-22T10:00:00Z'),
    );
    demands.create(demand);
    const service = new OfferService(demands);
    const first = service.create(demand.id, 'freelancer-1', new Date('2026-09-23T16:00:00Z'));
    const second = service.create(demand.id, 'freelancer-2', new Date('2026-09-23T16:00:00Z'));
    expect(
      service.accept(first.id, 'freelancer-1', 'key-1', new Date('2026-09-23T15:00:00Z')),
    ).toBeTruthy();
    expect(() =>
      service.accept(second.id, 'freelancer-2', 'key-2', new Date('2026-09-23T15:00:00Z')),
    ).toThrow('demand already reserved');
  });
});
