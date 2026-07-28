export function useTestimonialCard(props) {
  const btsImages = computed(() =>
    (props.testimonial.bts_photos || []).map((id) => ({ id, url: useDirectusAsset(id) }))
  )

  return {
    btsImages
  }
}
