const YOUTUBE_ID_PATTERN = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/

/**
 * Pull the 11-character video id out of any common YouTube URL shape
 * (watch, youtu.be, embed, shorts). Returns null when nothing matches.
 */
export function extractYoutubeId(url) {
  return url?.match(YOUTUBE_ID_PATTERN)?.[1] ?? null
}
