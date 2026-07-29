import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
let knexFactory;
try {
  knexFactory = (await import('knex')).default;
} catch {
  knexFactory = (await import('/directus/node_modules/.pnpm/node_modules/knex/lib/index.js')).default;
}

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
