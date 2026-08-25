export default defineEventHandler(async (event) => {
  const siteUrl = 'https://www.shareloc.id'
  
  // Fetch locations
  let locations = []
  try {
    const response = await $fetch('/api/items/locations')
    if (response && response.data) {
      locations = response.data
    }
  } catch (err) {
    console.error('Failed to fetch locations for sitemap', err)
  }

  // Static routes
  const routes = [
    '/',
    '/catalog',
    '/testimonials',
    '/contact'
  ]

  // Dynamic routes
  locations.forEach(loc => {
    if (loc.slug && loc.status === 'published') {
      routes.push(`/catalog/${loc.slug}`)
    }
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${siteUrl}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  return sitemap
})
