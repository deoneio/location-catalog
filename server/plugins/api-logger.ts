export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    event.context._startTime = Date.now()
  })

  nitroApp.hooks.hook('beforeResponse', (event) => {
    const path = event.path || ''
    if (path.startsWith('/api/')) {
      const statusCode = event.node.res.statusCode
      const duration = event.context._startTime ? `${Date.now() - event.context._startTime}ms` : ''

      if (statusCode >= 400) {
        const directusUrl = process.env.DIRECTUS_URL || 'http://10.169.6.124:8055'
        const targetUrl = `${directusUrl}${path.replace(/^\/api/, '')}`
        console.error(
          `[Nuxt Server API Error] ${event.method || 'GET'} ${path} -> Target: ${targetUrl} | Status: ${statusCode} | Duration: ${duration}`
        )
      }
    }
  })

  nitroApp.hooks.hook('error', (error: any, { event }) => {
    if (event && event.path && event.path.startsWith('/api/')) {
      const duration = event.context?._startTime ? `${Date.now() - event.context._startTime}ms` : ''
      const directusUrl = process.env.DIRECTUS_URL || 'http://10.169.6.124:8055'
      const targetUrl = `${directusUrl}${event.path.replace(/^\/api/, '')}`

      const isTimeout = error.message?.includes('timeout') || error.code === 'ETIMEDOUT' || error.name === 'TimeoutError'
      const isRefused = error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')

      let reason = error.message || 'Unknown Server Error'
      if (isTimeout) reason = `Timeout contacting backend at ${targetUrl}`
      if (isRefused) reason = `Connection refused - backend server unreachable at ${targetUrl}`

      console.error(
        `[Nuxt Server API Failure] ${event.method || 'GET'} ${event.path} -> Target: ${targetUrl} | Error: ${reason} | Code: ${error.code || 'N/A'} | Duration: ${duration}`
      )
    }
  })
})
