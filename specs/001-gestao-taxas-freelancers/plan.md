# Implementation Plan: Freelancer Fee Management

**Branch**: `001-gestao-taxas-freelancers` | **Date**: 2026-09-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-gestao-taxas-freelancers/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Build a small TypeScript monorepo for restaurant contractors and freelancers. The first
screen is a PT-BR login; registration collects CPF, name, password, confirmation, and
one selected profile. The web app lets contractors publish and track one-off demands;
the Expo mobile app lets freelancers discover nearby demands, go online/offline, receive
time-limited offers, accept them quickly, and follow route details with contextual
Speckit microtraining. A modular monolith API owns JWT authentication, role
authorization, geospatial discovery, reservation concurrency, and event delivery.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript on Node.js 22 LTS; ReactJS web; React Native with Expo and Expo Router

**Primary Dependencies**: Fastify, PostgreSQL/PostGIS, Zod, WebSocket transport,
ReactJS, Expo, Expo Router, a map/geolocation provider, ESLint, Prettier

**Storage**: PostgreSQL with PostGIS; transactional outbox tables for reliable domain
events; CPF unique and normalized; monetary values stored as integer cents and timestamps
stored in UTC

**Testing**: Vitest for unit and contract tests, API integration tests against an
ephemeral PostgreSQL/PostGIS database, and Playwright/device-level smoke coverage for
critical web/mobile flows; TDD is mandatory for domain rules and API contracts

**Target Platform**: Web browsers for contractors; iOS and Android through Expo for
freelancers; Linux Node.js API; local development through Docker Compose

**Project Type**: Web application, mobile application, and modular HTTP/WebSocket API

**Performance Goals**: 90% of online freelancers see the first nearby demand within
30 seconds; offer presentation and acceptance remain responsive enough for the 10-second
user goal; map interactions target 60 fps on supported mobile devices

**Constraints**: Login is the first screen without a valid session; server is the source
of truth for offer expiry and reservation; acceptance requires idempotency and conditional
state transition; JWT role claims are validated server-side; the demo credential
`12345678900`/`admin` is development-only; all user-facing content and Brazilian date,
time, CPF, and currency formats are PT-BR; location permission, stale coordinates,
reconnect, empty states, and errors MUST be explicit; technical debt MUST remain below
10%; lint and formatting MUST pass before integration

**Scale/Scope**: Initial release with two roles, one API, one web app, one Expo app,
one primary demand-to-assignment flow, route details, and Speckit microtraining slots;
payroll, invoicing, disputes, background location, push notifications, and microservices
are out of scope

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean code**: PASS. The design uses explicit modules, named domain rules, and
  small feature boundaries rather than hidden side effects.
- **Single responsibility components**: PASS. Web and mobile UI are separated from
  domain rules, contracts, and integration effects.
- **Explicit web/mobile sharing**: PASS. Shared packages contain domain types,
  validation schemas, and pure rules; platform-specific UI remains in each app.
- **Simplicity**: PASS. A single modular API and PostgreSQL are used; no microservices
  or broker are introduced for the initial scope.
- **Automated quality and debt**: PASS with feature gate. ESLint, Prettier and the
  requested TDD workflow are configured before feature work; debt is tracked through
  lint/format backlog and architectural review with a <10% threshold.
- **Feature-specific TDD**: PASS. The request requires automated tests; this adds a
  feature quality gate without conflicting with the constitution's minimum governance.
- **Authentication entry flow**: PASS. Login is the first screen, registration creates
  exactly one profile per account, and protected routes are unavailable without JWT.
- **PT-BR localization**: PASS. User-facing copy and locale-sensitive formatting are
  centralized at the application edges and do not leak into domain rules.

## Project Structure

### Documentation (this feature)

```text
specs/001-gestao-taxas-freelancers/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
apps/
├── api/
│   ├── src/modules/auth/
│   ├── src/modules/demands/
│   ├── src/modules/offers/
│   ├── src/modules/availability/
│   ├── src/modules/assignments/
│   ├── src/modules/microtrainings/
│   ├── src/infrastructure/
│   └── tests/
├── web/
│   ├── src/features/contractor/
│   ├── src/components/
│   └── tests/
└── mobile/
    ├── app/
    ├── src/features/freelancer/
    ├── src/components/
    └── tests/
packages/
├── domain/
├── contracts/
├── config/
└── ui-tokens/
infra/
├── docker/
└── migrations/
tests/
├── contract/
├── integration/
└── e2e/
```

**Structure Decision**: Use a small TypeScript monorepo with three deployable apps
and four shared packages. `packages/domain` owns pure business rules; `packages/contracts`
owns request/event schemas; `packages/config` owns TypeScript, ESLint and Prettier
defaults; `packages/ui-tokens` contains only platform-neutral visual tokens. Web and
mobile do not share React components directly. The API is a modular monolith so demand
publication, offer expiry and reservation remain easy to reason about transactionally.

## Phase 0: Research Decisions

Research is consolidated in [research.md](research.md). The resolved decisions are:

1. Use a modular monolith with PostgreSQL/PostGIS instead of microservices or a broker.
2. Use REST for commands/queries and authenticated WebSocket messages for time-sensitive
   offer updates; REST reconciliation is required after reconnect.
3. Use a server-side conditional reservation with `Idempotency-Key`, `409 Conflict` for
   concurrent losers, and a transactional outbox for post-commit events.
4. Use integer cents, UTC timestamps, expiring access tokens and rotating refresh tokens.
5. Keep Speckit microtraining as a contextual content contract associated with route and
   role, without coupling the core assignment state to training completion.
6. Use CPF as the unique login identifier; collect profile selection during registration
  and enforce exactly one role per account.
7. Keep the demo CPF/password available only in development fixtures, never production.
8. Treat PT-BR as the only initial locale, including validation, errors, currency, date,
  time, and CPF presentation.

## Phase 1: Design Outputs

- [data-model.md](data-model.md) defines entities, validation, relationships and states.
- [contracts/http-api.md](contracts/http-api.md) defines role-aware HTTP contracts and errors.
- [contracts/events.md](contracts/events.md) defines authenticated real-time events and
  outbox envelopes.
- [quickstart.md](quickstart.md) defines the runnable TDD, lint, formatting and end-to-end
  validation path.

## Post-Design Constitution Check

- **Clean code and component boundaries**: PASS. Each module owns one domain capability;
  clients consume contracts rather than reaching into API internals.
- **Sharing and simplicity**: PASS. Only stable domain/contract/config packages are shared;
  one API and one database avoid premature distributed complexity.
- **Quality and debt**: PASS. Every implementation slice starts with a failing test,
  uses ESLint/Prettier gates, and records debt exceptions with an owner and removal date.
- **TDD requirement**: PASS. The quickstart and future task breakdown require red-green-
  refactor for domain, API authorization, reservation concurrency and critical UI flows.
- **Authentication and localization**: PASS. The design contains first-screen login,
  CPF registration/login, development-only demo credentials, and PT-BR UI contracts.

## Complexity Tracking

No constitution violations require a waiver. The three applications reflect the explicit
web/mobile/API product boundary, while shared packages and a modular monolith keep the
overall structure small.
