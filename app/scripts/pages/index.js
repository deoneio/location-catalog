export function useIndexPage() {
  const { data: configResponse } = useFetch('/api/items/homepage_config')
  const { data: locationsResponse } = useFetch('/api/items/locations')

  const heroConfig = computed(() => configResponse.value?.data ?? null)
  const heroImageUrl = computed(() => useDirectusAsset(heroConfig.value?.hero_media))
  const heroTitle = computed(() => heroConfig.value?.hero_title || 'Find the Perfect Location for Your Next Shoot')
  const valueProposition = computed(() => heroConfig.value?.value_proposition || 'Premium spaces for photographers, videographers, and event planners.')

  const locations = computed(() => locationsResponse.value?.data ?? [])

  const featuredLocations = computed(() => locations.value.filter((location) => location.is_featured))

  const styleOptions = computed(() => {
    const styles = new Set(locations.value.map((location) => location.aesthetic_style).filter(Boolean))
    return Array.from(styles)
  })

  const searchStyle = ref('')
  const searchCapacity = ref(null)

  function submitSearch() {
    const query = {}
    if (searchStyle.value) query.style = searchStyle.value
    if (searchCapacity.value) query.capacity = searchCapacity.value

    return navigateTo({ path: '/catalog', query })
  }

  return {
    heroConfig,
    heroImageUrl,
    heroTitle,
    valueProposition,
    featuredLocations,
    styleOptions,
    searchStyle,
    searchCapacity,
    submitSearch
  }
}
