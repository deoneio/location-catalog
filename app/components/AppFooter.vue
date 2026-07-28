<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <p class="brand">{{ siteName }}</p>
        <p class="tagline">Premium spaces for shoots and events.</p>
      </div>

      <nav class="footer-nav">
        <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to">
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="footer-contact">
        <a :href="whatsappLink" target="_blank" rel="noopener">WhatsApp</a>
        <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
        <a :href="`tel:${contactPhone}`">{{ contactPhone }}</a>
      </div>
    </div>

    <p class="copyright">&copy; {{ currentYear }} {{ siteName }}. All rights reserved.</p>
  </footer>
</template>

<script setup>
import { useAppFooter } from '~/scripts/components/AppFooter.js'

const { siteName, contactEmail, contactPhone, whatsappLink, currentYear, navLinks } = useAppFooter()
</script>

<style scoped>
.site-footer {
  background: var(--color-primary);
  color: hsla(30, 15%, 96%, 0.85);
  padding: 3rem 1.5rem 1.5rem;
  margin-top: 4rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
}

.brand {
  font-family: var(--font-heading);
  font-weight: 700;
  color: hsla(30, 20%, 97%, 1);
  margin: 0;
}

.tagline {
  margin: 0.35rem 0 0;
  color: hsla(30, 15%, 96%, 0.6);
}

.footer-nav,
.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-nav a,
.footer-contact a {
  color: hsla(30, 15%, 96%, 0.75);
  transition: color var(--transition-fast);
}

.footer-nav a:hover,
.footer-contact a:hover {
  color: var(--color-accent);
}

.copyright {
  max-width: 1200px;
  margin: 2rem auto 0;
  text-align: center;
  color: hsla(30, 15%, 96%, 0.4);
  font-size: 0.85rem;
}
</style>
