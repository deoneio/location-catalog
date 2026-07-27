export function useCatalogPage() {
  const route = useRoute()
  const { data: locationsResponse, pending } = useFetch('/api/items/locations')

  const locations = computed(() => locationsResponse.value?.data ?? [])

  const styleOptions = computed(() => {
    const styles = new Set(locations.value.map((location) => location.aesthetic_style).filter(Boolean))
    return Array.from(styles)
  })

  const initialStyle = Array.isArray(route.query.style) ? route.query.style[0] : route.query.style
  const initialCapacity = Array.isArray(route.query.capacity) ? route.query.capacity[0] : route.query.capacity

  const selectedStyle = ref(initialStyle || '')
  const minCapacity = ref(initialCapacity ? Number(initialCapacity) : null)

  const filteredLocations = computed(() =>
    locations.value.filter((location) => {
      const matchesStyle = !selectedStyle.value || location.aesthetic_style === selectedStyle.value
      const matchesCapacity = !minCapacity.value || location.capacity >= Number(minCapacity.value)
      return matchesStyle && matchesCapacity
    })
  )

  function resetFilters() {
    selectedStyle.value = ''
    minCapacity.value = null
  }

  return {
    pending,
    styleOptions,
    selectedStyle,
    minCapacity,
    filteredLocations,
    resetFilters
  }
}
