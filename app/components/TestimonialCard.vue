<template>
  <article class="testimonial-card" v-reveal>
    <p class="quote-mark" aria-hidden="true">&ldquo;</p>
    <p class="feedback">{{ testimonial.feedback }}</p>
    <p class="client">
      <strong>{{ testimonial.client_name }}</strong>
      <span v-if="testimonial.company">, {{ testimonial.company }}</span>
    </p>

    <div v-if="btsImages.length" class="bts-photos">
      <div v-for="(image, index) in btsImages" :key="image.id" class="bts-photo">
        <img v-if="image.url" :src="image.url" :alt="`Behind the scenes photo ${index + 1}`" />
        <div v-else class="image-placeholder" aria-hidden="true" />
      </div>
    </div>
  </article>
</template>

<script setup>
import { useTestimonialCard } from '~/scripts/components/TestimonialCard.js'

const props = defineProps({
  testimonial: {
    type: Object,
    required: true
  }
})

const { btsImages } = useTestimonialCard(props)
</script>

<style scoped>
.testimonial-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 2rem 1.75rem 1.75rem;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.quote-mark {
  position: absolute;
  top: 0.5rem;
  left: 1.25rem;
  font-family: var(--font-heading);
  font-size: 3.5rem;
  color: var(--color-accent);
  opacity: 0.35;
  margin: 0;
  line-height: 1;
}

.feedback {
  position: relative;
  font-style: italic;
  color: var(--color-text);
  margin: 0.5rem 0 1.25rem;
}

.client {
  margin: 0 0 1.25rem;
  color: var(--color-text-muted);
}

.bts-photos {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bts-photo {
  width: 90px;
  height: 90px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.bts-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--transition-base);
}

.bts-photo:hover img {
  transform: scale(1.08);
}
</style>
