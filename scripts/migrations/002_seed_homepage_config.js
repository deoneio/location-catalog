export async function up(knex) {
  // Ensure hero_title column exists
  const hasCol = await knex.schema.hasColumn('homepage_config', 'hero_title');
  if (!hasCol) {
    await knex.schema.table('homepage_config', (table) => {
      table.string('hero_title', 255).nullable();
    });
    console.log('  -> Added column hero_title to homepage_config');
  }

  // Set special cast-int for id field metadata
  await knex('directus_fields')
    .where({ collection: 'homepage_config', field: 'id' })
    .update({ special: 'cast-int' });

  // Seed initial singleton row if empty
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
