export function useIndexPage() {
  const { data: configResponse } = useFetch('/api/items/homepage_config')
  const { data: locationsResponse } = useFetch('/api/items/locations')

  const heroConfig = computed(() => configResponse.value?.data ?? null)
  const heroImageUrl = computed(() => useDirectusAsset(heroConfig.value?.hero_media))
  const heroTitle = computed(() => heroConfig.value?.hero_title || 'Find the Perfect Location for Your Next Shoot')
  const valueProposition = computed(() => heroConfig.value?.value_proposition || 'Premium spaces for photographers, videographers, and event planners.')

  const locations = computed(() => locationsResponse.value?.data ?? [])

  const featuredLocations = computed(() => locations.value.filter((location) => location.is_featured))

  const categoryOptions = computed(() => {
    const categories = new Set(locations.value.flatMap((location) => location.categories || []))
    return Array.from(categories)
  })

  const searchCategories = ref([])

  function toggleSearchCategory(category) {
    searchCategories.value = searchCategories.value.includes(category)
      ? searchCategories.value.filter((c) => c !== category)
      : [...searchCategories.value, category]
  }

  const houseTypeOptions = computed(() => {
    const houseTypes = new Set(locations.value.flatMap((location) => location.house_type || []))
    return Array.from(houseTypes)
  })

  const searchHouseTypes = ref([])

  function toggleSearchHouseType(houseType) {
    searchHouseTypes.value = searchHouseTypes.value.includes(houseType)
      ? searchHouseTypes.value.filter((h) => h !== houseType)
      : [...searchHouseTypes.value, houseType]
  }

  const cityOptions = computed(() => {
    const cities = new Set(locations.value.map((location) => location.city).filter(Boolean))
    return Array.from(cities)
  })

  const searchCity = ref('')

  function submitSearch() {
    const query = {}
    if (searchCategories.value.length) query.categories = searchCategories.value
    if (searchHouseTypes.value.length) query.house_type = searchHouseTypes.value
    if (searchCity.value) query.city = searchCity.value

    return navigateTo({ path: '/catalog', query })
  }

  return {
    heroConfig,
    heroImageUrl,
    heroTitle,
    valueProposition,
    featuredLocations,
    categoryOptions,
    searchCategories,
    toggleSearchCategory,
    houseTypeOptions,
    searchHouseTypes,
    toggleSearchHouseType,
    cityOptions,
    searchCity,
    submitSearch
  }
}
