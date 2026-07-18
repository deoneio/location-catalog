// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/api/**': { proxy: (process.env.DIRECTUS_URL || 'http://10.169.6.124:8055') + '/**' }
  }
})
