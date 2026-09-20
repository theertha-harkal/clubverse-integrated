# ClubVerse — Integration Changelog

## TL;DR

The frontend you sent (`clubverse-proto`) had **zero API integration** — every
screen used hardcoded arrays and uncontrolled inputs. There were no
frontend/backend "mismatches" to reconcile in the usual sense; instead this
pass builds the missing integration layer, fixes several real backend bugs
found along the way, and wires up every screen that has a matching backend
capability. Screens with no backend counterpart are left on local state but
now show an in-app "demo data" banner instead of silently pretending to be
real.

---

## Backend fixes (`backend/`)

| # | Issue | Fix |
|---|-------|-----|
| 1 | **No CORS configuration at all.** Every cross-origin request from the frontend (different port = different origin) would have been blocked by the browser before even reaching the server. | Added `config/CorsConfig.java` (a `CorsConfigurationSource` bean, origins configurable via `CORS_ALLOWED_ORIGINS`) and wired `.cors(Customizer.withDefaults())` into `SecurityConfig`'s filter chain. Without the `.cors()` call, Spring Security never consults the bean even if it exists. |
| 2 | **Database password committed in plaintext** in `application.properties` (`Rsha@1056#`). | Externalized to `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` env vars, with a harmless local-dev default. |
| 3 | **JWT signing secret hardcoded** as a source constant in `JwtService.java`. | Moved to `app.jwt.secret` (env var `JWT_SECRET`), injected via `@Value`. |
| 4 | **Every service throws a bare `RuntimeException`**, which Spring turns into a 500 + HTML whitelabel page. The frontend can't read a message out of that, so "wrong password" and "server crashed" looked identical. | Added `config/GlobalExceptionHandler.java` (`@ControllerAdvice`) that maps exception messages to sensible JSON + status codes (401 for bad login, 409 for duplicate email, 404 for not-found, 400 otherwise). |
| 5 | **No `GET /api/posts/{id}`.** Only "list all posts" and "list comments" existed; there was no way to fetch a single post by id, which any post-detail deep link needs. | Added the endpoint to `PostController` / `PostService`. |
| 6 | **No way to approve/reject a pending event.** `EventService.createEvent` sets `status = PENDING` when `approvalRequired = true`, but nothing could ever move it out of `PENDING`. | Added `PUT /api/events/{id}/status` to `EventController` / `EventService`, restricted to `PLATFORM_ADMIN`. |
| 7 | **`EventResponse` only exposed `organizerId`** (a raw number), with no way for the frontend to show who's actually organizing an event — there's no "get user by id" endpoint. | Added `organizerName` to `EventResponse`; `EventService` resolves it via `UserRepository` when building the response. |
| 8 | **Authorization rules blocked legitimate student actions.** `GET /api/announcements/published` and `POST /api/reports` were both caught by a blanket `hasAnyRole(CLUB_ADMIN, PLATFORM_ADMIN)` rule on `/api/announcements/**` and `/api/reports/**`, which means an ordinary student reading announcements or filing a report would get `403 Forbidden`. | Split the rules: published announcements are readable by any authenticated user; report *creation* is open to any authenticated user, report *listing* stays `PLATFORM_ADMIN`-only. Also added explicit rules so only `CLUB_ADMIN`/`PLATFORM_ADMIN` can create events, create volunteer opportunities, or decide volunteer applications (previously *any* authenticated user could, since there was no restriction at all on those endpoints). |

Nothing else in the backend's business logic was changed — services, entities,
repositories, and the rest of the DTOs are untouched.

---

## Frontend changes (`frontend/`)

### New files
- **`src/lib/api.js`** — the only place that talks to the backend. One
  function per real endpoint (`AuthApi`, `PostsApi`, `EventsApi`,
  `VolunteerApi`, `AnnouncementsApi`, `ReportsApi`), JWT attached
  automatically, errors surfaced as `ApiError` with the backend's message.
- **`src/lib/auth.jsx`** — `AuthProvider` / `useAuth()`. Persists the JWT +
  user object in `localStorage` so a page refresh doesn't log you out.
- **`.env` / `.env.example`** — `VITE_API_BASE_URL` (defaults to
  `http://localhost:8080`).
- New shared UI primitives in `src/lib/ui.jsx`: `TextField`, `TextAreaField`,
  `ErrorNotice`, `LoadingState`, `EmptyState`, `MockDataNotice`.

### Screens wired to the real API
**Student:** Login/Register, HomeFeed, CreatePost, PostDetail (+ comments),
Communities, CommunityDetail, EventsFeed, EventDetail (+ registration),
VolunteerOps (+ apply), Search, Profile (+ logout).

**Club Admin:** AdminLogin, Dashboard, EventsManagement, EventManagement
(+ publish/cancel), Registrations (+ CSV export), CreateEvent,
VolunteersOverview (+ new "create opportunity" flow, since the backend
requires one and no screen exposed it), VolunteerDetail (+ approve/reject),
Announcements, CreateAnnouncement, Settings (+ logout).

**Campus Admin:** CampusLogin, Dashboard (real pending-event/open-report
counts), EventApprovalQueue (+ approve/deny), ReportsManagement (+ status
filter, read-only — see limitations), CampusAnnouncements, Shell (+ logout).

### Screens intentionally left on mock data
The backend has no entity/endpoint for these, so faking a connection would be
dishonest. Each now shows an amber "⚠ demo data" banner in the app instead of
silently pretending to be live:

- **Messages / Notifications** (student & club admin) — no messaging/notification backend.
- **ClubProfile / ClubMembers** — no club/organization or membership entity.
- **RewardsManagement / Profile XP** — no XP/rewards tracking.
- **Analytics / CampusAnalytics** — no analytics endpoint.
- **ModerationQueue / ModerationReview** — `Post` has no moderation-status field.
- **StudentManagement** — no admin user-directory endpoint.
- **AuditLogs** — no audit-log entity.
- **CampusSettings / AdminSettings sections** — no settings endpoint.

### Known rough edges (not fixed, flagged here instead)
- **Registration only ever creates `STUDENT` accounts** (see
  `AuthService.register` — this wasn't changed). There's no self-service way
  to become a `CLUB_ADMIN` or `PLATFORM_ADMIN`; see "Creating an admin
  account" below.
- **Reports can't be re-statused from the UI.** There's no
  `PUT /api/reports/{id}/status` endpoint, so `ReportsManagement` is
  read-only. Flagged in-app.
- **No file upload anywhere.** Post media, event posters, and avatars are all
  plain URL fields on the backend — the "upload" UI was replaced with a
  "paste an image URL" field rather than faking a file picker.
- **"Create Announcement" always returns to the club-admin announcements
  list**, even when opened from Campus Admin's "New Announcement" button.
  Cosmetic navigation quirk inherited from the prototype's shared-screen
  design, not a data issue.
- **`schema.sql` / `sampledata.sql`** in the backend repo are written for
  MySQL (`ENUM(...)` columns) while the actual datasource is Postgres, and
  `spring.jpa.hibernate.ddl-auto=update` means Hibernate generates the schema
  itself — these files are dead weight, currently unused by Spring Boot.
  Left in place but not fixed (out of scope); safe to delete.

---

## Post-delivery verification pass

A second pass specifically checked runnability: every frontend API call
cross-referenced against every controller/DTO/entity, the auth flow traced
end-to-end, and every entity's `NOT NULL` constraints checked against its
corresponding form. **This environment cannot reach Maven Central** (network
egress blocks `repo.maven.apache.org` with a 403), so the backend was
verified by exhaustive static/manual review, not an actual `mvn compile` —
run that yourself before trusting it fully. The frontend build
(`npm install && npm run build`) was verified green on the exact shipped
code. Three real bugs were found and fixed in this pass:

1. **`Announcement.targetAudience` is a strict backend enum**
   (`CLUB_MEMBERS` / `EVENT_REGISTRANTS` / `ENTIRE_CAMPUS`), but
   `CreateAnnouncement.jsx` sent free text ("All students") — every
   announcement submission would have failed with a 400. Fixed by replacing
   the text field with a `<select>` bound to the exact enum values.
2. **Security/UI contradiction on event status.** `PUT /api/events/{id}/status`
   was locked to `PLATFORM_ADMIN` only, but `EventManagement.jsx` (a
   club-admin screen) had a "Publish" button calling that same endpoint —
   it would have 403'd. Fixed by broadening the endpoint to
   `CLUB_ADMIN` or `PLATFORM_ADMIN`, and changing the club-admin UI so it
   can only **cancel** an already-published event, never self-approve a
   pending one (that stays exclusively in Campus Admin's
   `EventApprovalQueue`).
3. **Missing required-field validation.** `Event.title`, `description`, and
   `eventDate` are `NOT NULL` at the database level, but `CreateEvent.jsx`
   only validated `title` client-side — submitting without a description or
   date would have hit a raw Hibernate constraint violation. Fixed by adding
   the missing client-side checks.

Every other entity's `NOT NULL` columns (Post, Comment, VolunteerOpportunity,
Announcement) were checked against their forms and were already correctly
validated.

### Remaining manual steps
1. **Run `mvn compile` / `mvn spring-boot:run` yourself** to get an actual
   compiler green light — this environment couldn't produce one.
2. **Postgres must be running** with a `clubverse` database before starting
   the backend (`ddl-auto=update` creates/updates tables automatically).
3. **Promote a test account to admin manually** (see "Creating a Club
   Admin / Campus Admin account" below) — registration only ever creates
   students.
4. **If Vite picks a port other than 5173** (it auto-increments when 5173 is
   busy), update `CORS_ALLOWED_ORIGINS` on the backend to match, or the
   browser will silently block every request.
5. **The "report a post/event/user" feature has no UI anywhere**, even
   though the backend endpoint (`POST /api/reports`) works and its
   permissions were fixed in this pass — it just was never part of the
   original screen designs, so it's a real, usable endpoint sitting unused.
6. **`GET /api/events/{id}/registrations` has no ownership check** — any
   authenticated user can view any event's registrant list by calling the
   endpoint directly. Not exposed in any UI, and this is a pre-existing gap
   in the original backend design (not something introduced or fixed in
   this pass) — worth hardening before real deployment.

---



### 1. Backend
```bash
cd backend
# Postgres must be running and a `clubverse` database must exist.
# Either export env vars, or just rely on the dev defaults baked into
# application.properties (Postgres on localhost:5432, user/pass postgres/postgres).
export DB_URL=jdbc:postgresql://localhost:5432/clubverse
export DB_USERNAME=postgres
export DB_PASSWORD=your_real_password
export JWT_SECRET=$(openssl rand -base64 48)   # always set a real one outside local dev

./mvnw spring-boot:run
# or: mvn spring-boot:run
```
Hibernate (`ddl-auto=update`) creates/updates tables automatically on first
run — no manual migration needed. The API listens on `http://localhost:8080`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Opens on `http://localhost:5173` by default. `.env` already points at
`http://localhost:8080`; edit `VITE_API_BASE_URL` if your backend runs
elsewhere.

### 3. Creating a Club Admin / Campus (Platform) Admin account
Registration through the app (`/register`) always creates a `STUDENT`. To
test the admin experiences, register a normal account first, then promote it
directly in the database:
```sql
UPDATE users SET role = 'CLUB_ADMIN'      WHERE email = 'you@university.edu';
-- or
UPDATE users SET role = 'PLATFORM_ADMIN'  WHERE email = 'you@university.edu';
```
Log out and back in afterwards (the JWT embeds the role at login time).

### 4. Using the app
The app still uses the original prototype's tier-switcher pill at the top —
this isn't real routing, it's a way to preview all three experiences (Student
/ Club Admin / Campus Admin) side by side. Switching tiers sends you to that
tier's login screen unless you're already signed in with a matching role.
