# Data Model: Freelancer Fee Management

## User

- **Purpose**: Authenticated participant in contractor or freelancer workflows.
- **Fields**: `id`, `cpf`, `name`, `passwordHash`, `role`, `status`, `createdAt`, `updatedAt`.
- **Relationships**: Has exactly one role, either `contractor` or `freelancer`; may create
  demands or receive offers according to that role.
- **Validation**: CPF is unique, normalized to digits, and valid for the product's CPF
  format; name is required; password confirmation is checked before persistence; inactive
  users cannot obtain or refresh sessions; the development demo user is not production data.

## Demand

- **Purpose**: One-off restaurant job published by a contractor.
- **Fields**: `id`, `contractorId`, `role`, `locationPoint`, `addressSnapshot`, `startsAt`,
  `endsAt`, `valueCents`, `currency`, `acceptanceDeadline`, `status`,
  `acceptedFreelancerId`, `createdAt`, `updatedAt`, `version`.
- **Relationships**: Belongs to a contractor; optionally references one accepted freelancer;
  has offers and one assignment.
- **Validation**: Role and location are required; `startsAt` is future-dated; `endsAt` is
  after `startsAt`; value is non-negative integer cents; deadline is before start and after
  publication; cancelled/reserved/expired demands cannot be newly accepted.
- **States**: `active -> reserved -> completed`; `active -> cancelled`; `active -> expired`.

## FreelancerAvailability

- **Purpose**: Controls whether a freelancer can receive new offers and records location
  quality.
- **Fields**: `freelancerId`, `status` (`online` or `offline`), `locationPermission`,
  `lastLocationPoint`, `locationAccuracyMeters`, `lastSeenAt`, `updatedAt`.
- **Validation**: Online requires granted location permission and a recent location;
  stale coordinates are not treated as current.
- **Transitions**: `offline -> online` only after permission/location checks; `online -> offline`
  stops new offers and preserves accepted assignments.

## Offer

- **Purpose**: Time-limited presentation of a demand to an eligible freelancer.
- **Fields**: `id`, `demandId`, `freelancerId`, `status`, `expiresAt`, `createdAt`, `respondedAt`.
- **States**: `created -> accepted`, `created -> declined`, `created -> expired`.
- **Validation**: Acceptance requires active JWT role, matching freelancer, unexpired deadline,
  eligible availability and a demand still in `active` state.

## Assignment

- **Purpose**: Durable relationship created after a successful offer acceptance.
- **Fields**: `id`, `demandId`, `freelancerId`, `status`, `acceptedAt`, `routeReference`,
  `completedAt`.
- **Validation**: Creation is idempotent and occurs only after the demand reservation commits.

## RouteDetail

- **Purpose**: Operational view for an accepted assignment.
- **Fields**: `assignmentId`, `origin`, `destination`, `schedule`, `role`, `valueCents`,
  `status`, `navigationContext`, `microtrainingArea`.
- **Validation**: Exposes only data authorized for the assignment participant or owning
  contractor; missing route data produces an explicit unavailable state.

## Microtraining

- **Purpose**: Short Speckit learning content shown in route context.
- **Fields**: `id`, `title`, `summary`, `contentReference`, `role`, `routeContext`,
  `durationSeconds`, `status`.
- **Validation**: Only published content is shown; missing content never hides route details.

## OutboxEvent

- **Purpose**: Reliable post-commit delivery of state changes to WebSocket consumers.
- **Fields**: `id`, `type`, `version`, `aggregateId`, `occurredAt`, `payload`, `publishedAt`.
- **Validation**: Written in the same transaction as the state change; consumers process by
  event idempotently; unpublished records are retried.