import { expect, it } from 'vitest';
import { acceptOffer } from './offer.js';

it('accepts a live offer and rejects an expired offer', () => {
  const offer = {
    id: 'offer-1',
    demandId: 'demand-1',
    freelancerId: 'freelancer-1',
    status: 'created' as const,
    expiresAt: new Date('2026-09-23T10:00:00Z'),
  };
  expect(acceptOffer(offer, new Date('2026-09-23T09:00:00Z')).status).toBe('accepted');
  expect(() => acceptOffer(offer, new Date('2026-09-23T11:00:00Z'))).toThrow('offer expired');
});
