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

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  function closeMenu() {
    isMenuOpen.value = false
  }

  return {
    siteName,
    navLinks,
    isMenuOpen,
    toggleMenu,
    closeMenu
  }
}
