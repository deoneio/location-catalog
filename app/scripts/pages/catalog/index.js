export function useCatalogPage() {
  const route = useRoute()
  const { data: locationsResponse, pending } = useFetch('/api/items/locations')

  const locations = computed(() => locationsResponse.value?.data ?? [])

  const categoryOptions = computed(() => {
    const categories = new Set(locations.value.flatMap((location) => location.categories || []))
    return Array.from(categories)
  })

  const houseTypeOptions = computed(() => {
    const houseTypes = new Set(locations.value.flatMap((location) => location.house_type || []))
    return Array.from(houseTypes)
  })

  const cityOptions = computed(() => {
    const cities = new Set(locations.value.map((location) => location.city).filter(Boolean))
    return Array.from(cities)
  })

  const initialCategories = route.query.categories
    ? Array.isArray(route.query.categories)
      ? route.query.categories
      : [route.query.categories]
    : []
  const initialHouseTypes = route.query.house_type
    ? Array.isArray(route.query.house_type)
      ? route.query.house_type
      : [route.query.house_type]
    : []
  const initialCity = Array.isArray(route.query.city) ? route.query.city[0] : route.query.city

  const selectedCategories = ref(initialCategories)
  const selectedHouseTypes = ref(initialHouseTypes)
  const selectedCity = ref(initialCity || '')

  function toggleCategory(category) {
    selectedCategories.value = selectedCategories.value.includes(category)
      ? selectedCategories.value.filter((c) => c !== category)
      : [...selectedCategories.value, category]
  }

  function toggleHouseType(houseType) {
    selectedHouseTypes.value = selectedHouseTypes.value.includes(houseType)
      ? selectedHouseTypes.value.filter((h) => h !== houseType)
      : [...selectedHouseTypes.value, houseType]
  }

  const filteredLocations = computed(() =>
    locations.value.filter((location) => {
      const matchesCategories = selectedCategories.value.every((category) =>
        (location.categories || []).includes(category)
      )
      const matchesHouseTypes = selectedHouseTypes.value.every((houseType) =>
        (location.house_type || []).includes(houseType)
      )
      const matchesCity = !selectedCity.value || location.city === selectedCity.value
      return matchesCategories && matchesHouseTypes && matchesCity
    })
  )

  function resetFilters() {
    selectedCategories.value = []
    selectedHouseTypes.value = []
    selectedCity.value = ''
  }

  return {
    pending,
    categoryOptions,
    selectedCategories,
    toggleCategory,
    houseTypeOptions,
    selectedHouseTypes,
    toggleHouseType,
    cityOptions,
    selectedCity,
    filteredLocations,
    resetFilters
  }
}
