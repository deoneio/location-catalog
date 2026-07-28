// https://nuxt.com/docs/api/configuration/nuxt-config
const useMock = process.env.USE_MOCK === 'true';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  routeRules: useMock ? {} : {
    '/api/**': { proxy: (process.env.DIRECTUS_URL || 'http://10.169.6.124:8055') + '/**' }
  },
  runtimeConfig: {
    public: {
      siteName: 'ShareLoc',
      useMock,
      directusUrl: process.env.DIRECTUS_URL || 'http://10.169.6.124:8055',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '6281234567890',
      contactEmail: process.env.CONTACT_EMAIL || 'hello@shareloc.example',
      contactPhone: process.env.CONTACT_PHONE || '+62 812-3456-7890',
      contactAddress: process.env.CONTACT_ADDRESS || 'Jl. Placeholder No. 123, Jakarta, Indonesia'
    }
  }
})
