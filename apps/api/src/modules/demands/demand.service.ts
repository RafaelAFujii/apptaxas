import { randomUUID } from 'node:crypto';
import { cancelDemand, createDemand, type Demand } from '@apptaxas/domain';
import type { CreateDemandRequest } from '@apptaxas/contracts';
import { DemandRepository } from './demand.repository.js';

export class DemandService {
  constructor(private readonly repository: DemandRepository) {}

  create(contractorId: string, input: CreateDemandRequest): Demand {
    return this.repository.create(
      createDemand({
        id: randomUUID(),
        contractorId,
        role: input.role,
        location: input.location,
        addressSnapshot: input.address,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        valueCents: input.valueCents,
        currency: input.currency,
        acceptanceDeadline: input.acceptanceDeadline,
      }),
    );
  }

  list(contractorId: string) {
    return this.repository.listByContractor(contractorId);
  }

  cancel(contractorId: string, id: string): Demand {
    const demand = this.repository.findById(id);
    if (!demand || demand.contractorId !== contractorId)
      throw Object.assign(new Error('demand not found'), { statusCode: 404 });
    return this.repository.save(cancelDemand(demand));
  }
}
