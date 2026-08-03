<template>
  <div v-if="embedUrl" class="youtube-embed">
    <iframe
      :src="embedUrl"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />
  </div>
</template>

<script setup>
import { useYoutubeEmbed } from '~/scripts/components/YoutubeEmbed.js'

const props = defineProps({
  url: {
    type: String,
    default: null
  }
})

const { embedUrl } = useYoutubeEmbed(props)
</script>

<style scoped>
.youtube-embed {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: hsla(25, 20%, 10%, 0.08);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.youtube-embed iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
