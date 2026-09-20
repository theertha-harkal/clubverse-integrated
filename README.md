# ClubVerse

- `backend/` — Spring Boot API (Java 21+, Maven, Postgres).
- `frontend/` — React + Vite client.

**Start here:** [`CHANGELOG.md`](./CHANGELOG.md) — it documents every fix
made in this pass, which screens are wired to real data vs. still on demo
data, and full run instructions (backend env vars, frontend `npm run dev`,
and how to create a Club/Campus admin account since self-registration only
creates students).

Quick start once you've read that:

```bash
# Terminal 1
cd backend
export DB_PASSWORD=your_postgres_password
./mvnw spring-boot:run

# Terminal 2
cd frontend
npm install
npm run dev
```
