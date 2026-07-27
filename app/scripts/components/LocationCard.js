export function useLocationCard(props) {
  const thumbnailUrl = computed(() => useDirectusAsset(props.location.thumbnail))

  return {
    thumbnailUrl
  }
}
