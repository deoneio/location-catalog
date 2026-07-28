export function useAppHeader() {
  const config = useRuntimeConfig()

  const siteName = config.public.siteName

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/catalog', label: 'Catalog' },
    { to: '/testimonials', label: 'Testimonials' },
    { to: '/contact', label: 'Contact' }
  ]

  const isMenuOpen = ref(false)
  const isScrolled = ref(false)

  const SCROLL_THRESHOLD = 80

  function updateScrolled() {
    isScrolled.value = window.scrollY > SCROLL_THRESHOLD
  }

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  function closeMenu() {
    isMenuOpen.value = false
  }

  onMounted(() => {
    updateScrolled()
    window.addEventListener('scroll', updateScrolled, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateScrolled)
  })

  return {
    siteName,
    navLinks,
    isMenuOpen,
    isScrolled,
    toggleMenu,
    closeMenu
  }
}
