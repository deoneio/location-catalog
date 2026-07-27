<template>
  <NuxtLink :to="`/catalog/${location.slug}`" class="location-card" v-reveal>
    <div class="location-card-image">
      <img v-if="thumbnailUrl" :src="thumbnailUrl" :alt="location.name" />
      <div v-else class="image-placeholder" aria-hidden="true" />
    </div>
    <div class="location-card-body">
      <h3>{{ location.name }}</h3>
      <p class="location-card-meta">{{ location.aesthetic_style }} &middot; Up to {{ location.capacity }} people</p>
    </div>
  </NuxtLink>
</template>

<script setup>
import { useLocationCard } from '~/scripts/components/LocationCard.js'

const props = defineProps({
  location: {
    type: Object,
    required: true
  }
})

const { thumbnailUrl } = useLocationCard(props)
</script>

<style scoped>
.location-card {
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.location-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
}

.location-card-image {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.location-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--transition-base);
}

.location-card:hover .location-card-image img {
  transform: scale(1.06);
}

.location-card-body {
  padding: 1.25rem;
}

.location-card-body h3 {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
}

.location-card-meta {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}
</style>
