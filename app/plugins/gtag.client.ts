declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

function trackedTextOf(el: HTMLElement): string {
  return (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100)
}

export default defineNuxtPlugin((nuxtApp) => {
  const { public: { gaMeasurementId } } = useRuntimeConfig()

  if (!import.meta.env.PROD || !gaMeasurementId) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', gaMeasurementId, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`
  document.head.appendChild(script)

  const router = useRouter()
  router.afterEach((to) => {
    // Nuxt/unhead commits the new page's <title> after afterEach runs, so
    // reading document.title here would send the previous page's title.
    nextTick(() => {
      window.gtag('event', 'page_view', {
        page_path: to.fullPath,
        page_title: document.title
      })
    })
  })

  document.addEventListener(
    'click',
    (event) => {
      const target = (event.target as HTMLElement)?.closest('a, button')
      if (!target) return

      window.gtag('event', 'click', {
        element_tag: target.tagName.toLowerCase(),
        element_text: trackedTextOf(target as HTMLElement),
        element_href: target instanceof HTMLAnchorElement ? target.href : undefined,
        track_id: target.closest('[data-track-id]')?.getAttribute('data-track-id') || undefined
      })
    },
    { capture: true }
  )
})
