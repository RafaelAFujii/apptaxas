import { randomUUID } from 'node:crypto';
import { acceptOffer, declineOffer, type Offer } from '@apptaxas/domain';
import { DemandRepository } from '../demands/demand.repository.js';

export type Assignment = {
  id: string;
  demandId: string;
  freelancerId: string;
  offerId: string;
  acceptedAt: Date;
};

export class OfferService {
  private readonly offers = new Map<string, Offer>();
  private readonly assignments = new Map<string, Assignment>();

  constructor(private readonly demands: DemandRepository) {}

  create(demandId: string, freelancerId: string, expiresAt: Date): Offer {
    const demand = this.demands.findById(demandId);
    if (!demand || demand.status !== 'active')
      throw Object.assign(new Error('demand not available'), { statusCode: 404 });
    const offer = {
      id: randomUUID(),
      demandId,
      freelancerId,
      status: 'created' as const,
      expiresAt,
    };
    this.offers.set(offer.id, offer);
    return offer;
  }

  accept(
    offerId: string,
    freelancerId: string,
    idempotencyKey: string,
    now = new Date(),
  ): Assignment {
    const offer = this.offers.get(offerId);
    if (!offer || offer.freelancerId !== freelancerId)
      throw Object.assign(new Error('offer not found'), { statusCode: 404 });
    const existing = [...this.assignments.values()].find(
      (assignment) => assignment.offerId === offerId && assignment.freelancerId === freelancerId,
    );
    if (existing && idempotencyKey) return existing;
    const demand = this.demands.findById(offer.demandId);
    if (!demand || demand.status !== 'active')
      throw Object.assign(new Error('demand already reserved'), { statusCode: 409 });
    const accepted = acceptOffer(offer, now);
    const assignment = {
      id: randomUUID(),
      demandId: accepted.demandId,
      freelancerId,
      offerId,
      acceptedAt: now,
    };
    this.offers.set(offerId, accepted);
    this.demands.save({ ...demand, status: 'reserved', acceptedFreelancerId: freelancerId });
    this.assignments.set(assignment.id, assignment);
    return assignment;
  }

  decline(offerId: string, freelancerId: string) {
    const offer = this.offers.get(offerId);
    if (!offer || offer.freelancerId !== freelancerId)
      throw Object.assign(new Error('offer not found'), { statusCode: 404 });
    const declined = declineOffer(offer);
    this.offers.set(offerId, declined);
    return declined;
  }
}
