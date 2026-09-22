import Fastify from 'fastify';
import { registerRequestId } from './infrastructure/http/request-id.js';
import { DemandRepository } from './modules/demands/demand.repository.js';
import { DemandService } from './modules/demands/demand.service.js';
import { registerDemandRoutes } from './modules/demands/demand.routes.js';
import { registerAuthRoutes } from './modules/auth/auth.routes.js';
import { registerAvailabilityRoutes } from './modules/availability/availability.routes.js';
import { OfferService } from './modules/offers/offer.service.js';
import { registerOfferRoutes } from './modules/offers/offer.routes.js';
import { registerAssignmentRoutes } from './modules/assignments/assignment.routes.js';
import { registerMicrotrainingRoutes } from './modules/microtrainings/microtraining.routes.js';

export const app = Fastify({ logger: true });

registerRequestId(app);
await registerAuthRoutes(app);
const demandRepository = new DemandRepository();
await registerDemandRoutes(app, new DemandService(demandRepository));
await registerAvailabilityRoutes(app);
await registerOfferRoutes(app, new OfferService(demandRepository));
await registerAssignmentRoutes(app);
await registerMicrotrainingRoutes(app);

app.get('/health', async () => ({ status: 'ok' }));

if (process.env.NODE_ENV !== 'test') {
  app.listen({ port: Number(process.env.API_PORT ?? 3000), host: '0.0.0.0' });
}
