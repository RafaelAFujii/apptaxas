# Research: Freelancer Fee Management

## Decision: Use a TypeScript modular monolith

**Rationale**: The first release has one transactional workflow: publish a demand,
discover an offer, reserve it once, and create an assignment. Keeping these capabilities
in one API and one PostgreSQL database makes authorization and reservation correctness
explicit while respecting the constitution's simplicity principle.

**Alternatives considered**: Microservices would isolate scaling concerns but add
deployment, messaging and consistency overhead before the product has multiple bounded
operational workloads. A serverless-only design was rejected because the time-sensitive
reservation path benefits from a clear transaction boundary.

## Decision: PostgreSQL with PostGIS and UTC/integer-money conventions

**Rationale**: PostGIS supports nearby-demand queries and indexed geographic filtering.
Integer cents prevent floating-point money errors, and UTC timestamps avoid ambiguous
cross-region scheduling.

**Alternatives considered**: A document store would require additional geospatial and
transaction design. Floating-point money was rejected because it can create incorrect
fee comparisons and settlement values.

## Decision: REST plus authenticated WebSocket updates

**Rationale**: REST is easy to validate and replay for commands and queries. WebSocket
messages reduce latency for new offers and status changes on both web and Expo mobile.
After reconnect, clients MUST reconcile through REST so events are not the only source of
truth.

**Alternatives considered**: Polling is simpler but weak for expiring offers; SSE is less
uniform across Expo mobile; a broker is unnecessary for the first release.

## Decision: Server-side idempotent reservation with transactional outbox

**Rationale**: The API validates role, eligibility, deadline and current state inside a
transaction. A conditional update allows only the first freelancer to reserve a demand;
other attempts receive `409 Conflict`. The outbox publishes events only after the state
change commits, preventing a client-visible acceptance without a durable reservation.

**Alternatives considered**: Client-side locking is unsafe under concurrency. Redis as the
source of truth adds operational complexity and can diverge from durable demand state.

## Decision: JWT access token with strict server-side role authorization

**Rationale**: The requested JWT flow supports web and mobile, while authorization is
derived from server-side identity and role claims rather than a client-selected screen.
Short-lived access tokens and rotating refresh tokens limit exposure; logout/revocation
must invalidate refresh sessions.

**Alternatives considered**: A client-only role switch was rejected because it cannot
protect contractor operations. Long-lived access tokens were rejected due to higher risk.

## Decision: CPF-first authentication with registration-time role selection

**Rationale**: CPF is the requested Brazilian identity and login identifier. Registration
collects CPF, name, password, confirmation, and exactly one profile, so the server can
issue JWT claims from persisted identity rather than trusting a client-selected screen.
CPF uniqueness and format validation belong at the identity boundary. The credential
`12345678900`/`admin` is a development fixture only and MUST be excluded from production
configuration and seed data.

**Alternatives considered**: Email login was rejected because it conflicts with the
explicit product requirement. Allowing multiple roles per account was rejected because
it weakens the strict profile separation and complicates navigation guards.

## Decision: PT-BR as the only initial locale

**Rationale**: Centralizing user-facing copy and locale formatting at web/mobile edges
keeps the domain language-independent while making login, validation, errors, currency,
dates, times, CPF and microtraining consistently Brazilian Portuguese.

**Alternatives considered**: A language switcher is outside the first release and would
add translation catalogs and acceptance scope without a stated need.

## Decision: Speckit microtraining as contextual route content

**Rationale**: A separate microtraining contract keeps training content replaceable and
allows route details to remain available if content is missing. Content is associated by
role or route and completion is recorded independently of assignment reservation.

**Alternatives considered**: Embedding training fields directly in the assignment would
couple operational state to educational content and make content evolution harder.

## Decision: TDD plus lint/format gates for this feature

**Rationale**: The request explicitly requires automated tests following TDD. The plan
starts each domain/API/UI slice with a failing test, then implementation, then refactor.
ESLint and Prettier run in the affected scope and CI; the debt ledger records exceptions
and keeps the estimated debt below 10%.

**Alternatives considered**: Manual-only verification was rejected because reservation,
authorization and expiry are high-risk behaviors. Tests are not added as a global
constitutional requirement; they are a feature-specific delivery gate.