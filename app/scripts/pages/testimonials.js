export function useTestimonialsPage() {
  const { data: response, pending } = useFetch('/api/items/testimonials')

  const testimonials = computed(() => response.value?.data ?? [])

  useSeoMeta({
    title: 'Client Testimonials',
    description: 'Read reviews and success stories from creators, photographers, and event planners using ShareLoc.',
    ogTitle: 'Client Testimonials - ShareLoc',
    ogDescription: 'Read reviews and success stories from creators, photographers, and event planners using ShareLoc.'
  })

  return {
    pending,
    testimonials
  }
}
