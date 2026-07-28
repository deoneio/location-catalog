export function useDirectusAsset(fileId) {
  if (!fileId || typeof fileId !== 'string' || fileId.startsWith('mock-image-id')) {
    return null
  }

  if (fileId.startsWith('/') || fileId.startsWith('http://') || fileId.startsWith('https://')) {
    return fileId
  }

  const config = useRuntimeConfig()
  return `${config.public.directusUrl}/assets/${fileId}`
}
