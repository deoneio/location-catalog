# Versioned Database Migration & Seed Runner Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build a lightweight, zero-dependency versioned database migration and seed runner for Directus SQLite.

**Architecture:** A Node.js runner script scans `scripts/migrations/` for ordered migration files (`001_...js`, `002_...js`), checks a `_schema_migrations` SQLite tracking table, and runs only unexecuted scripts sequentially.

**Tech Stack:** Node.js, Knex / SQLite3, Directus SDK

---

### Task 1: Create Migration Runner

**Files:**
- Create: `scripts/migrations/runner.js`

**Step 1: Write `scripts/migrations/runner.js`**

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import knexFactory from 'knex';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_FILENAME || '/directus/database/data.db';

const knex = knexFactory({
  client: 'sqlite3',
  connection: { filename: dbPath },
  useNullAsDefault: true
});

async function runMigrations() {
  console.log('=== Running Versioned Database Migrations ===');

  // 1. Ensure tracking table exists
  const hasTable = await knex.schema.hasTable('_schema_migrations');
  if (!hasTable) {
    await knex.schema.createTable('_schema_migrations', (table) => {
      table.increments('id').primary();
      table.string('name').unique().notNullable();
      table.timestamp('executed_at').defaultTo(knex.fn.now());
    });
    console.log('Created _schema_migrations tracking table.');
  }

  // 2. Fetch already executed migrations
  const executedRows = await knex('_schema_migrations').select('name');
  const executedSet = new Set(executedRows.map((r) => r.name));

  // 3. Discover migration files
  const files = fs
    .readdirSync(__dirname)
    .filter((f) => f.endsWith('.js') && f !== 'runner.js')
    .sort();

  console.log(`Found ${files.length} migration script(s) total.`);

  // 4. Run pending migrations
  let executedCount = 0;
  for (const file of files) {
    if (executedSet.has(file)) {
      console.log(`[SKIP] ${file} (already executed)`);
      continue;
    }

    console.log(`[RUNNING] ${file}...`);
    const filePath = path.join(__dirname, file);
    const migration = await import(`file://${filePath}`);

    if (typeof migration.up === 'function') {
      await migration.up(knex);
    }

    await knex('_schema_migrations').insert({ name: file });
    console.log(`[COMPLETED] ${file}`);
    executedCount++;
  }

  console.log(`=== Migration Complete: ${executedCount} script(s) executed ===`);
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
```

**Step 2: Verify runner execution inside container**

Run: `docker exec shareloc-directus node /directus/scripts/migrations/runner.js`  
Expected: Output shows `Created _schema_migrations tracking table.` and completes cleanly.

---

### Task 2: Create Initial Migration Scripts

**Files:**
- Create: `scripts/migrations/001_grant_public_permissions.js`
- Create: `scripts/migrations/002_seed_homepage_config.js`

**Step 1: Write `scripts/migrations/001_grant_public_permissions.js`**

```javascript
export async function up(knex) {
  const publicPolicyId = '17865cbe-5a33-4be3-bcf2-b2d3d924d550';
  const collections = ['locations', 'testimonials', 'homepage_config', 'directus_files'];

  for (const col of collections) {
    const exists = await knex('directus_permissions')
      .where({ policy: publicPolicyId, collection: col, action: 'read' })
      .first();

    if (!exists) {
      await knex('directus_permissions').insert({
        policy: publicPolicyId,
        collection: col,
        action: 'read',
        fields: '*'
      });
      console.log(`  -> Granted public read on ${col}`);
    }
  }
}
```

**Step 2: Write `scripts/migrations/002_seed_homepage_config.js`**

```javascript
export async function up(knex) {
  // Set special cast-int for id
  await knex('directus_fields')
    .where({ collection: 'homepage_config', field: 'id' })
    .update({ special: 'cast-int' });

  // Seed initial row if empty
  const count = await knex('homepage_config').count('* as count').first();
  if (Number(count.count) === 0) {
    await knex('homepage_config').insert({
      id: 1,
      hero_title: 'Find the Perfect Location for Your Next Shoot',
      hero_cta_text: 'Browse the Catalog',
      value_proposition: 'Curated, premium spaces for photographers, videographers, and event planners who need a location as striking as their vision.',
      seo_title: 'ShareLoc - Premium Shoot & Event Locations',
      seo_description: 'Discover and inquire about premium rental locations for photo shoots, video productions, and events.'
    });
    console.log('  -> Seeded homepage_config singleton row id 1');
  }
}
```

**Step 3: Run migration runner**

Run: `docker exec shareloc-directus node /directus/scripts/migrations/runner.js`  
Expected: `001_grant_public_permissions.js` and `002_seed_homepage_config.js` show `[COMPLETED]`.

**Step 4: Re-run migration runner to verify idempotency**

Run: `docker exec shareloc-directus node /directus/scripts/migrations/runner.js`  
Expected: `001` and `002` show `[SKIP] (already executed)`.

---

### Task 3: Package Script & PR

**Files:**
- Modify: `package.json`

**Step 1: Add `npm run directus:migrate` to `package.json`**

Add script:
```json
"directus:migrate": "node scripts/migrations/runner.js"
```

**Step 2: Commit and push changes**

```bash
git add .
git commit -m "feat(migrations): add versioned database migration runner and initial seeds"
git push -u origin feature/homepage-hero-title-field
```
