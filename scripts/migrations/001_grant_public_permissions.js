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
