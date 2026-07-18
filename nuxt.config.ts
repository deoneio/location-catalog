// https://nuxt.com/docs/api/configuration/nuxt-config
const useMock = process.env.USE_MOCK === 'true';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  routeRules: useMock ? {} : {
    '/api/**': { proxy: (process.env.DIRECTUS_URL || 'http://10.169.6.124:8055') + '/**' }
  }
})
