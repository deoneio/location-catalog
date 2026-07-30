import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMA_PATH = path.resolve(__dirname, '../../schema.yaml');
const DIRECTUS_URL = (process.env.DIRECTUS_URL || 'http://localhost:8055').replace(/\/$/, '');
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '';

console.log('Reading schema file from:', SCHEMA_PATH);

if (!fs.existsSync(SCHEMA_PATH)) {
  console.error('Error: schema.yaml not found at', SCHEMA_PATH);
  process.exit(1);
}

if (!DIRECTUS_TOKEN) {
  console.error('Error: DIRECTUS_TOKEN is required in environment to call Directus REST API.');
  process.exit(1);
}

const rawYaml = fs.readFileSync(SCHEMA_PATH, 'utf8');
const snapshot = yaml.parse(rawYaml);

// Normalize vendor for Directus REST API validation ('sqlite3' -> 'sqlite')
if (snapshot.vendor === 'sqlite3') {
  snapshot.vendor = 'sqlite';
}

console.log(`Parsed schema version ${snapshot.version} (Directus ${snapshot.directus}, Vendor ${snapshot.vendor})`);
console.log(`Found ${snapshot.collections?.length || 0} collection(s), ${snapshot.fields?.length || 0} field(s), and ${snapshot.relations?.length || 0} relation(s).`);

async function run() {
  console.log(`\nConnecting to Directus REST API at ${DIRECTUS_URL}...`);

  try {
    // 1. Generate Schema Diff via REST API
    console.log('[1/2] Generating schema diff via POST /schema/diff...');
    const diffRes = await fetch(`${DIRECTUS_URL}/schema/diff?force=true`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(snapshot)
    });

    const diffText = await diffRes.text();

    if (!diffRes.ok) {
      console.error(`Error generating schema diff (HTTP ${diffRes.status}):`, diffText);
      process.exit(1);
    }

    const diffData = JSON.parse(diffText);

    if (!diffData.data) {
      console.log('\n✅ No diff detected. Directus schema is already 100% up-to-date!');
      return;
    }

    // 2. Apply Diff via REST API
    console.log('[2/2] Diff detected. Applying schema diff via POST /schema/apply...');
    const applyRes = await fetch(`${DIRECTUS_URL}/schema/apply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(diffData.data)
    });

    const applyText = await applyRes.text();

    if (!applyRes.ok) {
      console.error(`Error applying schema diff (HTTP ${applyRes.status}):`, applyText);
      process.exit(1);
    }

    console.log('\n✅ Schema applied successfully via Directus REST API!');
  } catch (err) {
    console.error('Failed to apply schema via Directus REST API:', err.message || err);
    process.exit(1);
  }
}

run();
