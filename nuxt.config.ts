// https://nuxt.com/docs/api/configuration/nuxt-config
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const useMock = process.env.USE_MOCK === 'true';
// Build/cache dirs are kept outside the OneDrive-synced project folder to avoid
// EPERM/rmdir errors from OneDrive locking files while Nuxt/Vite rewrite them.
const localCacheDir = join(tmpdir(), 'nuxt-build-cache', 'location-catalog');

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  buildDir: join(localCacheDir, '.nuxt'),
  vite: {
    cacheDir: join(localCacheDir, 'vite')
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'ShareLoc - Premium Location Catalog',
      titleTemplate: '%s - ShareLoc'
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  runtimeConfig: {
    public: {
      siteName: 'ShareLoc',
      useMock,
      directusUrl: process.env.DIRECTUS_URL || 'http://directus:8055',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '6281234567890',
      contactEmail: process.env.CONTACT_EMAIL || 'hello@shareloc.example',
      contactPhone: process.env.CONTACT_PHONE || '+62 812-3456-7890',
      contactAddress: process.env.CONTACT_ADDRESS || 'Jl. Placeholder No. 123, Jakarta, Indonesia'
    }
  }
})
