import { getQuery } from 'h3'
import { proxyRequest } from 'h3'

const mockLocations = [
  {
    id: 1,
    status: 'published',
    name: 'Industrial Loft Studio',
    slug: 'industrial-loft-studio',
    description: 'A spacious open-plan industrial loft perfect for photoshoots and creative meetings.',
    address: '12 Warehouse Row, Kemang, South Jakarta',
    house_type: ['Converted Warehouse', 'Raw', 'Moody'],
    categories: ['Commercial', 'Drama'],
    city: 'South Jakarta',
    is_featured: true,
    thumbnail: 'mock-image-id-1',
    gallery: [
      'mock-image-id-1-a',
      'mock-image-id-1-b',
      'mock-image-id-1-c',
      'mock-image-id-1-d',
      'mock-image-id-1-e',
      'mock-image-id-1-f',
      'mock-image-id-1-g',
    ],
    key_features: 'Exposed brick, High ceilings, Natural light',
    rules_restrictions: 'No smoking, No loud music after 10 PM',
    seo_title: 'Industrial Loft Studio - ShareLoc',
    seo_description: 'Rent our industrial loft studio for your next creative project.',
  },
  {
    id: 2,
    status: 'published',
    name: 'Sunny Bohemian Garden',
    slug: 'sunny-bohemian-garden',
    description: 'A lush, aesthetic outdoor space filled with bohemian decor and plants.',
    address: '45 Jalan Kenanga, Cilandak, South Jakarta',
    house_type: ['Old House', 'Warm', 'Lived-in'],
    categories: ['Family', 'Vintage'],
    city: 'South Jakarta',
    is_featured: true,
    thumbnail: 'mock-image-id-2',
    gallery: ['mock-image-id-2-a', 'mock-image-id-2-b'],
    key_features: 'Outdoor seating, Lush greenery, Fairy lights',
    rules_restrictions: 'No pets allowed, Leave no trace',
    seo_title: 'Sunny Bohemian Garden - ShareLoc',
    seo_description: 'A beautiful bohemian garden for intimate gatherings and shoots.',
  },
  {
    id: 3,
    status: 'published',
    name: 'Modern Minimalist Apartment',
    slug: 'modern-minimalist-apartment',
    description: 'Clean lines, white walls, and minimal furniture for a sleek look.',
    address: '8 Jalan Senopati, Senopati, South Jakarta',
    house_type: ['City Apartment', 'Clean', 'Airy'],
    categories: ['Commercial', 'Family'],
    city: 'Central Jakarta',
    is_featured: false,
    thumbnail: 'mock-image-id-3',
    gallery: ['mock-image-id-3-a'],
    key_features: 'White backdrop, Designer furniture, City view',
    rules_restrictions: 'Shoe-free zone, No food/drinks on sofa',
    seo_title: 'Modern Minimalist Apartment - ShareLoc',
    seo_description: 'Sleek minimalist apartment available for content creation.',
  }
];

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const useMock = String(config.public.useMock) === 'true' || process.env.USE_MOCK === 'true'

  if (!useMock) {
    const directusUrl = process.env.DIRECTUS_URL || config.public.directusUrl || 'http://directus:8055'
    const targetUrl = `${directusUrl}${event.path.replace(/^\/api/, '')}`
    return proxyRequest(event, targetUrl)
  }

  const query = getQuery(event);
  
  // Basic simulation of Directus filter by slug: ?filter[slug][_eq]=value
  let data = [...mockLocations];
  
  // Quick hack to parse standard directus slug filter for the mock
  const filterString = JSON.stringify(query);
  if (filterString.includes('"filter[slug][_eq]":')) {
    const slug = query['filter[slug][_eq]'];
    data = data.filter(loc => loc.slug === slug);
  } else if (query.slug) { // Also support simple ?slug=value for easy testing
    data = data.filter(loc => loc.slug === query.slug);
  }

  return {
    data: data
  };
});
