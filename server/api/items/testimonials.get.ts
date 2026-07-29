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
    data: [
      {
        id: 1,
        status: 'published',
        client_name: 'Jane Doe',
        company: 'Bright Frame Productions',
        feedback: 'ShareLoc made finding the perfect industrial space so easy! The booking process was seamless.',
        location_id: 1,
        bts_photos: ['mock-image-id-bts-1', 'mock-image-id-bts-2']
      },
      {
        id: 2,
        status: 'published',
        client_name: 'John Smith',
        company: 'Smith Visuals',
        feedback: 'I use ShareLoc for all my client shoots now. The variety of aesthetic styles available is unmatched.',
        location_id: 2,
        bts_photos: ['mock-image-id-bts-3']
      },
      {
        id: 3,
        status: 'published',
        client_name: 'Alice Johnson',
        company: 'Johnson Events Co.',
        feedback: 'Great spaces, and the team was incredibly responsive throughout our event planning process.',
        location_id: 3,
        bts_photos: []
      }
    ]
  };
});
