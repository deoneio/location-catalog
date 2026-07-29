import { proxyRequest, defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const directusUrl = process.env.DIRECTUS_URL || config.public.directusUrl || 'http://directus:8055'
  const targetUrl = `${directusUrl}${event.path}`

  return proxyRequest(event, targetUrl)
})
