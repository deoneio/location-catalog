<template>
  <article class="testimonial-card" v-reveal>
    <YoutubeEmbed :url="testimonial.youtube_url" />
    <p class="client">
      <strong>{{ testimonial.client_name }}</strong>
      <span v-if="testimonial.company">, {{ testimonial.company }}</span>
    </p>
  </article>
</template>

<script setup>
defineProps({
  testimonial: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.testimonial-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem 1.75rem 1.75rem;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.client {
  margin: 1.25rem 0;
  color: var(--color-text-muted);
}
</style>
