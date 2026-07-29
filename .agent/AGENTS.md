# Superpowers for Antigravity

You have superpowers.

This profile adapts Superpowers workflows for Antigravity with strict single-flow execution.

## Core Rules

1. Prefer local skills in `.agent/skills/<skill-name>/SKILL.md`.
2. Execute one core task at a time with `task_boundary`.
3. Use `browser_subagent` only for browser automation tasks.
4. Track checklist progress in `<project-root>/docs/plans/task.md` (table-only live tracker).
5. Keep changes scoped to the requested task and verify before completion claims.
6. **Git Branching Rule:** NEVER commit or push directly to `main` or `develop` branches. Always create a new branch (e.g. `feature/*`, `fix/*`, `docs/*`) and submit changes via Pull Request.

## Tool Translation Contract

When source skills reference legacy tool names, use these Antigravity equivalents:

- Legacy assistant/platform names -> `Antigravity`
- `Task` tool -> `browser_subagent` for browser tasks, otherwise sequential `task_boundary`
- `Skill` tool -> `view_file ~/.gemini/skills/<skill-name>/SKILL.md` (or project-local `.agent/skills/<skill-name>/SKILL.md`)
- `TodoWrite` -> update `<project-root>/docs/plans/task.md` task list
- File operations -> `view_file`, `write_to_file`, `replace_file_content`, `multi_replace_file_content`
- Directory listing -> `list_dir`
- Code structure -> `view_file_outline`, `view_code_item`
- Search -> `grep_search`, `find_by_name`
- Shell -> `run_command`
- Web fetch -> `read_url_content`
- Web search -> `search_web`
- Image generation -> `generate_image`
- User communication during tasks -> `notify_user`
- MCP tools -> `mcp_*` tool family

## Skill Loading

- First preference: project skills at `.agent/skills`.
- Second preference: user skills at `~/.gemini/skills`.
- If both exist, project-local skills win for this profile.
- Optional parity assets may exist at `.agent/workflows/*` and `.agent/agents/*` as entrypoint shims/reference profiles.
- These assets do not change the strict single-flow execution requirements in this file.

## Single-Flow Execution Model

- Do not dispatch multiple coding agents in parallel.
- Decompose large work into ordered, explicit steps.
- Keep exactly one active task at a time in `<project-root>/docs/plans/task.md`.
- If browser work is required, isolate it in a dedicated browser step.

## Verification Discipline

Before saying a task is done:

1. Run the relevant verification command(s).
2. Confirm exit status and key output.
4. Report evidence, then claim completion.

---

# ShareLoc: Project Handover Context

**Project:** Location Catalog Website (ShareLoc)
**Tech Stack:** Nuxt 3 (Nuxt 4 Minimal Template), Vue, Vanilla CSS (No Tailwind), Directus Headless CMS (SQLite)

## Completed Setup

1. **Directus CMS:** 
   - Schema defined in `docs/plans/2026-07-14-directus-data-model.md`.
   - Setup script available at `scripts/directus-schema/setup.js`.
   - Snapshot exported at `schema.yaml`.
2. **Nuxt Boilerplate:**
   - Base app initialized in root.
   - Routing enabled via `<NuxtPage />` in `app.vue`.
   - Placeholder pages created at `app/pages/`: `index.vue`, `catalog.vue`, `catalog/[slug].vue`, `testimonials.vue`, `contact.vue`.
   - Global Vanilla CSS initialized at `app/assets/css/main.css`.
3. **API Proxy & Mocking:**
   - `.env` uses `USE_MOCK=true` by default.
   - Mock API endpoints created at `server/api/items/locations.get.ts` and `testimonials.get.ts`.
   - Changing `USE_MOCK=false` proxies `/api/**` to Directus at `DIRECTUS_URL` automatically via `nuxt.config.ts`.

## Agent Guidelines for ShareLoc

1. **Aesthetics are Critical:** The client demands a premium, modern, dynamic design. Do not produce generic minimal-viable UI. Use glassmorphism, modern typography (Inter/Roboto/Outfit), subtle micro-animations, and curated HSL palettes.
2. **CSS Rule:** Use exclusively Vanilla CSS. Do NOT use Tailwind unless explicitly asked by the user in the future.
3. **Mock Data:** Whenever building frontend components that fetch data, ensure it seamlessly works with the mock routes at `/api/items/...`.
4. **Vue SFC Structure:** Keep `.vue` files clean. Place JS/TS logic in dedicated files under `app/scripts/...` (mirroring the component/page path), exported as a named `useXxx()` function, and wire it into the component with an inline `<script setup>` block:
   ```vue
   <script setup>
   import { useIndexPage } from '~/scripts/pages/index.js'

   const { heroTitle } = useIndexPage()
   </script>
   ```
   *Note:* Do NOT use `<script setup src="...">` as the Vue compiler rejects `setup` combined with `src`. Keep CSS scoped inside the `.vue` file using `<style scoped>`.

5. **Git Branching Rule:** NEVER commit or push directly to `main` or `develop` branches under any circumstances. Always create a dedicated branch (e.g. `feature/*`, `fix/*`, `docs/*`) and submit changes via Pull Request.

---

## Architectural & Technical Learnings

### 1. Directus Singleton Collections Gotcha (`homepage_config`)
- **Symptom:** Opening an empty singleton collection in Directus Admin UI throws `ID (Hidden): Value is required`.
- **Cause:** When a singleton collection has 0 rows in the database, Directus attempts to create a new item (`POST /items/<singleton>`). Because `id` is hidden without auto-increment metadata, Directus validation fails.
- **Solution:**
  1. Set `special: 'cast-int'` in `directus_fields` for `id`.
  2. Seed initial singleton row `id: 1` into the database. Once `id: 1` exists, Directus opens the form in edit mode (`PATCH /items/<singleton>/1`).

### 2. Versioned Database Migration Runner (`scripts/migrations/`)
- **Tracking Table:** `_schema_migrations` (`id`, `name`, `executed_at`).
- **Runner Script:** `scripts/migrations/runner.js` (`npm run directus:migrate`).
- **Migration Scripts Directory:** `scripts/migrations/` (numerically prefixed `.js` files, e.g., `001_grant_public_permissions.js`, `002_seed_homepage_config.js`).
- **Execution Model:** Automatically discovers scripts, queries `_schema_migrations`, skips already executed scripts, and runs pending `up(knex)` functions sequentially in order.

### 3. Nginx Media Assets Proxy (`/assets/`) & Relative Asset Paths
- **Nginx Configuration ([docker/nginx/conf.d/default.conf](file:///home/audias/docker/location-catalog-test/docker/nginx/conf.d/default.conf)):**
  ```nginx
  location /assets/ {
      proxy_pass http://directus:8055/assets/;
      ...
  }
  ```
- **Frontend Composable ([app/composables/useDirectusAsset.js](file:///home/audias/docker/location-catalog-test/app/composables/useDirectusAsset.js)):** Returns relative path `/assets/${fileId}` so asset URLs automatically adapt to the user's active domain/port.
- **Nuxt Server Proxy Fallback ([server/routes/assets/[...].ts](file:///home/audias/docker/location-catalog-test/server/routes/assets/[...].ts)):** Proxies `/assets/**` to Directus during local development (`npm run dev`) or SSR.

### 4. Dynamic API Runtime Proxying
- API routes (`server/routes/api/[...].ts`) proxy dynamically to `DIRECTUS_URL` using `proxyRequest` from `h3`. Changes to `DIRECTUS_URL` in `docker-compose.yml` or `.env` take effect at runtime without requiring image rebuilds.
