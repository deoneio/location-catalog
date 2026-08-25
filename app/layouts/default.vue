<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { useDefaultLayout } from '~/scripts/layouts/default.js'
import { useRoute, useRuntimeConfig, useHead } from '#imports'

useDefaultLayout()

const route = useRoute()
const config = useRuntimeConfig()
const siteUrl = 'https://www.shareloc.id'

useHead({
  link: [
    {
      rel: 'canonical',
      href: () => `${siteUrl}${route.path}`
    }
  ],
  meta: [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: () => config.public.siteName },
    { name: 'twitter:description', content: 'Premium Location Catalog for your creative projects.' },
    { name: 'twitter:image', content: () => `${siteUrl}/images/homepage-hero.jpg` }
  ]
})
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
}
</style>
