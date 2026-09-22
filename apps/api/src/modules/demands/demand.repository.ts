import type { Demand } from '@apptaxas/domain';

export class DemandRepository {
  private readonly demands = new Map<string, Demand>();

  create(demand: Demand): Demand {
    this.demands.set(demand.id, demand);
    return demand;
  }

  listByContractor(contractorId: string): Demand[] {
    return [...this.demands.values()].filter((demand) => demand.contractorId === contractorId);
  }

  findById(id: string): Demand | undefined {
    return this.demands.get(id);
  }

  save(demand: Demand): Demand {
    this.demands.set(demand.id, demand);
    return demand;
  }
}
