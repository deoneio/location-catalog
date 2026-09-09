<template>
  <div v-if="videoId" class="location-video">
    <div class="location-video-head">
      <h2 class="location-video-title">Location Video</h2>
      <a :href="watchUrl" target="_blank" rel="noopener" class="location-video-link">
        Watch on YouTube <span aria-hidden="true">↗</span>
      </a>
    </div>

    <div v-if="playing" class="location-video-player">
      <iframe
        :src="embedUrl"
        title="Location video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      />
    </div>

    <button
      v-else
      type="button"
      class="location-video-poster"
      aria-label="Play location video"
      @click="play"
    >
      <img
        v-if="posterSrc"
        :src="posterSrc"
        alt=""
        loading="lazy"
        @error="onPosterError"
      />
      <span class="location-video-scrim" aria-hidden="true" />
      <span class="location-video-play" aria-hidden="true">
        <span class="location-video-play-icon" />
      </span>
      <span class="location-video-caption">Play video</span>
    </button>
  </div>
</template>

<script setup>
import { useLocationVideo } from '~/scripts/components/LocationVideo.js'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  // Resolved poster image URL (CMS-provided). Falls back to the YouTube
  // thumbnail when null.
  poster: {
    type: String,
    default: null
  }
})

const { videoId, embedUrl, watchUrl, posterSrc, onPosterError, playing, play } = useLocationVideo(props)
</script>

<style scoped>
.location-video {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.location-video-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.location-video-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.location-video-link {
  flex-shrink: 0;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.location-video-link:hover {
  color: var(--color-accent);
}

.location-video-player,
.location-video-poster {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #000;
}

.location-video-player {
  animation: location-video-fade 0.2s ease;
}

.location-video-player iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.location-video-poster {
  padding: 0;
  border: 0;
  cursor: pointer;
  transition: filter var(--transition-fast);
}

.location-video-poster:hover {
  filter: brightness(1.05);
}

.location-video-poster:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.location-video-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.location-video-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.42));
}

.location-video-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  /* ShareLoc logo red, so the video reads as part of the site, not YouTube. */
  background: #e83425;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast);
}

.location-video-poster:hover .location-video-play {
  transform: translate(-50%, -50%) scale(1.06);
}

.location-video-play-icon {
  width: 0;
  height: 0;
  margin-left: 6px;
  border-left: 21px solid #fff;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
}

.location-video-caption {
  position: absolute;
  left: 18px;
  bottom: 16px;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: #fff;
}

@keyframes location-video-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .location-video-player {
    animation: none;
  }

  .location-video-poster:hover .location-video-play {
    transform: translate(-50%, -50%);
  }
}
</style>
