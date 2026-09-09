import { extractYoutubeId } from '~/scripts/utils/youtube.js'

export function useYoutubeEmbed(props) {
  const videoId = computed(() => extractYoutubeId(props.url))
  const embedUrl = computed(() => (videoId.value ? `https://www.youtube.com/embed/${videoId.value}` : null))

  return {
    embedUrl
  }
}
