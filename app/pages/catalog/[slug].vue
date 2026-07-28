<template>
  <div class="detail-page page-container">
    <p v-if="pending">Loading location&hellip;</p>

    <div v-else-if="location" class="detail-layout">
      <section class="gallery" v-reveal>
        <div class="gallery-main">
          <img v-if="activeImage?.url" :src="activeImage.url" :alt="location.name" />
          <div v-else class="image-placeholder" aria-hidden="true" />
        </div>
        <div v-if="galleryImages.length > 1" class="gallery-thumbs">
          <button
            v-for="(image, index) in galleryImages"
            :key="image.id"
            type="button"
            class="gallery-thumb"
            :class="{ 'gallery-thumb--active': index === activeImageIndex }"
            @click="selectImage(index)"
          >
            <img v-if="image.url" :src="image.url" :alt="`${location.name} photo ${index + 1}`" />
            <div v-else class="image-placeholder" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section class="info" v-reveal>
        <h1>{{ location.name }}</h1>
        <p class="meta">{{ location.aesthetic_style }} &middot; Up to {{ location.capacity }} people</p>
        <div class="description" v-html="location.description" />

        <div class="details-grid">
          <div class="details-block">
            <h2>Key Features</h2>
            <div v-html="location.key_features" />
          </div>
          <div class="details-block">
            <h2>Rules &amp; Restrictions</h2>
            <div v-html="location.rules_restrictions" />
          </div>
        </div>

        <a :href="whatsappLink" target="_blank" rel="noopener" class="btn btn-whatsapp inquire-cta">
          Inquire About This Location
        </a>
      </section>
    </div>

    <p v-else class="empty-state">Location not found.</p>
  </div>
</template>

<script setup>
import { useCatalogDetailPage } from '~/scripts/pages/catalog/[slug].js'

const { pending, location, galleryImages, activeImageIndex, activeImage, selectImage, whatsappLink } =
  useCatalogDetailPage()
</script>

<style scoped>
/* Mobile-first: gallery then info stack in document order, unchanged. */
@media (min-width: 1024px) {
  .detail-layout {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: var(--space-10);
    align-items: start;
  }

  .gallery {
    /* Clears the sticky site header (~4rem tall) while pinned. */
    position: sticky;
    top: 5rem;
  }

  .info {
    margin-top: 0;
  }
}

.gallery-main {
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.gallery-main img,
.gallery-main .image-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity var(--transition-base);
}

.gallery-thumbs {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.gallery-thumb {
  width: 84px;
  height: 64px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  overflow: hidden;
  opacity: 0.6;
  transition: opacity var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
}

.gallery-thumb:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.gallery-thumb--active {
  border-color: var(--color-accent);
  opacity: 1;
  box-shadow: var(--shadow-sm);
}

.gallery-thumb img,
.gallery-thumb .image-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  margin-top: 2.5rem;
}

.info h1 {
  font-size: 2rem;
}

.meta {
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}

.description {
  margin-top: 1rem;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin: 2rem 0;
}

.details-block {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.details-block h2 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.inquire-cta {
  margin-top: 1rem;
}
</style>
