# Technical Debt Ledger

The team keeps estimated technical debt below 10% of the feature work in progress.
Every exception records an owner, impact, mitigation and removal date.

| Item                                                  | Impact                     | Owner         | Mitigation                                             | Removal date   |
| ----------------------------------------------------- | -------------------------- | ------------- | ------------------------------------------------------ | -------------- |
| In-memory repositories in the local MVP               | Persistence is not durable | API team      | Replace with PostgreSQL repositories before production | Before release |
| Map and WebSocket adapters are not wired to providers | Discovery is illustrative  | Platform team | Add approved provider adapters and contract tests      | Before pilot   |

No exception may be added without a corresponding task and review.
