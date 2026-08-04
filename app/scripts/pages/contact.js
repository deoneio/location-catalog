export function useContactPage() {
  const config = useRuntimeConfig()

  const whatsappLink = `https://wa.me/${config.public.whatsappNumber}?text=${encodeURIComponent('Hi MinLoc! Aku mau tanya-tanya dulu bisa?')}`

  useSeoMeta({
    title: 'Contact Us',
    description: 'Get in touch with ShareLoc for location booking inquiries, partnerships, or support.',
    ogTitle: 'Contact Us - ShareLoc',
    ogDescription: 'Get in touch with ShareLoc for location booking inquiries, partnerships, or support.'
  })

  return {
    contactEmail: config.public.contactEmail,
    contactPhone: config.public.contactPhone,
    contactAddress: config.public.contactAddress,
    whatsappLink
  }
}
