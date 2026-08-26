declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void // called with real args; internally forwards `arguments`, not a spread array
  }
}

function trackedTextOf(el: HTMLElement): string {
  return (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100)
}

export default defineNuxtPlugin((nuxtApp) => {
  const { public: { gaMeasurementId } } = useRuntimeConfig()

  if (!import.meta.env.PROD || !gaMeasurementId) return

  window.dataLayer = window.dataLayer || []
  // Must push the raw `arguments` object here, matching Google's own gtag.js
  // snippet exactly. Spreading it into a real array first (`...args`) looks
  // equivalent but silently breaks gtag.js's internal command processing —
  // it queues fine locally but never actually dispatches anything to GA4.
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  // The GA4 property also has Consent Mode configured; without an explicit
  // default, Google's tags fall back to an unconsented "cookieless ping"
  // that GA4 only partially models. This site has no cookie-consent banner
  // and only needs analytics, so grant it outright.
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted'
  })
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
