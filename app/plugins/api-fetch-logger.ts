export default defineNuxtPlugin((nuxtApp) => {
  // Intercept global $fetch during SSR to log API fetch failures & timeouts
  const originalFetch = globalThis.$fetch
  if (typeof originalFetch === 'function') {
    globalThis.$fetch = $fetch.create({
      onRequestError({ request, error }) {
        if (import.meta.server) {
          console.error(`[Nuxt SSR $fetch Request Error] Request to '${request}' failed: ${error?.message || error}`)
        }
      },
      onResponseError({ request, response }) {
        if (import.meta.server) {
          console.error(
            `[Nuxt SSR $fetch Response Error] Request to '${request}' failed with status ${response.status} (${response.statusText || 'Error'})`
          )
        }
      }
    })
  }

  // Hook into Nuxt SSR rendering errors
  nuxtApp.hook('app:error', (error: any) => {
    if (import.meta.server) {
      console.error(`[Nuxt SSR Page Error] ${error?.message || error}`)
    }
  })
})
