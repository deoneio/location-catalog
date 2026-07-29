# Design Document: Versioned Database Migration & Seed Runner

**Date:** 2026-07-29  
**Goal:** Implement a lightweight, zero-dependency versioned database migration and seeding runner for Directus SQLite.

---

## 1. Requirements & User Intent

- **Version Tracking:** Track executed migration/seed scripts in a dedicated tracking table (`_schema_migrations`).
- **Sequential Execution:** Automatically discover and sort migration scripts (e.g., `001_...js`, `002_...js`, `003_...js`).
- **Idempotency:** Skip scripts that have already been recorded in `_schema_migrations`, executing only new/pending scripts.
- **Zero-Dependency:** Run directly using Node.js and the existing SQLite database driver (`knex` / `sqlite3`) inside Docker.

---

## 2. Architecture & File Structure

```text
scripts/
└── migrations/
    ├── runner.js                           # Migration runner entrypoint
    ├── 001_grant_public_permissions.js     # Migration 001: Public read access
    └── 002_seed_homepage_config.js         # Migration 002: Singleton ID fix & initial seed
```

### 2.1 Tracking Table Schema (`_schema_migrations`)

```sql
CREATE TABLE IF NOT EXISTS _schema_migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Runner Execution Algorithm (`scripts/migrations/runner.js`)

1. Connect to SQLite database at `/directus/database/data.db` (or `DIRECTUS_DB_FILENAME` env var).
2. Ensure `_schema_migrations` table exists.
3. Read all `.js` files from `scripts/migrations/` (excluding `runner.js`).
4. Sort files lexicographically / numerically by version prefix (`001`, `002`, `003`...).
5. Query `_schema_migrations` to retrieve executed script names.
6. For each unexecuted script:
   - Import and invoke `await migration.up(knex)`.
   - Record script name into `_schema_migrations`.
   - Log execution progress.

---

## 3. Initial Migrations

### Migration `001_grant_public_permissions.js`
- Ensures public policy (`17865cbe-5a33-4be3-bcf2-b2d3d924d550`) has read permissions for `locations`, `testimonials`, `homepage_config`, and `directus_files`.

### Migration `002_seed_homepage_config.js`
- Sets `special: 'cast-int'` in `directus_fields` for `homepage_config.id`.
- Inserts initial singleton row (`id: 1`) into `homepage_config` if table is empty.

---

## 4. Automation & Integration

1. Add NPM script to [package.json](file:///home/audias/docker/location-catalog-test/package.json):
   ```json
   "directus:migrate": "node scripts/migrations/runner.js"
   ```
2. Can be run inside container:
   ```bash
   docker exec shareloc-directus node /directus/scripts/migrations/runner.js
   ```
