import { extractYoutubeId } from '~/scripts/utils/youtube.js'

export function useLocationVideo(props) {
  const videoId = computed(() => extractYoutubeId(props.url))

  // Privacy-enhanced host, and autoplay so the video starts the moment the
  // poster is clicked rather than needing a second press inside the iframe.
  const embedUrl = computed(() =>
    videoId.value
      ? `https://www.youtube-nocookie.com/embed/${videoId.value}?rel=0&autoplay=1`
      : null
  )

  // Canonical watch URL for the "Watch on YouTube" link, so shorts/embed
  // inputs still resolve to a normal video page.
  const watchUrl = computed(() =>
    videoId.value ? `https://www.youtube.com/watch?v=${videoId.value}` : props.url
  )

  // CMS-provided poster wins; otherwise fall back to YouTube's own thumbnail,
  // starting from the highest resolution and stepping down on load error.
  const YT_THUMB_SIZES = ['maxresdefault', 'hqdefault']
  const thumbSizeIndex = ref(0)

  const posterSrc = computed(() => {
    if (props.poster) return props.poster
    if (!videoId.value) return null
    return `https://i.ytimg.com/vi/${videoId.value}/${YT_THUMB_SIZES[thumbSizeIndex.value]}.jpg`
  })

  function onPosterError() {
    if (props.poster) return
    if (thumbSizeIndex.value < YT_THUMB_SIZES.length - 1) {
      thumbSizeIndex.value += 1
    }
  }

  const playing = ref(false)

  function play() {
    playing.value = true
  }

  return {
    videoId,
    embedUrl,
    watchUrl,
    posterSrc,
    onPosterError,
    playing,
    play
  }
}
