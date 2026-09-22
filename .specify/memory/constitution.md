<!--
Sync Impact Report
- Version change: 0.0.0 (scaffold) -> 1.0.0
- Modified principles: none; all five principles were defined for the initial constitution
- Added sections: Technical Constraints; Development Workflow
- Removed sections: none
- Follow-up TODOs: RATIFICATION_DATE requires confirmation because no prior adoption date exists
-->

# Fee and Freelancer Management System

## Core Principles

### I. Clean Code Is Non-Negotiable
The code MUST express domain intent directly, with precise names, small functions, single responsibilities, and explicit dependencies. Duplication, accidental complexity, hidden side effects, and unnecessary abstractions MUST be removed during implementation or review. This rule exists to keep the cost of reading, modifying, and supporting predictable in a product that shares rules between web and mobile.

### II. Single Responsibility Components
Each React Native or ReactJS component MUST have a clear responsibility and a minimal interface. Reusable visual components MUST remain independent of screen-specific rules; business rules, data transformation, and integration effects MUST reside in their own modules or hooks. A component MUST be split when it mixes presentation, complex state, data access, and multiple business flows without a clear boundary.

### III. Explicit Sharing Between Web And Mobile
Code shared between ReactJS and React Native MUST be platform-agnostic and organized by domain, utility, or stable contract. Platform-specific adaptations MUST be kept at the edges, with explicit names and entry points. The team MUST avoid generic abstractions created solely to hide differences between platforms, as they increase coupling and make maintenance less predictable.

### IV. Simplicity And Incremental Evolution
The project MUST start with the smallest structure capable of handling the current fee and freelancer management flow. New layers, libraries, patterns, or abstractions MUST have a justification linked to a concrete domain need. The solution MUST prefer composition and small modules over deep hierarchies and MUST avoid premature generalization. No automated testing requirement is imposed by this constitution; the mandatory quality is clarity, separation of responsibilities, and review of the modified code.

### V. Automated Quality And Controlled Debt
ESLint MUST be executed with rules suitable for TypeScript/JavaScript and React standards before integrating changes. Prettier MUST define the canonical formatting and MUST be applied to modified files. Lint violations and formatting divergences MUST be fixed or justified in the same change set. The product's estimated technical debt MUST remain below 10%; any increase above this limit MUST generate a registered action for reduction before new structural expansions.

## Technical Constraints
The front-end MUST use ReactJS for the web experience and React Native for the mobile experience. The folder organization MUST reflect simple and recognizable boundaries, separating shareable components, platform-specific components, domain rules, and data integration. Dependencies MUST be added only when they reduce real complexity or meet a platform requirement not covered by existing APIs.

## Development Workflow
Every change MUST declare the boundary of the component or module that controls the modified behavior. The review MUST verify component names, size, and responsibility, duplication between web and mobile, introduced complexity, and the state of technical debt. Before integration, the ESLint and Prettier commands defined by the project MUST be executed in the affected scope; changes that fail these commands MUST remain outside the integration until they are fixed or formally justified.

## Governance

The constitution MUST prevail over conflicting local practices. Any principle change MUST update this document, explain the impact in the Sync Impact Report, and receive review from product or architecture owners. The version MUST follow Semantic Versioning: MAJOR for incompatible removal or redefinition of principles; MINOR for new principles or material expansion of rules; PATCH for fixes and clarifications without semantic change. Compliance MUST be reviewed in every relevant structural change and in periodic project reviews. Exceptions MUST register the affected rule, the justification, the risk, and the expiration date.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm adoption date | **Last Amended**: 2026-09-22