export function useDirectusAsset(fileId) {
  if (!fileId || typeof fileId !== 'string' || fileId.startsWith('mock-image-id')) {
    return null
  }

  const config = useRuntimeConfig()
  return `${config.public.directusUrl}/assets/${fileId}`
}
