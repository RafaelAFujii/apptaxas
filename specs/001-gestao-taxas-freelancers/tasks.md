---
description: "Actionable implementation tasks for Freelancer Fee Management"
---

# Tasks: Freelancer Fee Management

**Input**: Design documents from `/specs/001-gestao-taxas-freelancers/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: Included because this feature explicitly requires TDD. Tests are written before
their corresponding implementation and must fail before implementation begins.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the TypeScript monorepo and shared quality boundaries.

- [X] T001 Create the pnpm workspace and root scripts in `package.json` for `apps/api`, `apps/web`, `apps/mobile`, and `packages/*`.
- [X] T002 [P] Create strict TypeScript project references in `tsconfig.json` and `packages/config/tsconfig.base.json`.
- [X] T003 [P] Configure TypeScript/React ESLint rules and debt exceptions in `eslint.config.js`.
- [X] T004 [P] Configure canonical Prettier rules and ignores in `prettier.config.js` and `.prettierignore`.
- [X] T005 [P] Scaffold the Fastify API entrypoint and module boundaries in `apps/api/src/index.ts` and `apps/api/src/modules/`.
- [X] T006 [P] Scaffold the contractor ReactJS app in `apps/web/src/` with feature boundaries from `plan.md`.
- [X] T007 [P] Scaffold the Expo Router freelancer app in `apps/mobile/app/` and `apps/mobile/src/`.
- [X] T008 [P] Create shared package manifests and exports in `packages/domain/package.json`, `packages/contracts/package.json`, `packages/config/package.json`, and `packages/ui-tokens/package.json`.
- [X] T009 Create local Docker orchestration and environment template in `infra/docker/docker-compose.yml` and `.env.example`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish persistence, contracts, security, events, TDD, and PT-BR locale
infrastructure before user-story implementation.

- [ ] T010 Create shared Vitest configuration and test helpers in `vitest.config.ts`, `tests/helpers/`, and `packages/config/vitest.base.ts`.
- [ ] T011 [P] Create the API contract test harness in `tests/contract/setup.ts` and `apps/api/tests/contract/fixtures.ts`.
- [ ] T012 [P] Create the integration database lifecycle in `tests/integration/setup.ts` and `infra/docker/postgres-test.yml`.
- [X] T013 [P] Define shared Zod HTTP, role, error, and event schemas in `packages/contracts/src/http.ts` and `packages/contracts/src/events.ts`.
- [X] T014 Create PostgreSQL/PostGIS migration configuration and extension setup in `infra/migrations/knexfile.ts` and `infra/migrations/001_enable_postgis.sql`.
- [X] T015 Create core tables in `infra/migrations/002_core_schema.sql`, including unique normalized CPF, exactly one account role, integer cents, UTC timestamps, and documented demand states.
- [X] T016 [P] Implement request IDs, structured errors, and PT-BR user-facing error mapping in `apps/api/src/infrastructure/http/errors.ts` and `apps/api/src/infrastructure/http/request-id.ts`.
- [X] T017 [P] Implement JWT verification and server-side role guards in `apps/api/src/modules/auth/jwt.ts` and `apps/api/src/modules/auth/role-guard.ts`.
- [ ] T018 [P] Implement authenticated WebSocket connections and role-filtered event delivery in `apps/api/src/infrastructure/realtime/socket.ts`.
- [ ] T019 [P] Implement transactional outbox persistence and idempotent dispatch in `apps/api/src/infrastructure/events/outbox.ts` and `apps/api/src/infrastructure/events/dispatcher.ts`.
- [X] T020 [P] Create shared money, UTC time, coordinate, CPF, and typed state primitives in `packages/domain/src/primitives/`.
- [X] T021 Create TDD CI gates for unit, contract, integration, lint, and formatting checks in `.github/workflows/quality.yml`.
- [X] T022 Create the technical-debt ledger and below-10% review procedure in `docs/technical-debt.md`.
- [ ] T023 [P] Add PT-BR locale constants and Brazilian currency/date/CPF formatters in `packages/config/src/locale-pt-br.ts` and `packages/domain/src/primitives/br-locale.ts`.
- [ ] T024 [P] Add secure development/demo fixture loading with CPF `12345678900` and password `admin` excluded from production in `apps/api/src/infrastructure/fixtures/demo-user.ts`.

**Checkpoint**: Shared infrastructure and security boundaries are ready for user stories.

---

## Phase 3: User Story 0 - Enter Through Authentication (Priority: P1) 🎯 MVP

**Goal**: Make PT-BR login the first screen, provide CPF registration with exactly one
profile, and unlock protected screens only after successful JWT authentication.

**Independent Test**: Open web/mobile without a session, verify login first, register a
contractor or freelancer with CPF/name/password/confirmation/profile, reject mismatched
passwords, and log in with CPF/password including the development demo credential.

### Tests for User Story 0

- [ ] T025 [P] [US0] Write failing contract tests for `POST /v1/auth/register`, `POST /v1/auth/login`, `POST /v1/auth/refresh`, `POST /v1/auth/logout`, and `GET /v1/me` in `tests/contract/auth.contract.test.ts`.
- [X] T026 [P] [US0] Write failing domain tests for CPF normalization/uniqueness, required name, exactly one role, password confirmation mismatch, and PT-BR validation messages in `packages/domain/src/users/user.test.ts`.
- [ ] T027 [P] [US0] Write failing API integration tests for invalid/duplicate CPF, invalid credentials, expired JWT, demo fixture availability only in development, and role-derived claims in `apps/api/tests/integration/auth.integration.test.ts`.
- [ ] T028 [P] [US0] Write failing web/mobile navigation tests proving unauthenticated users see only the PT-BR login screen and authenticated users reach the role route in `apps/web/tests/auth/entry.test.tsx` and `apps/mobile/tests/auth/entry.test.tsx`.

### Implementation for User Story 0

- [X] T029 [P] [US0] Implement CPF normalization and Brazilian CPF validation in `packages/domain/src/primitives/cpf.ts`.
- [X] T030 [US0] Implement the User entity and registration rules with fields `cpf`, `name`, `passwordHash`, and exactly one `role` in `packages/domain/src/users/user.ts`.
- [ ] T031 [US0] Implement CPF-based user persistence and refresh-session persistence in `apps/api/src/modules/auth/user.repository.ts` and `apps/api/src/modules/auth/session.repository.ts`.
- [X] T032 [US0] Implement registration, CPF/password login, refresh rotation, logout revocation, and `/me` in `apps/api/src/modules/auth/auth.routes.ts`.
- [ ] T033 [P] [US0] Implement PT-BR authentication schemas and error codes in `packages/contracts/src/auth.ts`.
- [X] T034 [P] [US0] Implement the PT-BR login-first web flow, registration form, CPF input, password confirmation, and protected entry state in `apps/web/src/main.tsx`.
- [X] T035 [P] [US0] Implement the PT-BR Expo login-first flow, registration form, CPF input, password confirmation, and protected entry state in `apps/mobile/app/index.tsx`.
- [ ] T036 [US0] Configure the development-only demo credential and prevent it from production builds in `apps/api/src/infrastructure/fixtures/demo-user.ts` and `.env.example`.
- [ ] T037 [US0] Run the authentication quickstart scenarios and record login, registration, PT-BR, role, and demo-credential evidence in `specs/001-gestao-taxas-freelancers/quickstart.md`.

**Checkpoint**: Unauthenticated users see only login; registered users authenticate by CPF
and reach exactly one role-specific experience.

---

## Phase 4: User Story 1 - Publish a Demand (Priority: P1)

**Goal**: Let an authenticated contractor create, view, and cancel immutable demands.

**Independent Test**: Publish a future demand with role, location, schedule, and cents;
verify active ownership and cancel it before acceptance.

### Tests for User Story 1

- [ ] T038 [P] [US1] Write failing contract tests for `POST /v1/demands`, `GET /v1/demands`, and `POST /v1/demands/{demandId}/cancel` in `tests/contract/demands.contract.test.ts`.
- [X] T039 [P] [US1] Write failing domain tests for required role/location, future `startsAt`, `endsAt` after `startsAt`, non-negative integer `valueCents`, and deadline ordering in `packages/domain/src/demands/demand.test.ts`.
- [ ] T040 [P] [US1] Write failing integration tests for contractor ownership, invalid fields returning `422`, immutability, and cancellation in `apps/api/tests/integration/demands.integration.test.ts`.

### Implementation for User Story 1

- [X] T041 [P] [US1] Implement Demand validation and `active -> cancelled` transition in `packages/domain/src/demands/demand.ts`.
- [X] T042 [P] [US1] Implement Demand persistence and location mapping in `apps/api/src/modules/demands/demand.repository.ts`.
- [X] T043 [US1] Implement contractor demand create, list, detail, and cancel service in `apps/api/src/modules/demands/demand.service.ts`.
- [X] T044 [US1] Implement role-protected demand routes in `apps/api/src/modules/demands/demand.routes.ts`.
- [X] T045 [P] [US1] Implement the PT-BR contractor demand form and status views in `apps/web/src/features/contractor/demands/`.
- [ ] T046 [US1] Connect demand screens to the API and PT-BR loading, validation, empty, and error states in `apps/web/src/features/contractor/demands/demand-api.ts`.
- [ ] T047 [US1] Run the US1 contract/integration and contractor publish/cancel journey and record results in `specs/001-gestao-taxas-freelancers/quickstart.md`.

**Checkpoint**: A contractor can independently publish and cancel an immutable demand.

---

## Phase 5: User Story 2 - Find Demands as a Freelancer (Priority: P1)

**Goal**: Let a freelancer grant location permission, go Online/Offline, and discover
active demands within 10 km on a PT-BR map experience.

**Independent Test**: Grant location, switch Online, see an eligible nearby pin, then go
Offline and verify new demands are no longer offered.

### Tests for User Story 2

- [ ] T048 [P] [US2] Write failing contract tests for availability, location, and `GET /v1/demands/nearby` in `tests/contract/availability.contract.test.ts`.
- [X] T049 [P] [US2] Write failing domain tests for permission requirements and Offline state in `packages/domain/src/availability/availability.test.ts`.
- [ ] T050 [P] [US2] Write failing mobile tests for PT-BR permission denied, Online/Offline, loading, empty, stale-location, and map-pin states in `apps/mobile/tests/discovery/discovery.test.tsx`.

### Implementation for User Story 2

- [X] T051 [P] [US2] Implement FreelancerAvailability state transitions and location freshness in `packages/domain/src/availability/availability.ts`.
- [ ] T052 [US2] Implement availability and 10 km PostGIS nearby-demand repositories in `apps/api/src/modules/availability/availability.repository.ts` and `apps/api/src/modules/demands/nearby.repository.ts`.
- [X] T053 [US2] Implement PT-BR availability routes with role authorization in `apps/api/src/modules/availability/availability.routes.ts`.
- [ ] T054 [P] [US2] Implement Expo foreground location permission and updates in `apps/mobile/src/features/freelancer/location/`.
- [X] T055 [P] [US2] Implement the PT-BR map-first discovery shell, demand pin, Online/Offline control, and states in `apps/mobile/app/index.tsx`.
- [ ] T056 [US2] Connect discovery to REST refresh and authenticated realtime updates in `apps/mobile/src/features/freelancer/discovery/discovery-api.ts`.
- [ ] T057 [US2] Run the US2 simulator/device journey and record permission, 10 km, map, empty, and Offline evidence in `specs/001-gestao-taxas-freelancers/quickstart.md`.

**Checkpoint**: A freelancer can independently discover nearby demands within the defined radius.

---

## Phase 6: User Story 3 - Accept a Demand Quickly (Priority: P1)

**Goal**: Deliver expiring PT-BR offers and reserve a demand exactly once.

**Independent Test**: Race two freelancers against one offer; one succeeds, the other
receives `409`, while decline/expiry creates no reservation.

### Tests for User Story 3

- [ ] T058 [P] [US3] Write failing contract tests for offer detail, idempotent accept, decline, `409`, `410`, and assignment response in `tests/contract/offers.contract.test.ts`.
- [ ] T059 [P] [US3] Write failing concurrency tests for single-winner reservation and repeated idempotent acceptance in `apps/api/tests/integration/offers.concurrency.test.ts`.
- [ ] T060 [P] [US3] Write failing realtime tests for offer/reservation events and role filtering in `apps/api/tests/integration/realtime-offers.integration.test.ts`.
- [ ] T061 [P] [US3] Write failing mobile tests for PT-BR bottom sheet, deadline, accept/decline, connection loss, and unavailable states in `apps/mobile/tests/offers/offer-sheet.test.tsx`.

### Implementation for User Story 3

- [X] T062 [P] [US3] Implement Offer transitions in `packages/domain/src/offers/offer.ts`.
- [X] T063 [US3] Implement expiry, idempotency, conditional reservation, and assignment creation in `apps/api/src/modules/offers/offer.service.ts`.
- [X] T064 [US3] Implement offer routes and `401`, `403`, `409`, `410`, and `422` mappings in `apps/api/src/modules/offers/offer.routes.ts`.
- [ ] T065 [US3] Publish PT-BR offer/reservation outbox events after commit in `apps/api/src/modules/offers/offer.events.ts`.
- [ ] T066 [P] [US3] Implement authenticated mobile offer subscription and REST reconciliation in `apps/mobile/src/features/freelancer/offers/offer-realtime.ts`.
- [X] T067 [P] [US3] Implement the PT-BR large-text bottom sheet and deadline state in `apps/mobile/app/index.tsx`.
- [ ] T068 [US3] Connect acceptance to route navigation and contractor status refresh in `apps/mobile/src/features/freelancer/offers/offer-actions.ts` and `apps/web/src/features/contractor/demands/demand-status.ts`.
- [ ] T069 [US3] Run race, expiry, reconnect, and bottom-sheet journeys and record results in `specs/001-gestao-taxas-freelancers/quickstart.md`.

**Checkpoint**: A freelancer can independently receive and accept or decline a demand.

---

## Phase 7: User Story 5 - Access the Correct Profile (Priority: P1)

**Goal**: Enforce exactly one contractor or freelancer role across web, mobile, and API.

**Independent Test**: Authenticate both profiles with CPF, verify navigation, and reject
a freelancer token against contractor-only demand creation with `403`.

### Tests for User Story 5

- [ ] T070 [P] [US5] Write failing authorization tests for invalid/expired JWTs, role claims, and cross-role access in `apps/api/tests/integration/role-authorization.integration.test.ts`.
- [ ] T071 [P] [US5] Write failing web/mobile tests for role-specific navigation and protected-state clearing in `apps/web/tests/auth/role-navigation.test.tsx` and `apps/mobile/tests/auth/role-navigation.test.tsx`.

### Implementation for User Story 5

- [ ] T072 [US5] Apply server-side role guards to every protected API route and document the matrix in `docs/authorization-matrix.md`.
- [ ] T073 [US5] Implement secure web JWT session storage and contractor route guards in `apps/web/src/features/auth/session.ts` and `apps/web/src/features/auth/guards.tsx`.
- [ ] T074 [US5] Implement secure mobile JWT session storage and freelancer route guards in `apps/mobile/src/features/auth/session.ts` and `apps/mobile/app/_layout.tsx`.
- [ ] T075 [US5] Verify CPF-derived role claims cannot be overridden by client navigation in `apps/api/src/modules/auth/role-guard.ts` and `tests/security/role-claims.test.ts`.

**Checkpoint**: Each profile can authenticate by CPF and is denied the other profile's actions.

---

## Phase 8: User Story 4 - Track Route and Microtraining (Priority: P2)

**Goal**: Show accepted route details and contextual Speckit microtraining in PT-BR.

**Independent Test**: Open an accepted assignment, inspect route details, open PT-BR
microtraining, return to the route, and verify assignment state is unchanged.

### Tests for User Story 4

- [ ] T076 [P] [US4] Write failing contract tests for assignment route, microtraining listing, and completion in `tests/contract/assignments.contract.test.ts`.
- [ ] T077 [P] [US4] Write failing domain tests for authorization, unavailable route data, published-only PT-BR training, and independent completion in `packages/domain/src/assignments/route-detail.test.ts` and `packages/domain/src/microtrainings/microtraining.test.ts`.
- [ ] T078 [P] [US4] Write failing mobile tests for route, unavailable training, return navigation, and state preservation in `apps/mobile/tests/assignments/route-detail.test.tsx`.

### Implementation for User Story 4

- [X] T079 [P] [US4] Implement RouteDetail and Microtraining entities in `packages/domain/src/assignments/route-detail.ts` and `packages/domain/src/microtrainings/microtraining.ts`.
- [ ] T080 [US4] Implement authorized assignment, route, microtraining, and completion services in `apps/api/src/modules/assignments/assignment.service.ts` and `apps/api/src/modules/microtrainings/microtraining.service.ts`.
- [X] T081 [US4] Implement route and microtraining endpoints in `apps/api/src/modules/assignments/assignment.routes.ts` and `apps/api/src/modules/microtrainings/microtraining.routes.ts`.
- [ ] T082 [P] [US4] Implement PT-BR route detail and navigation screen in `apps/mobile/app/(freelancer)/assignments/[assignmentId].tsx` and `apps/mobile/src/features/freelancer/assignments/`.
- [ ] T083 [P] [US4] Implement the reserved PT-BR Speckit microtraining area and completion state in `apps/mobile/src/features/freelancer/microtrainings/`.
- [ ] T084 [US4] Run route, unavailable-content, return-navigation, PT-BR and completion journeys in `specs/001-gestao-taxas-freelancers/quickstart.md`.

**Checkpoint**: Accepted assignments expose route and microtraining context independently.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Validate accessibility, security, performance, locale consistency, and release readiness.

- [ ] T085 [P] Add accessibility checks for PT-BR copy, large offer text, focus, contrast, map alternatives, and announcements in `apps/mobile/tests/accessibility/` and `apps/web/tests/accessibility/`.
- [ ] T086 [P] Add performance checks for nearby queries, offer presentation, and map rendering in `apps/api/tests/performance/` and `apps/mobile/tests/performance/`.
- [ ] T087 [P] Add security checks for CPF handling, password storage, demo fixture exclusion, JWT revocation, role leakage, and event filtering in `tests/security/`.
- [ ] T088 [P] Add architecture review notes for component boundaries, domain duplication, PT-BR formatting, and technical debt in `docs/architecture-review.md`.
- [ ] T089 Run ESLint and Prettier across all application workspaces and resolve/document violations in `docs/technical-debt.md`.
- [ ] T090 Run the complete Vitest, contract, integration, E2E, locale, and quickstart commands from `specs/001-gestao-taxas-freelancers/quickstart.md`.
- [ ] T091 Verify SC-001 through SC-007 with pilot evidence and record release readiness in `docs/release-readiness.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001-T009 are the workspace foundation.
- **Foundational (Phase 2)**: Depends on Setup and blocks every user story.
- **US0 Authentication (Phase 3)**: First product slice and prerequisite for all protected stories.
- **US1, US2, US3, and US5 (Phases 4-7)**: Depend on US0; US2 also needs US1 demand fixtures, and US3 needs US1/US2 contracts.
- **US4 (Phase 8)**: Depends on US3 assignment creation.
- **Polish (Phase 9)**: Depends on all desired story checkpoints.

### User Story Dependencies

- **US0**: Depends only on Phase 2; MVP entry boundary.
- **US1**: Depends on US0 and provides active demand data.
- **US2**: Depends on US0 and US1 for end-to-end nearby discovery.
- **US3**: Depends on US0, US1, and US2 eligibility contracts.
- **US5**: Depends on US0 and can run in parallel with US1-US3.
- **US4**: Depends on US3 assignment creation.

### Parallel Opportunities

- T002-T008 can run in parallel after T001.
- T010-T012, T018-T020, and T023-T024 can run in parallel within Phase 2.
- T025-T028 can be authored in parallel before US0 implementation.
- US1 and US5 can proceed in parallel after US0; US2 follows demand fixtures, while US3 follows availability.
- T085-T088 can run in parallel after all story checkpoints.

## Parallel Example: User Story 0

```text
Task: T025 auth contract tests in tests/contract/auth.contract.test.ts
Task: T026 user domain tests in packages/domain/src/users/user.test.ts
Task: T028 login-first navigation tests in apps/web/tests/auth/entry.test.tsx and apps/mobile/tests/auth/entry.test.tsx
```

## Parallel Example: User Story 3

```text
Task: T058 offer contract tests in tests/contract/offers.contract.test.ts
Task: T059 reservation race tests in apps/api/tests/integration/offers.concurrency.test.ts
Task: T061 bottom-sheet tests in apps/mobile/tests/offers/offer-sheet.test.tsx
```

## Implementation Strategy

### MVP First (User Story 0 Only)

1. Complete Setup and Foundational phases.
2. Complete US0 with PT-BR login, CPF registration, role selection, JWT, and demo fixture.
3. Validate the login-first boundary before exposing demand screens.

### Incremental Delivery

1. Add US1 for contractor demand publication.
2. Add US2 for freelancer map discovery and availability.
3. Add US3 for expiring offers and single-winner acceptance.
4. Add US5 for complete role protection if developed in parallel with earlier stories.
5. Add US4 for route details and Speckit microtraining.
6. Finish Polish and verify all measurable outcomes.

### Parallel Team Strategy

1. Complete Setup and Foundational together.
2. One developer owns US0; after its checkpoint, US1 and US5 can proceed in parallel.
3. US2 follows US1 demand fixtures; US3 follows US2 eligibility; US4 follows US3 assignment.

## Notes

- `[P]` means the task uses different files and has no dependency on incomplete work in the same phase.
- `[US0]` through `[US5]` map directly to the six user stories in `spec.md`.
- Every task has an exact path and tests precede their story implementation.
- CPF, role, locale, expiry, reservation, authorization, and location freshness are server/domain decisions.
