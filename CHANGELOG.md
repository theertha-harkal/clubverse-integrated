# Clubverse — Integration Log

**Author:** Person 4 — Integration, Testing, Debugging & Delivery
**Project:** Clubverse (University Group Project)

## Overview

My role on this project was integration: bringing together the frontend,
backend, and database into a single working application, and making sure
every piece actually talks to every other piece correctly before
submission. The frontend (React + Vite) and backend (Spring Boot + Postgres)
were built somewhat independently by different parts of the team, so a
significant amount of the frontend had UI screens with no real data wiring
behind them yet. My job was to close that gap: connect every screen to the
correct backend endpoint, fix the mismatches that surfaced along the way,
and get the whole thing into a runnable state.

## Integration Work

- Reviewed every backend controller (`AuthController`, `PostController`,
  `CommentController`, `EventController`, `RegistrationController`,
  `VolunteerController`, `AnnouncementController`, `ReportController`) and
  mapped out the full API surface — routes, HTTP methods, request/response
  shapes, and which roles can access what.
- Built a single API client layer on the frontend (`src/lib/api.js`) so
  every screen talks to the backend through one consistent, typed
  interface instead of ad hoc fetch calls scattered around the codebase.
- Built an authentication context (`src/lib/auth.jsx`) that stores the JWT
  and current user, and wired it into login/registration for all three
  account types (Student, Club Admin, Campus/Platform Admin).
- Connected every major screen to live data: home feed, post creation and
  detail with comments, communities, events (browse, detail, register),
  volunteer opportunities and applications, event management for club
  admins (create, publish, cancel), volunteer application review, campus
  announcements, event approval queue, and the reports view for campus
  admins.
- Configured environment-based settings so the frontend and backend can
  point at each other correctly in different environments
  (`VITE_API_BASE_URL` on the frontend; `DB_URL`, `DB_USERNAME`,
  `DB_PASSWORD`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS` on the backend).
- Documented which screens don't yet have a corresponding backend feature
  (messaging, rewards/XP, analytics, moderation, audit logs, club
  membership) and made sure those are clearly labeled as placeholder/demo
  data in the UI rather than silently looking connected when they aren't.

## Issues Identified and Fixed

- **CORS was not configured on the backend at all**, which would have
  blocked every request from the frontend (different origin/port). Added
  a proper CORS configuration and enabled it in the security chain.
- **Database credentials and the JWT signing secret were hardcoded** in
  `application.properties` and in source. Moved both to environment
  variables so the project isn't shipping real-looking credentials in the
  repo.
- **Error responses were unusable.** Backend exceptions were falling
  through to Spring's default error page instead of returning JSON, which
  meant the frontend couldn't show a real error message (e.g. "wrong
  password" looked identical to a server crash). Added a global exception
  handler that returns proper JSON errors with sensible status codes.
- **Two endpoints the frontend needed didn't exist**: fetching a single
  post by ID, and updating an event's approval status. Added both to the
  backend, matching the existing controller/service patterns.
- **Authorization rules were blocking normal use cases.** Students
  couldn't read published announcements or submit reports because those
  routes were locked to admin roles only. Fixed the role rules so each
  action is restricted to the correct role, not over- or under-restricted.
- **`EventResponse` only exposed a raw organizer ID**, with no way to show
  who's actually running an event. Added the organizer's name to the
  response.
- **Target audience on announcements is a fixed set of values on the
  backend** (`CLUB_MEMBERS`, `EVENT_REGISTRANTS`, `ENTIRE_CAMPUS`), but the
  announcement form was sending free text. Fixed the form to use a
  dropdown with the exact values the backend expects.
- **A permissions/UI mismatch on event publishing**: the event status
  endpoint was initially restricted to campus admins only, but the club
  admin dashboard had a "Publish" action calling that same endpoint. Fixed
  by allowing club admins to cancel their own events while keeping
  approval of pending events exclusive to campus admins.
- **Missing required-field validation** on event creation — the backend
  requires a title, description, and date, but the form only validated
  the title. Added the missing checks so submissions fail gracefully in
  the UI instead of hitting a database error.

## Testing and Verification

- Cross-checked every frontend API call against its corresponding backend
  endpoint, request DTO, and response DTO field-by-field to confirm they
  match.
- Traced the authentication flow end-to-end: login issues a JWT, the JWT
  filter extracts the user's role and grants the matching authority, and
  the security rules on each endpoint check against the correct role.
- Checked every entity's required (`NOT NULL`) database fields against the
  corresponding frontend form to make sure nothing could be submitted
  incomplete.
- Ran the frontend build (`npm run build`) and linter (`npm run lint`) —
  both pass cleanly with no errors.
- _[Fill in once you've run it locally: backend start via
  `mvn spring-boot:run` / `./mvnw spring-boot:run`, Postgres connection
  confirmed, frontend `npm run dev`, and a walkthrough of the core flows —
  register/login, create a post, browse and register for an event, submit
  a volunteer application, approve an event as campus admin — actually
  exercised on your machine.]_

## Final Project Status

The frontend and backend are integrated against a consistent, verified API
contract, with the known bugs found during review fixed. Screens without a
backend feature behind them are clearly labeled rather than left looking
falsely functional. Remaining before final submission: your own local run
to confirm the backend starts against Postgres and the frontend serves
correctly end-to-end, and creating a Club Admin / Campus Admin test account
(registration only creates Student accounts by default — promote a user's
role directly in the database to test the admin views).
