export function useCatalogDetailPage() {
  const route = useRoute()
  const config = useRuntimeConfig()

  const { data: response, pending } = useFetch('/api/items/locations', {
    query: { 'filter[slug][_eq]': route.params.slug }
  })

  const location = computed(() => response.value?.data?.[0] ?? null)

  const galleryImages = computed(() => {
    if (!location.value) return []
    const ids = [location.value.thumbnail, ...(location.value.gallery || [])].filter(Boolean)
    return ids.map((id) => ({ id, url: useDirectusAsset(id) }))
  })

  const activeImageIndex = ref(0)
  const activeImage = computed(() => galleryImages.value[activeImageIndex.value] ?? null)

  function selectImage(index) {
    activeImageIndex.value = index
  }

  const whatsappLink = computed(() => {
    if (!location.value) return '#'
    const message = `Hi, I'm interested in inquiring about "${location.value.name}". Is it available?`
    return `https://wa.me/${config.public.whatsappNumber}?text=${encodeURIComponent(message)}`
  })

  return {
    pending,
    location,
    galleryImages,
    activeImageIndex,
    activeImage,
    selectImage,
    whatsappLink
  }
}
