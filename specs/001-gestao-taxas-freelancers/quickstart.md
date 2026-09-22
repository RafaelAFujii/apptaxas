# Quickstart Validation Guide

This guide validates the planned feature after implementation. It intentionally omits
application code and complete test suites.

## Prerequisites

- Node.js 22 LTS and the repository package manager.
- Docker Desktop for PostgreSQL/PostGIS.
- Expo CLI and an iOS/Android simulator or physical device for mobile validation.
- A map/geolocation provider key configured through local environment variables.
- Separate contractor and freelancer seed accounts for local development.
- The development-only demo account: CPF `12345678900`, password `admin`.

## Install and configure

```bash
pnpm install
cp .env.example .env
pnpm db:up
pnpm db:migrate
```

The implementation MUST document how test credentials and the map provider key are
created without committing secrets.

## TDD and quality gates

```bash
pnpm test:unit
pnpm test:contract
pnpm test:integration
pnpm lint
pnpm format:check
```

The expected result is a green suite, no ESLint errors, and no Prettier differences.
Each implementation slice is expected to demonstrate red-green-refactor history for
domain validation, role authorization, reservation concurrency, offer expiry, and the
critical UI state transitions.

## End-to-end contractor and freelancer flow

1. Start the API, web app and Expo app with the repository's documented dev commands.
2. Confirm the first screen is the PT-BR login form with CPF and password fields.
3. Register a new account with CPF, name, password, confirmation, and one profile; verify
   mismatched passwords and duplicate CPF are rejected in PT-BR.
4. Log in with the development demo CPF `12345678900` and password `admin`; verify the
   protected screens become available and no login is required again for the active session.
5. Log into the web app as a contractor and create a future demand with role, restaurant
   location, schedule, value and acceptance deadline.
6. Log into the mobile app as a freelancer, grant foreground location permission and
   switch to Online.
7. Confirm the demand appears as a map pin and can be opened with summary information.
8. Confirm a new offer opens a large-text bottom sheet with accept/decline controls and
   a visible expiry.
9. Accept once and confirm the contractor sees the reservation and the freelancer sees
   route details.
10. Open the route's Speckit microtraining area, view available content in PT-BR, return to the
   route and confirm assignment state is unchanged.
11. Repeat acceptance concurrently with a second freelancer and confirm exactly one
   succeeds while the other receives `409` or an unavailable state.
12. Cancel another demand as contractor and confirm it disappears from map/offers.
13. Switch the first freelancer Offline and confirm no new offers arrive while the
    accepted assignment remains available.

## Failure-path validation

- Deny location permission and verify Online remains unavailable.
- Expire an offer and verify acceptance returns `410` without reservation.
- Use a freelancer token against contractor demand creation and verify `403`.
- Expire/revoke a JWT and verify protected data is not displayed as current.
- Disconnect and reconnect the mobile client while an offer is open; verify REST
  reconciliation shows the authoritative deadline and reservation state.

See [data-model.md](data-model.md), [contracts/http-api.md](contracts/http-api.md) and
[contracts/events.md](contracts/events.md) for the state and interface details validated
by these scenarios.