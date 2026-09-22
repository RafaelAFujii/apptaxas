export type OfferStatus = 'created' | 'accepted' | 'declined' | 'expired';
export type Offer = {
  id: string;
  demandId: string;
  freelancerId: string;
  status: OfferStatus;
  expiresAt: Date;
};

export function acceptOffer(offer: Offer, now = new Date()): Offer {
  if (offer.status !== 'created') throw new Error('offer is no longer available');
  if (offer.expiresAt.getTime() <= now.getTime())
    throw Object.assign(new Error('offer expired'), { statusCode: 410 });
  return { ...offer, status: 'accepted' };
}

export function declineOffer(offer: Offer): Offer {
  if (offer.status !== 'created') throw new Error('offer is no longer available');
  return { ...offer, status: 'declined' };
}
