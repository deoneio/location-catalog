import { proxyRequest, defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const useMock = config.public.useMock || process.env.USE_MOCK === 'true'

  // If USE_MOCK is true, let file-based mock handlers in server/api/ handle the request
  if (useMock) {
    return
  }

  // DYNAMIC RUNTIME PROXY: Evaluated on every request using container environment variables
  const directusUrl = process.env.DIRECTUS_URL || config.public.directusUrl || 'http://directus:8055'
  const targetPath = event.path.replace(/^\/api/, '')
  const targetUrl = `${directusUrl}${targetPath}`

  return proxyRequest(event, targetUrl)
})
