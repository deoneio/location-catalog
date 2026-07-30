<template>
  <NuxtLink :to="`/catalog/${location.slug}`" class="location-card" v-reveal>
    <div class="location-card-image">
      <img v-if="thumbnailUrl" :src="thumbnailUrl" :alt="location.name" />
      <div v-else class="image-placeholder" aria-hidden="true" />
    </div>
    <div class="location-card-body">
      <h3>{{ location.name }}</h3>
      <div v-if="location.house_type?.length" class="location-card-house-types">
        <span
          v-for="type in location.house_type.slice(0, 2)"
          :key="type"
          class="location-card-house-type-pill"
        >
          {{ type }}
        </span>
      </div>
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

.location-card-house-types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.location-card-house-type-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
