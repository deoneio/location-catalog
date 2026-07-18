import { createDirectus, rest, staticToken, createCollection, createField, createRelation } from '@directus/sdk';
import 'dotenv/config';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || 'your-admin-token';

const client = createDirectus(DIRECTUS_URL).with(staticToken(DIRECTUS_TOKEN)).with(rest());

async function setupSchema() {
  console.log('Connecting to Directus at', DIRECTUS_URL);
  
  try {
    console.log('--- Creating Collections ---');
    
    // 1. Locations Collection
    await client.request(createCollection({
      collection: 'locations',
      meta: { icon: 'location_on', archive_field: 'status', archive_app_filter: true },
      schema: { name: 'locations' }
    }));
    console.log('Created: locations');

    // 2. Testimonials Collection
    await client.request(createCollection({
      collection: 'testimonials',
      meta: { icon: 'format_quote', archive_field: 'status', archive_app_filter: true },
      schema: { name: 'testimonials' }
    }));
    console.log('Created: testimonials');

    // 3. Homepage Config (Singleton)
    await client.request(createCollection({
      collection: 'homepage_config',
      meta: { icon: 'home', singleton: true },
      schema: { name: 'homepage_config' }
    }));
    console.log('Created: homepage_config');

    console.log('\n--- Creating Fields for Locations ---');
    
    const locationFields = [
      { field: 'status', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Archived', value: 'archived' }] } }, schema: { default_value: 'draft' } },
      { field: 'name', type: 'string', meta: { interface: 'input' } },
      { field: 'slug', type: 'string', meta: { interface: 'input' }, schema: { is_unique: true } },
      { field: 'description', type: 'text', meta: { interface: 'input-wysiwyg' } },
      { field: 'aesthetic_style', type: 'string', meta: { interface: 'input' } },
      { field: 'capacity', type: 'integer', meta: { interface: 'input' } },
      { field: 'is_featured', type: 'boolean', meta: { interface: 'boolean' }, schema: { default_value: false } },
      { field: 'thumbnail', type: 'uuid', meta: { interface: 'file-image' } },
      { field: 'key_features', type: 'text', meta: { interface: 'input-wysiwyg' } },
      { field: 'rules_restrictions', type: 'text', meta: { interface: 'input-wysiwyg' } },
      { field: 'seo_title', type: 'string', meta: { interface: 'input' } },
      { field: 'seo_description', type: 'text', meta: { interface: 'input-multiline' } },
      { field: 'seo_image', type: 'uuid', meta: { interface: 'file-image' } },
    ];

    for (const f of locationFields) {
      await client.request(createField('locations', f));
      console.log(`Added field: locations.${f.field}`);
    }

    console.log('\n--- Creating Fields for Testimonials ---');
    const testimonialFields = [
      { field: 'status', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Archived', value: 'archived' }] } }, schema: { default_value: 'draft' } },
      { field: 'client_name', type: 'string', meta: { interface: 'input' } },
      { field: 'company', type: 'string', meta: { interface: 'input' } },
      { field: 'feedback', type: 'text', meta: { interface: 'input-wysiwyg' } },
      { field: 'location_id', type: 'uuid', meta: { interface: 'select-dropdown-m2o' } }
    ];

    for (const f of testimonialFields) {
      await client.request(createField('testimonials', f));
      console.log(`Added field: testimonials.${f.field}`);
    }

    console.log('\n--- Creating Fields for Homepage Config ---');
    const homepageFields = [
      { field: 'hero_media', type: 'uuid', meta: { interface: 'file-image' } },
      { field: 'hero_cta_text', type: 'string', meta: { interface: 'input' } },
      { field: 'value_proposition', type: 'text', meta: { interface: 'input-wysiwyg' } },
      { field: 'seo_title', type: 'string', meta: { interface: 'input' } },
      { field: 'seo_description', type: 'text', meta: { interface: 'input-multiline' } },
      { field: 'seo_image', type: 'uuid', meta: { interface: 'file-image' } },
    ];

    for (const f of homepageFields) {
      await client.request(createField('homepage_config', f));
      console.log(`Added field: homepage_config.${f.field}`);
    }

    console.log('\n--- Setting up Relations (Many-to-One) ---');
    
    // thumbnail
    await client.request(createRelation({
      collection: 'locations',
      field: 'thumbnail',
      related_collection: 'directus_files'
    }));

    // seo_image
    await client.request(createRelation({
      collection: 'locations',
      field: 'seo_image',
      related_collection: 'directus_files'
    }));

    // testimonials location_id
    await client.request(createRelation({
      collection: 'testimonials',
      field: 'location_id',
      related_collection: 'locations'
    }));

    // homepage_config hero_media
    await client.request(createRelation({
      collection: 'homepage_config',
      field: 'hero_media',
      related_collection: 'directus_files'
    }));

    // homepage_config seo_image
    await client.request(createRelation({
      collection: 'homepage_config',
      field: 'seo_image',
      related_collection: 'directus_files'
    }));
    console.log('Standard relations established.');

    console.log('\n[!] Note on Many-to-Many Fields (gallery, bts_photos):');
    console.log('For Many-to-Many fields (like `gallery` on locations, and `bts_photos` on testimonials),');
    console.log('Directus requires junction collections (e.g., `locations_files`) to be created first.');
    console.log('For a complete setup including M2M, using the `npx directus schema apply` approach is highly recommended over API manipulation.');

    console.log('\n--- Schema Setup Complete! ---');

  } catch (error) {
    console.error('Error setting up schema:', error.errors || error.message);
  }
}

setupSchema();
