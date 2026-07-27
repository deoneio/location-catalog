export function useContactPage() {
  const config = useRuntimeConfig()

  const whatsappLink = `https://wa.me/${config.public.whatsappNumber}?text=${encodeURIComponent('Hi, I would like to inquire about a location.')}`

  return {
    contactEmail: config.public.contactEmail,
    contactPhone: config.public.contactPhone,
    contactAddress: config.public.contactAddress,
    whatsappLink
  }
}
