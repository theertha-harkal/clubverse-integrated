# Clubverse — Coded UI Prototype

React + Vite + Tailwind frontend prototype implementing all 38 screens from the Clubverse Figma file, across three tiers:

- **Student App** (13 screens) — Onboarding, Login, Home Feed, Create Post, Post Detail, Communities, Search, Community Detail, Events Feed, Event Detail, Volunteer Ops, Profile, Messages
- **Club Admin** (16 screens) — Admin Login, Dashboard, Club Profile, Events Management, Create Event, Event Management, Registrations, Volunteers Overview/Detail, Club Members, Announcements, Create Announcement, Rewards, Analytics, Notifications, Settings
- **Campus Admin** (11 screens) — Campus Login, Dashboard, Moderation Queue/Review, Reports, Event Approvals, Campus Announcements, Student Management, Analytics, Audit Logs, Settings

No backend — all data is mocked in-component. Use the tier switcher at the top to jump between the three apps; navigation within each tier is fully wired (bottom nav / sidebar / buttons).

## Run it

```bash
npm install
npm run dev
```

## Notes on fidelity

- Screens marked as pulled from Figma (most of Student App + first half of Club Admin) were built via the Figma Dev Mode MCP server (`get_design_context`), preserving exact copy, colors (`#4648d4` indigo / `#6cf8bb` mint / etc.), and layout, then rebuilt compactly against a shared `src/lib/ui.jsx` design-system file instead of pasting the raw Tailwind export verbatim.
- Two screens (student Profile, student Messages) don't exist as dedicated frames in the Figma file — they're referenced only by the bottom nav — so they were built to match the established design system.
- The rest of Club Admin (Volunteers Overview/Detail, Club Members, Announcements, Create Announcement, Rewards, Analytics, Notifications, Settings) and all of Campus Admin were built in the same design system after hitting the Figma MCP rate limit — visually consistent but not pixel-pulled from Figma.
- Image/icon asset URLs from Figma (`figma.com/api/mcp/asset/...`) expire ~7 days after generation; if any screens (Onboarding, Login, Home Feed, etc.) show broken images later, re-run `get_design_context` on the corresponding Figma frame to refresh them, or swap in local assets.
