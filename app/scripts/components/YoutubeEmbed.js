const YOUTUBE_ID_PATTERN = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/

export function useYoutubeEmbed(props) {
  const videoId = computed(() => props.url?.match(YOUTUBE_ID_PATTERN)?.[1] ?? null)
  const embedUrl = computed(() => (videoId.value ? `https://www.youtube.com/embed/${videoId.value}` : null))

  return {
    embedUrl
  }
}
