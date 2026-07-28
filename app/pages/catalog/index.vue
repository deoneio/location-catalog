<template>
  <div class="catalog-page page-container">
    <h1 v-reveal>Catalog</h1>

    <form class="filters glass-panel" @submit.prevent>
      <label>
        <span>Style</span>
        <select v-model="selectedStyle">
          <option value="">All styles</option>
          <option v-for="style in styleOptions" :key="style" :value="style">{{ style }}</option>
        </select>
      </label>

      <label>
        <span>Minimum capacity</span>
        <input v-model.number="minCapacity" type="number" min="0" placeholder="Any" />
      </label>

      <button type="button" class="reset-btn" @click="resetFilters">Reset</button>
    </form>

    <p v-if="pending">Loading locations&hellip;</p>
    <div v-else class="catalog-grid">
      <LocationCard v-for="location in filteredLocations" :key="location.id" :location="location" />
    </div>
    <p v-if="!pending && !filteredLocations.length" class="empty-state">No locations match these filters.</p>
  </div>
</template>

<script setup>
import { useCatalogPage } from '~/scripts/pages/catalog.js'

const { pending, styleOptions, selectedStyle, minCapacity, filteredLocations, resetFilters } = useCatalogPage()
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filters label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.filters select,
.filters input {
  padding: 0.6rem 0.85rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font: inherit;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.filters select:focus,
.filters input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px hsla(32, 85%, 55%, 0.25);
}

.reset-btn {
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.reset-btn:hover {
  color: var(--color-text);
  border-color: var(--color-text-muted);
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
</style>
