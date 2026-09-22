# Feature Specification: Fee Management for Freelancers

**Feature Branch**: `001-gestao-taxas-freelancers`

**Created**: 2026-09-22

**Status**: Draft

**Input**: User description: "Build a web (ReactJS) and mobile (React Native) application for fee management (one-off jobs for restaurant freelancers). Use the interface and user flow of iFood Deliverers and Uber Eats as direct references for the mobile version. The contractor creates the demands (role, location, schedule, value). The freelancer accesses an interactive map with geolocation, an Online/Offline toggle, and pins for active fees. Upon receiving a fee offer, the system should bring up a bottom sheet with large text for quick gig acceptance. Include JWT authentication for separate profiles and reserve a space in the route details for quick Speckit microtrainings."

## Clarifications

### Session 2026-09-22

- Q: Can one account alternate between contractor and freelancer profiles, or must each account have exclusively one profile? -> A: Each account has exactly one profile: contractor or freelancer.
- Q: What maximum radius should limit demands shown to an online freelancer from their last valid location? -> A: 10 km.
- Q: Should a contractor be able to edit an active demand after publishing it? -> A: No; the contractor can only cancel it and publish a replacement.
- Q: Should the user choose the contractor or freelancer profile during registration? -> A: Yes; the profile is selected during registration and the account keeps exactly one role.
- Q: What language should the application use for its user-facing experience? -> A: Brazilian Portuguese (PT-BR).

## User Scenarios & Testing *(mandatory)*

### User Story 0 - Enter through authentication (Priority: P1)

As a user, I want the application to open on a login screen and allow me to register
with my CPF, name, password, password confirmation, and profile so that protected
experiences are unavailable until my identity is authenticated, with all user-facing
content presented in Brazilian Portuguese.

**Why this priority**: Authentication is the entry boundary for every other screen and
must establish the account's single role before any protected workflow is shown.

**Independent Test**: Open the application, verify login is the first screen, register a
valid contractor or freelancer account, log in with CPF and password, and verify that
the role-appropriate experience becomes available.

**Acceptance Scenarios**:

1. **Given** the application is opened without a valid session, **When** the user reaches
  the first screen, **Then** the system shows login with CPF and password fields and
  does not show protected application screens.
2. **Given** a new user is on the registration screen, **When** they provide a valid CPF,
  name, password, matching password confirmation, and one profile, **Then** the system
  creates an account with exactly that profile and returns them to authenticated entry.
3. **Given** a password and its confirmation do not match, **When** the user submits
  registration, **Then** the system identifies the mismatch and does not create the account.
4. **Given** the development/demo environment is enabled, **When** the user logs in with
  CPF `12345678900` and password `admin`, **Then** the system grants the configured
  demo profile and allows access to the protected screens with the experience in PT-BR.

### User Story 1 - Publish a demand (Priority: P1)

As a restaurant contractor, I want to publish a one-off demand with a role, 
location, schedule, and value to find an available freelancer.

**Why this priority**: Without a published demand, there is no offer for the freelancer to accept.

**Independent Test**: An authenticated contractor creates a valid demand and verifies that it 
appears as active for eligible freelancers in the provided region.

**Acceptance Scenarios**:

1. **Given** an authenticated contractor, **When** they provide a valid role, location, schedule, and value 
   and publish the demand, **Then** the system creates an active demand and shows its summary and status.
2. **Given** a demand with a missing or invalid required field, **When** the 
   contractor attempts to publish, **Then** the system indicates the pending field and does not create 
   the demand.
3. **Given** an active demand, **When** the contractor cancels it before acceptance, 
   **Then** it is no longer offered and its status changes to canceled.

---

### User Story 2 - Find demands as a freelancer (Priority: P1)

As a freelancer, I want to go online and view nearby demands on a map with 
geolocation to choose jobs compatible with my availability.

**Why this priority**: Quick discovery of opportunities is the main value for 
those executing the jobs.

**Independent Test**: An authenticated freelancer grants location permissions, toggles to 
online, and views on the map only active demands within the available area.

**Acceptance Scenarios**:

1. **Given** an authenticated and offline freelancer, **When** they toggle the button to online 
   and grant location access, **Then** the system confirms the online state and centers the 
   map on the current position.
2. **Given** an online freelancer, **When** there are active demands nearby, **Then** the 
  system displays selectable pins showing role, schedule, value, and approximate distance
  for active demands within 10 km.
3. **Given** location permission is denied or unavailable, **When** the freelancer 
   attempts to go online, **Then** the system explains the limitation and maintains the offline state.
4. **Given** an online freelancer, **When** they toggle to offline, **Then** the system 
   stops offering new demands and preserves the history of already accepted demands.

---

### User Story 3 - Accept a demand quickly (Priority: P1)

As an online freelancer, I want to receive an offer in a readable bottom sheet and 
accept it quickly to reduce the chance of missing the opportunity.

**Why this priority**: Acceptance is time-sensitive and needs to work with divided attention, 
especially in a mobile experience inspired by delivery apps.

**Independent Test**: An online freelancer receives a compatible demand, reviews the 
summary in the bottom sheet, and accepts or declines without navigating to another screen.

**Acceptance Scenarios**:

1. **Given** an online freelancer and a new eligible demand, **When** the offer arrives, 
   **Then** the system opens a bottom sheet with large text, role, location, schedule, 
   value, distance, and clear accept or decline actions.
2. **Given** an open bottom sheet, **When** the freelancer accepts before the deadline, 
   **Then** the demand is reserved for them, the contractor receives the update, and the 
   detailed route becomes available.
3. **Given** an open bottom sheet, **When** the freelancer declines or the deadline expires, 
   **Then** the demand is no longer presented as an offer to them and remains available 
   only if still active and eligible.
4. **Given** another freelancer accepted first, **When** the freelancer attempts to accept, 
   **Then** the system informs that the demand is no longer available without creating a reservation.

---

### User Story 4 - Track route and microtraining (Priority: P2)

As a freelancer with an accepted demand, I want to check the route details and access 
quick Speckit microtrainings in the same context to prepare for the job.

**Why this priority**: Operational context reduces doubts before arriving at the location, 
without interrupting the demand execution.

**Independent Test**: A freelancer with an accepted demand opens its details, checks the 
route, and accesses the reserved microtraining space without losing the demand status.

**Acceptance Scenarios**:

1. **Given** an accepted demand, **When** the freelancer opens the details, **Then** they see origin, 
   destination when applicable, schedule, role, value, status, and a navigable route.
2. **Given** the route details, **When** the freelancer opens the microtraining space, 
   **Then** they see short contents related to the job and can return to the route 
   maintaining the demand progress.
3. **Given** an unavailable microtraining, **When** the freelancer accesses the area, 
   **Then** the system shows a clear message and maintains the other demand details.

---

### User Story 5 - Access the correct profile (Priority: P1)

As a user, I want to securely authenticate into my contractor or freelancer profile to 
access only the actions corresponding to that single role.

**Why this priority**: Role separation protects demands, offers, and operational 
information of each participant.

**Independent Test**: A user logs in, receives a valid JWT session, and verifies that the 
menu and permissions match the chosen profile.

**Acceptance Scenarios**:

1. **Given** valid credentials for a single-role account, **When** the user logs in, 
  **Then** the system creates a JWT session and directs them to that role's experience.
2. **Given** invalid credentials or an expired token, **When** the user accesses a 
   protected action, **Then** the system blocks the action and requests valid authentication.
3. **Given** an authenticated freelancer, **When** they attempt to access demand creation, 
   **Then** the system denies the operation and maintains their freelancer experience.

### Edge Cases

- Location may become outdated, jump positions, or lose signal; the system 
  must indicate location quality and avoid promising non-existent precision.
- A demand might be published for a past time, have an invalid value, or conflict 
  with another demand from the same contractor; publication must be blocked with a 
  specific explanation.
- The connection may drop while an offer is open; the system must indicate the state 
  of the action and not confirm acceptance without server confirmation.
- The contractor might cancel a demand while a freelancer is viewing the bottom sheet;
  the panel must close or prevent acceptance with an explicit reason. Published demands
  are immutable; corrections require cancellation and a replacement demand.
- The user might close the bottom sheet, switch apps, or lock the screen; upon 
  returning, the deadline and real status of the offer must be displayed.
- The map may not contain active demands; the system must offer an empty state and maintain the 
  possibility to refresh the search without suggesting that an offer is available.
- The JWT token may expire during navigation; sensitive data must not be displayed 
  as if the session were still valid.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support separate authenticated profiles for contractors and
  freelancers, and each account MUST have exactly one of those profiles.
- **FR-001A**: System MUST use the login screen as the first screen when no valid session
  exists and MUST keep protected screens inaccessible until authentication succeeds.
- **FR-001B**: System MUST provide registration fields for CPF, name, password, password
  confirmation, and profile selection between contractor and freelancer.
- **FR-001C**: System MUST authenticate registered users using CPF and password, and MUST
  reject registration when password confirmation does not match.
- **FR-001D**: System MUST provide CPF `12345678900` with password `admin` only in the
  development/demo environment as a test credential; this credential MUST NOT be enabled
  as a production account or documented as a real user credential.
- **FR-001E**: System MUST present all user-facing labels, navigation, validation messages,
  empty states, errors, notifications and microtraining content in Brazilian Portuguese
  (PT-BR) for the initial release.
- **FR-001F**: System MUST format CPF, monetary values, dates and times according to
  Brazilian Portuguese conventions, including Brazilian Real for displayed demand values.
- **FR-002**: System MUST authenticate users with JWT and reject protected actions when 
  the token is missing, invalid or expired.
- **FR-003**: System MUST allow a contractor to create a demand with role, location, 
  date and time, value and active status.
- **FR-004**: System MUST validate required fields, future scheduling and non-negative 
  monetary values before activating a demand.
- **FR-005**: System MUST allow a contractor to view, cancel and track the status of 
  demands they created, and published demands MUST remain immutable after creation.
- **FR-006**: System MUST allow a freelancer to switch between online and offline 
  states.
- **FR-007**: System MUST request permission for geolocation before using the 
  freelancer's current position to discover demands.
- **FR-008**: System MUST display active, eligible demands as map pins with enough 
  summary information for a freelancer to decide whether to open them, limiting discovery
  to active demands within 10 km of the last valid freelancer location.
- **FR-009**: System MUST show a demand detail with role, location, schedule, value, 
  distance, status and acceptance deadline when applicable.
- **FR-010**: System MUST present a bottom sheet for new eligible offers with large, 
  readable text and prominent accept and decline actions.
- **FR-011**: System MUST process acceptance as a time-sensitive operation and confirm 
  the result before marking the demand as reserved for the freelancer.
- **FR-012**: System MUST prevent more than one freelancer from reserving the same 
  demand and explain when an offer is no longer available.
- **FR-013**: System MUST stop presenting new offers to a freelancer after they go 
  offline while preserving accepted demands.
- **FR-014**: System MUST provide route details for an accepted demand, including the 
  schedule, role, location, value and current status.
- **FR-015**: System MUST reserve a visible area in route details for short Speckit 
  microtraining content and allow returning to the route without losing context.
- **FR-016**: System MUST provide responsive web and mobile experiences with equivalent 
  core capabilities and platform-appropriate navigation.
- **FR-017**: System MUST keep the mobile discovery and acceptance flow direct, map-first 
  and low-friction, using delivery-operations apps as interaction references without 
  reproducing their protected branding or assets.
- **FR-018**: System MUST show clear loading, empty, permission, offline, expired and 
  error states for the flows in this specification.

### Key Entities

- **User**: Participant with unique CPF, name, password credential, exactly one profile
  type, session state and permissions for contractor or freelancer actions; the user's
  visible experience is localized to PT-BR.
- **Demand**: A point-in-time restaurant job with role, location, schedule, value, 
  publication status and optional accepted freelancer.
- **Freelancer Availability**: The freelancer's online/offline state, last known 
  location, location permission state and eligibility context.
- **Offer**: A time-limited presentation of an active demand to an eligible freelancer, 
  including deadline and acceptance state.
- **Route Detail**: Operational view for an accepted demand containing location, 
  schedule, status, navigation context and microtraining area.
- **Microtraining**: Short Speckit learning content associated with an operational 
  route or role.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of contractors with valid inputs can publish a demand in 
  under 2 minutes on their first attempt.
- **SC-002**: At least 90% of eligible freelancers can move online and see the first 
  nearby active demand in under 30 seconds after granting location permission.
- **SC-003**: At least 85% of eligible freelancers can understand the essential offer 
  details and accept or decline from the offer surface in under 10 seconds.
- **SC-004**: 100% of accepted demands show one unambiguous freelancer, status and 
  route detail to both involved parties.
- **SC-005**: 100% of expired, cancelled or already-reserved demands are prevented from 
  being newly accepted.
- **SC-006**: At least 90% of pilot users complete the primary task for their profile 
  without support: publish a demand as contractor or accept one as freelancer.
- **SC-007**: At least 85% of pilot freelancers rate the map-to-accept flow as clear 
  and quick in a post-task evaluation.

## Assumptions

- The first release serves contractors connected to restaurants and freelancers who 
  perform short, local jobs; payroll, invoicing and dispute resolution are outside 
  this feature.
- A contractor provides a valid restaurant location and a future date and time.
- A freelancer has a compatible device and may grant location permission while using 
  the service; background location is not required for the initial scope.
- Nearby-demand discovery uses a fixed 10 km radius for the initial release; configurable
  radii are outside this feature.
- JWT issuance, renewal and revocation follow the project's security policy; each account
  has exactly one role; this feature does not define password recovery or multi-factor
  authentication.
- The first release validates CPF format and uniqueness; CPF recovery, account deletion,
  password recovery and multi-factor authentication are outside this feature.
- Map and geolocation data are available from an approved provider; provider selection, 
  pricing and routing accuracy are planning concerns for the next phase.
- The Speckit microtraining catalog is supplied separately and can be associated with 
  roles or route details.
- The product may use ReactJS for web and React Native for mobile, as requested; the 
  specification defines user outcomes and does not prescribe internal component design.
- The initial release uses PT-BR as the only supported user-facing language; additional
  locales and language switching are outside this feature.
- No automated testing requirement is introduced by this feature specification; quality 
  gates remain governed by the project constitution.