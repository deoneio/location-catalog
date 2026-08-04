export function useAppFooter() {
  const config = useRuntimeConfig()

  const siteName = config.public.siteName
  const contactEmail = config.public.contactEmail
  const contactPhone = config.public.contactPhone
  const whatsappLink = `https://wa.me/${config.public.whatsappNumber}?text=${encodeURIComponent('Hi MinLoc! Aku mau tanya-tanya dulu bisa?')}`
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/catalog', label: 'Catalog' },
    { to: '/testimonials', label: 'Testimonials' },
    { to: '/contact', label: 'Contact' }
  ]

  return {
    siteName,
    contactEmail,
    contactPhone,
    whatsappLink,
    currentYear,
    navLinks
  }
}
