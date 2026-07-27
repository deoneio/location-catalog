<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-media">
        <img v-if="heroImageUrl" :src="heroImageUrl" alt="" />
        <div v-else class="image-placeholder" aria-hidden="true" />
        <div class="hero-overlay" />
      </div>
      <div class="hero-content" v-reveal>
        <h1>Find the Perfect Location for Your Next Shoot</h1>
        <p>Premium spaces for photographers, videographers, and event planners.</p>

        <form class="hero-search" @submit.prevent="submitSearch">
          <label>
            Style
            <select v-model="searchStyle">
              <option value="">All styles</option>
              <option v-for="style in styleOptions" :key="style" :value="style">{{ style }}</option>
            </select>
          </label>

          <label>
            Minimum capacity
            <input v-model.number="searchCapacity" type="number" min="0" placeholder="Any" />
          </label>

          <button type="submit" class="btn btn-accent hero-search-submit">Search Locations</button>
        </form>

        <NuxtLink to="/catalog" class="btn btn-accent hero-cta">
          {{ heroConfig?.hero_cta_text || 'Browse the Catalog' }}
        </NuxtLink>
      </div>
    </section>

    <section class="featured page-container">
      <h2 v-reveal>Featured Locations</h2>
      <div class="featured-grid">
        <LocationCard v-for="location in featuredLocations" :key="location.id" :location="location" />
      </div>
      <p v-if="!featuredLocations.length" class="empty-state">No featured locations yet.</p>
    </section>

    <section v-if="heroConfig?.value_proposition" class="value-proposition page-container">
      <div class="value-proposition-panel glass-panel" v-reveal>
        <h2>Why Choose Us</h2>
        <div v-html="heroConfig.value_proposition" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { useIndexPage } from '~/scripts/pages/index.js'

const { heroConfig, heroImageUrl, featuredLocations, styleOptions, searchStyle, searchCapacity, submitSearch } =
  useIndexPage()
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-media {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hero-media img,
.hero-media .image-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-media .image-placeholder {
  background: repeating-linear-gradient(
    45deg,
    hsl(36, 25%, 93%),
    hsl(36, 25%, 93%) 10px,
    hsl(36, 25%, 96%) 10px,
    hsl(36, 25%, 96%) 20px
  );
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, hsla(25, 20%, 10%, 0.35) 0%, hsla(25, 20%, 10%, 0.5) 100%);
}

.hero-content {
  position: relative;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  color: hsla(30, 20%, 97%, 0.95);
}

.hero-content h1 {
  font-family: var(--font-heading);
  font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl));
  letter-spacing: 0.02em;
  color: hsla(30, 25%, 98%, 1);
}

.hero-content p {
  font-family: var(--font-body);
  color: hsla(30, 15%, 96%, 0.85);
  font-size: 1.1rem;
  margin: 1rem 0 0;
}

.hero-search {
  display: flex;
  align-items: stretch;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4);
  margin: var(--space-8) 0 var(--space-6);
}

.hero-search > *:not(:last-child) {
  border-right: 1px solid var(--color-border);
}

.hero-search label {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-1);
  padding: 0 var(--space-5);
  font-family: var(--font-body);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.hero-search select,
.hero-search input {
  width: 100%;
  border: 1px solid var(--color-border);
  background: transparent;
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.hero-search select:focus,
.hero-search input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 25%, transparent);
}

.hero-search-submit {
  margin-left: var(--space-5);
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}

@media (max-width: 640px) {
  .hero-search {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-search > *:not(:last-child) {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }

  .hero-search label {
    padding: var(--space-3) 0;
  }

  .hero-search-submit {
    margin-left: 0;
    margin-top: var(--space-3);
    width: 100%;
    justify-content: center;
  }
}

.hero-cta {
  margin-top: var(--space-4);
}

.featured h2 {
  font-size: 1.75rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.value-proposition-panel {
  padding: 2.5rem;
}

.value-proposition-panel h2 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}
</style>
