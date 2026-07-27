<template>
  <div class="testimonials-page page-container">
    <h1 v-reveal>Testimonials</h1>

    <p v-if="pending">Loading testimonials&hellip;</p>
    <div v-else class="testimonials-grid">
      <TestimonialCard v-for="testimonial in testimonials" :key="testimonial.id" :testimonial="testimonial" />
    </div>
    <p v-if="!pending && !testimonials.length" class="empty-state">No testimonials yet.</p>
  </div>
</template>

<script setup>
import { useTestimonialsPage } from '~/scripts/pages/testimonials.js'

const { pending, testimonials } = useTestimonialsPage()
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}
</style>
