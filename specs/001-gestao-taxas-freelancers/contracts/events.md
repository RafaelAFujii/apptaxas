# Real-Time Event Contract

WebSocket endpoint: `/v1/realtime`. The client authenticates during connection with a
valid short-lived access token. Events are notifications, not the source of truth; after
reconnect the client MUST call the corresponding REST query to reconcile state.

## Envelope

```json
{
  "id": "uuid",
  "type": "offer.created",
  "version": 1,
  "occurredAt": "2026-09-23T15:00:00Z",
  "aggregateId": "uuid",
  "payload": {}
}
```

## Events

- `demand.created`: contractor-visible confirmation and eligible-freelancer discovery hint.
- `demand.cancelled`: removes the demand from maps and open offer panels.
- `demand.expired`: marks an unreserved demand unavailable.
- `freelancer.availability.changed`: controls eligibility for new offers.
- `freelancer.location.updated`: refreshes nearby discovery eligibility.
- `offer.created`: opens the mobile bottom sheet with role, location, schedule, value,
  distance and `expiresAt`.
- `offer.expired`: closes or marks an offer panel as expired.
- `offer.declined`: records the freelancer response.
- `offer.accepted`: identifies the accepted offer and assignment after commit.
- `demand.reserved`: informs the contractor and removes competing offers.
- `assignment.created`: makes route details available.
- `microtraining.completed`: records contextual training progress.

## Delivery rules

- Events are emitted from the transactional outbox after the corresponding database state
  commits.
- Consumers MUST deduplicate by event `id`.
- Events MUST be filtered by authenticated user and role; a freelancer cannot receive
  another freelancer's private assignment details.
- Clients MUST tolerate duplicate, delayed and out-of-order notifications by reconciling
  current state through REST.