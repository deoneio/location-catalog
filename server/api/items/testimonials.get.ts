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
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        location_id: 1,
        bts_photos: ['mock-image-id-bts-1', 'mock-image-id-bts-2']
      },
      {
        id: 2,
        status: 'published',
        client_name: 'John Smith',
        company: 'Smith Visuals',
        youtube_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        location_id: 2,
        bts_photos: ['mock-image-id-bts-3']
      },
      {
        id: 3,
        status: 'published',
        client_name: 'Alice Johnson',
        company: 'Johnson Events Co.',
        youtube_url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        location_id: 3,
        bts_photos: []
      },
      {
        id: 4,
        status: 'published',
        client_name: 'Marco Rossi',
        company: 'Rossi Film Collective',
        youtube_url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        location_id: 4,
        bts_photos: ['mock-image-id-bts-4', 'mock-image-id-bts-5', 'mock-image-id-bts-6']
      }
    ]
  };
});
