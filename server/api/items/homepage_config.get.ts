import { proxyRequest } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const useMock = String(config.public.useMock) === 'true' || process.env.USE_MOCK === 'true'

  if (!useMock) {
    const directusUrl = process.env.DIRECTUS_URL || config.public.directusUrl || 'http://directus:8055'
    const targetUrl = `${directusUrl}${event.path.replace(/^\/api/, '')}`
    return proxyRequest(event, targetUrl)
  }

  return {
    data: {
      hero_media: '/images/homepage-hero.jpg',
      hero_cta_text: 'Browse the Catalog',
      value_proposition: 'Curated, premium spaces for photographers, videographers, and event planners who need a location as striking as their vision.',
      seo_title: 'ShareLoc - Premium Shoot & Event Locations',
      seo_description: 'Discover and inquire about premium rental locations for photo shoots, video productions, and events.',
      seo_image: 'mock-image-id-hero'
    }
  };
});
