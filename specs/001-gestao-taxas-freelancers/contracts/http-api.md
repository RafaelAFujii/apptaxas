# HTTP API Contract

Base path: `/v1`. JSON is UTF-8. Every response includes a `requestId` for support
diagnostics. Protected operations require `Authorization: Bearer <accessToken>`.

## Authentication

### `POST /auth/login`

Request: `{ "cpf": "string", "password": "string" }`

Response `200`: `{ "accessToken": "jwt", "refreshToken": "rotating-token", "expiresIn": 900, "user": { "id": "uuid", "cpf": "string", "name": "string", "role": "contractor|freelancer" } }`

The server MUST derive the single role from the account. A client cannot grant itself a
role. The first screen MUST be this login form when no valid session exists.

### `POST /auth/register`

Request: `{ "cpf": "string", "name": "string", "password": "string", "passwordConfirmation": "string", "role": "contractor|freelancer" }`

Response `201`: `{ "user": { "id": "uuid", "cpf": "string", "name": "string", "role": "contractor|freelancer" } }`

The server MUST reject duplicate/invalid CPF, missing name, unsupported role, and
non-matching password confirmation. All messages and fields presented in the UI are PT-BR.

Development fixtures MAY provide CPF `12345678900` with password `admin`; production
fixtures MUST NOT contain this credential.

### `POST /auth/refresh`, `POST /auth/logout`, `GET /me`

Refresh rotates the refresh token and returns a new access token. Logout revokes the
refresh session. `GET /me` returns the authenticated identity and active role.

## Contractor operations

- `POST /demands`: create a demand. Requires `contractor` role. Body contains `role`,
  `location`, `startsAt`, `endsAt`, `valueCents`, and `acceptanceDeadline`.
- `GET /demands`: list demands owned by the authenticated contractor.
- `GET /demands/{demandId}`: retrieve an owned demand and status.
- `POST /demands/{demandId}/cancel`: cancel an active owned demand.

Invalid fields return `422`; an unauthorized role returns `403`.

## Freelancer operations

- `PUT /freelancer/availability`: set `online` or `offline`; online requires location
  permission and a recent location.
- `PUT /freelancer/location`: update coordinates, accuracy and timestamp.
- `GET /demands/nearby`: return active eligible demands near the current location.
- `GET /offers` and `GET /offers/{offerId}`: list or retrieve current offers.
- `POST /offers/{offerId}/accept`: accept with an `Idempotency-Key` header. A successful
  response creates or returns the assignment. Concurrent losers receive `409`; expired
  offers receive `410`.
- `POST /offers/{offerId}/decline`: decline an offer idempotently.
- `GET /assignments/{assignmentId}` and `/route`: retrieve authorized assignment and route.
- `GET /assignments/{assignmentId}/microtrainings`: retrieve published contextual content.
- `POST /microtrainings/{microtrainingId}/completion`: record authorized completion.

## Error envelope

```json
{
  "code": "DEMAND_ALREADY_RESERVED",
  "message": "The demand is no longer available.",
  "requestId": "uuid",
  "details": {}
}
```

Required status mapping: `401` invalid session, `403` role denied, `404` inaccessible or
missing resource, `409` state/concurrency conflict or duplicate CPF, `410` expired offer,
`422` validation. User-facing messages MUST be localized to PT-BR.