<template>
  <div>
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
        <button
          v-if="galleryImages.length > 4"
          type="button"
          class="view-all-btn"
          @click="openGalleryGrid"
        >
          <svg class="grid-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" />
          </svg>
          View all photos ({{ galleryImages.length }})
        </button>
      </section>

      <section class="info" v-reveal>
        <h1>{{ location.name }}</h1>
        <div v-if="location.house_type?.length" class="house-type-pills">
          <span v-for="type in location.house_type" :key="type" class="house-type-pill">{{ type }}</span>
        </div>
        <p v-if="location.address" class="address">
          <svg class="pin-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 22s7-7.58 7-12A7 7 0 0 0 5 10c0 4.42 7 12 7 12Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            <circle cx="12" cy="10" r="2.25" stroke="currentColor" stroke-width="1.5" />
          </svg>
          {{ location.address }}
        </p>
        <div v-if="location.categories?.length" class="categories">
          <span v-for="category in location.categories" :key="category" class="category-pill">{{ category }}</span>
        </div>
        <div class="description" v-html="location.description" />

        <div class="details-grid">
          <div class="details-block">
            <h2>Highlight Spots</h2>
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

  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isGalleryModalOpen" class="gallery-modal" @click.self="closeGalleryModal">
        <button type="button" class="modal-close" aria-label="Close gallery" @click="closeGalleryModal">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>

        <div v-if="galleryViewMode === 'grid'" class="modal-grid" @click.self="closeGalleryModal">
          <button
            v-for="(image, index) in galleryImages"
            :key="image.id"
            type="button"
            class="modal-grid-item"
            @click="openGalleryFocused(index)"
          >
            <img v-if="image.url" :src="image.url" :alt="`${location.name} photo ${index + 1}`" />
            <div v-else class="image-placeholder" aria-hidden="true" />
          </button>
        </div>

        <div v-else class="modal-focused" @click.self="closeGalleryModal">
          <button type="button" class="modal-back" @click="galleryViewMode = 'grid'">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            All photos
          </button>

          <button
            v-if="galleryImages.length > 1"
            type="button"
            class="modal-nav modal-nav--prev"
            aria-label="Previous photo"
            @click="showPrevPhoto"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <Transition name="modal-crossfade" mode="out-in">
            <div class="modal-focused-image" :key="modalPhotoIndex">
              <img v-if="focusedImage?.url" :src="focusedImage.url" :alt="`${location.name} photo ${modalPhotoIndex + 1}`" />
              <div v-else class="image-placeholder" aria-hidden="true" />
            </div>
          </Transition>

          <button
            v-if="galleryImages.length > 1"
            type="button"
            class="modal-nav modal-nav--next"
            aria-label="Next photo"
            @click="showNextPhoto"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <p class="modal-counter">{{ modalPhotoIndex + 1 }} / {{ galleryImages.length }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
  </div>
</template>

<script setup>
import { useCatalogDetailPage } from '~/scripts/pages/catalog/[slug].js'

const {
  pending,
  location,
  galleryImages,
  activeImageIndex,
  activeImage,
  selectImage,
  isGalleryModalOpen,
  galleryViewMode,
  modalPhotoIndex,
  focusedImage,
  openGalleryGrid,
  openGalleryFocused,
  closeGalleryModal,
  showNextPhoto,
  showPrevPhoto,
  whatsappLink
} = useCatalogDetailPage()
</script>

<style scoped>
/* Mobile-first: gallery then info stack in document order, unchanged. */
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
  max-width: 100%;
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
  max-width: 100%;
  object-fit: cover;
}

.info {
  margin-top: 2.5rem;
}

.info h1 {
  font-size: 2rem;
}

@media (min-width: 1024px) {
  .detail-layout {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: var(--space-10);
    align-items: start;
  }

  .gallery {
    min-width: 0;
  }

  .info {
    margin-top: 0;
  }
}

.house-type-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.house-type-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.address {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.35rem;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.pin-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text);
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

.view-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.85rem;
  padding: 0;
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.view-all-btn:hover {
  color: var(--color-accent);
}

.grid-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.gallery-modal {
  position: fixed;
  /* Starts below the sticky site header (z-index: 40) instead of covering it,
     so header nav stays clickable and legible while the modal is open. */
  top: 5rem;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: hsla(25, 15%, 8%, 0.9);
}

.modal-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: hsla(36, 30%, 97%, 0.15);
  color: hsl(36, 30%, 97%);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.modal-close:hover {
  background: hsla(36, 30%, 97%, 0.28);
}

.modal-close svg {
  width: 18px;
  height: 18px;
}

.modal-grid {
  width: 100%;
  max-width: 1100px;
  max-height: 100%;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  padding: 0.5rem;
}

.modal-grid-item {
  aspect-ratio: 4 / 3;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.modal-grid-item:hover {
  opacity: 1;
  transform: scale(1.02);
}

.modal-grid-item img,
.modal-grid-item .image-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-focused {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.modal-back {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  z-index: 101;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 999px;
  background: hsla(36, 30%, 97%, 0.15);
  color: hsl(36, 30%, 97%);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.modal-back:hover {
  background: hsla(36, 30%, 97%, 0.28);
}

.modal-back svg {
  width: 16px;
  height: 16px;
}

.modal-focused-image {
  max-width: min(85vw, 1100px);
  max-height: 80vh;
}

.modal-focused-image img,
.modal-focused-image .image-placeholder {
  max-width: 100%;
  max-height: 80vh;
  border-radius: var(--radius-sm);
  object-fit: contain;
  box-shadow: var(--shadow-lg);
}

.modal-focused-image .image-placeholder {
  width: 60vw;
  height: 60vh;
}

.modal-nav {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: hsla(36, 30%, 97%, 0.15);
  color: hsl(36, 30%, 97%);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.modal-nav:hover {
  background: hsla(36, 30%, 97%, 0.28);
}

.modal-nav svg {
  width: 22px;
  height: 22px;
}

.modal-counter {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: hsla(36, 30%, 97%, 0.15);
  color: hsl(36, 30%, 97%);
  font-family: var(--font-body);
  font-size: var(--text-sm);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity var(--transition-base);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-crossfade-enter-active,
.modal-crossfade-leave-active {
  transition: opacity var(--transition-fast);
}

.modal-crossfade-enter-from,
.modal-crossfade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .gallery-modal {
    padding: 1rem;
  }

  .modal-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.6rem;
  }

  .modal-focused {
    gap: 0.4rem;
  }

  .modal-nav {
    width: 56px;
    height: 56px;
  }

  .modal-back {
    top: 0.75rem;
    left: 0.75rem;
  }

  .modal-close {
    top: 0.75rem;
    right: 0.75rem;
  }
}
</style>
