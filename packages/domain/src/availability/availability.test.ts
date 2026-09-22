import { describe, expect, it } from 'vitest';
import { setAvailability, updateLocation, type FreelancerAvailability } from './availability.js';

const base: FreelancerAvailability = {
  freelancerId: 'freelancer-1',
  status: 'offline',
  locationPermission: 'granted',
};

describe('freelancer availability', () => {
  it('requires a current location to go online', () => {
    expect(() => setAvailability(base, 'online')).toThrow();
  });

  it('goes online after a granted permission and location update', () => {
    const located = updateLocation(base, {
      latitude: -23.55,
      longitude: -46.63,
      accuracyMeters: 12,
      recordedAt: new Date(),
    });
    expect(setAvailability(located, 'online').status).toBe('online');
  });
});
