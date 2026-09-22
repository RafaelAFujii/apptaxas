import { assertCoordinates, type Coordinates } from '../primitives/coordinates.js';
import { assertFutureDate } from '../primitives/date-time.js';
import { assertNonNegativeCents } from '../primitives/money.js';

export type DemandStatus = 'active' | 'reserved' | 'cancelled' | 'expired' | 'completed';

export type Demand = {
  id: string;
  contractorId: string;
  role: string;
  location: Coordinates;
  addressSnapshot: string;
  startsAt: Date;
  endsAt: Date;
  valueCents: number;
  currency: string;
  acceptanceDeadline: Date;
  status: DemandStatus;
  acceptedFreelancerId?: string;
};

export type CreateDemandInput = Omit<Demand, 'status'>;

export function createDemand(input: CreateDemandInput, now = new Date()): Demand {
  if (!input.role.trim()) throw new Error('role is required');
  if (!input.addressSnapshot.trim()) throw new Error('addressSnapshot is required');
  assertCoordinates(input.location);
  assertFutureDate(input.startsAt, now);
  if (input.endsAt.getTime() <= input.startsAt.getTime()) {
    throw new Error('endsAt must be after startsAt');
  }
  if (input.acceptanceDeadline.getTime() <= now.getTime()) {
    throw new Error('acceptanceDeadline must be in the future');
  }
  if (input.acceptanceDeadline.getTime() >= input.startsAt.getTime()) {
    throw new Error('acceptanceDeadline must be before startsAt');
  }
  assertNonNegativeCents(input.valueCents);
  return { ...input, status: 'active' };
}

export function cancelDemand(demand: Demand): Demand {
  if (demand.status !== 'active') throw new Error('only active demands can be cancelled');
  return { ...demand, status: 'cancelled' };
}
