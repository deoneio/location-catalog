export function useCatalogDetailPage() {
  const route = useRoute()
  const config = useRuntimeConfig()

  const { data: response, pending } = useFetch('/api/items/locations', {
    query: {
      'filter[slug][_eq]': route.params.slug,
      fields: '*,gallery.directus_files_id.id,gallery.directus_files_id.filename_download'
    }
  })

  const location = computed(() => response.value?.data?.[0] ?? null)

  const galleryImages = computed(() => {
    if (!location.value) return []
    const rawGallery = location.value.gallery || []
    const galleryIds = rawGallery
      .map((item) => {
        if (typeof item === 'string') return item
        if (item?.directus_files_id) {
          return typeof item.directus_files_id === 'string'
            ? item.directus_files_id
            : item.directus_files_id.id
        }
        return item?.id || null
      })
      .filter(Boolean)

    const ids = [location.value.thumbnail, ...galleryIds].filter(Boolean)
    return ids.map((id) => ({ id, url: useDirectusAsset(id) }))
  })

  const activeImageIndex = ref(0)
  const activeImage = computed(() => galleryImages.value[activeImageIndex.value] ?? null)

  function selectImage(index) {
    activeImageIndex.value = index
  }

  const isGalleryModalOpen = ref(false)
  const galleryViewMode = ref('grid')
  const modalPhotoIndex = ref(0)
  const focusedImage = computed(() => galleryImages.value[modalPhotoIndex.value] ?? null)

  function openGalleryGrid() {
    galleryViewMode.value = 'grid'
    isGalleryModalOpen.value = true
  }

  function openGalleryFocused(index) {
    modalPhotoIndex.value = index
    galleryViewMode.value = 'focused'
  }

  function closeGalleryModal() {
    isGalleryModalOpen.value = false
  }

  function showNextPhoto() {
    const total = galleryImages.value.length
    if (!total) return
    modalPhotoIndex.value = (modalPhotoIndex.value + 1) % total
  }

  function showPrevPhoto() {
    const total = galleryImages.value.length
    if (!total) return
    modalPhotoIndex.value = (modalPhotoIndex.value - 1 + total) % total
  }

  function handleGalleryKeydown(event) {
    if (!isGalleryModalOpen.value) return
    if (event.key === 'Escape') closeGalleryModal()
    if (galleryViewMode.value === 'focused') {
      if (event.key === 'ArrowRight') showNextPhoto()
      if (event.key === 'ArrowLeft') showPrevPhoto()
    }
  }

  onMounted(() => window.addEventListener('keydown', handleGalleryKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleGalleryKeydown))

  watch(isGalleryModalOpen, (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  })

  // Route away entirely (e.g. Home) or swap to a different location's slug
  // while the modal is open — either way it shouldn't stay open with stale state.
  onBeforeRouteLeave(() => closeGalleryModal())
  onBeforeRouteUpdate(() => closeGalleryModal())

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
    isGalleryModalOpen,
    galleryViewMode,
    modalPhotoIndex,
    focusedImage,
    openGalleryGrid,
    openGalleryFocused,
    closeGalleryModal,
    showNextPhoto,
    showPrevPhoto,
    whatsappLink
  }
}
