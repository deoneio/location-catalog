export function useTestimonialsPage() {
  const { data: response, pending } = useFetch('/api/items/testimonials')

  const testimonials = computed(() => response.value?.data ?? [])

  return {
    pending,
    testimonials
  }
}
