<template>
  <router-link
    :to="{ name: 'MovieDetails', params: { id: movie.id } }"
    class="movie-card"
    :class="{ 'card-compact': compact }"
  >
    <!-- Poster -->
    <div class="card-poster">
      <img
        :src="movie.poster"
        :alt="movie.title"
        loading="lazy"
        @error="handleImageError"
      />
      <div class="poster-gradient"></div>

      <!-- Rating Badge -->
      <div class="card-rating">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        {{ movie.rating }}
      </div>

      <!-- Status badge -->
      <div v-if="movie.status === 'coming_soon'" class="card-status">
        Coming Soon
      </div>

      <!-- Hover overlay -->
      <div class="card-hover-overlay">
        <div class="hover-play-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <span class="hover-label">View Details</span>
      </div>
    </div>

    <!-- Card Info -->
    <div class="card-info">
      <h3 class="card-title">{{ movie.title }}</h3>

      <!-- Genre Tags — clickable -->
      <div class="card-genres">
        <router-link
          v-for="genre in displayGenres"
          :key="genre"
          :to="{ path: '/movies', query: { genre } }"
          class="genre-tag"
          @click.stop
        >{{ genre }}</router-link>
      </div>

      <!-- Meta -->
      <div class="card-meta">
        <span class="meta-lang">{{ shortLanguage(movie.language) }}</span>
        <span class="meta-dot">·</span>
        <span>{{ movie.duration }}</span>
        <span class="meta-dot">·</span>
        <span class="meta-cert">{{ movie.certificate }}</span>
      </div>

      <!-- Price / CTA -->
      <div class="card-footer">
        <span class="price-from">₹{{ movie.price }}</span>
        <span class="card-cta">Book →</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  movie:   { type: Object,  required: true },
  compact: { type: Boolean, default: false }
})

const displayGenres = computed(() => {
  if (!Array.isArray(props.movie?.genre)) return []
  return props.movie.genre.slice(0, 2)
})

function shortLanguage(lang) {
  if (!lang) return ''
  // Show only first language if combined (e.g. "Telugu/Hindi" → "Telugu")
  return lang.split('/')[0].trim()
}

function handleImageError(e) {
  const title = encodeURIComponent(props.movie?.title || 'Movie')
  e.target.src = `https://placehold.co/500x750/0d0820/e50914?text=${title}&font=roboto`
}
</script>

<style scoped>
.movie-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  text-decoration: none;
  color: var(--text-primary);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease,
              border-color 0.3s ease;
  will-change: transform;
}
.movie-card:hover {
  transform: translateY(-6px) scale(1.015);
  border-color: var(--border-glow);
  box-shadow: 0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px var(--border-glow);
}

/* ── Poster ──────────────────────────────────────────────── */
.card-poster {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  background: var(--bg-secondary);
}
.card-poster img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.movie-card:hover .card-poster img { transform: scale(1.06); }

.poster-gradient {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%);
  pointer-events: none;
}

/* Rating badge */
.card-rating {
  position: absolute;
  top: 10px; right: 10px;
  display: flex; align-items: center; gap: 3px;
  padding: 4px 8px;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  color: #fbbf24;
  border: 1px solid rgba(251,191,36,0.3);
}

/* Status */
.card-status {
  position: absolute;
  top: 10px; left: 10px;
  padding: 3px 8px;
  background: rgba(245,158,11,0.85);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 700;
  color: #000;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

/* Hover overlay */
.card-hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.25s ease;
}
.movie-card:hover .card-hover-overlay { opacity: 1; }

.hover-play-btn {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--color-accent);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  box-shadow: 0 0 20px rgba(0,212,255,0.5);
  transition: transform 0.2s;
}
.movie-card:hover .hover-play-btn { transform: scale(1.1); }

.hover-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.04em;
}

/* ── Card Info ───────────────────────────────────────────── */
.card-info {
  padding: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}

.card-title {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.card-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.genre-tag {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.2);
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-accent);
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.genre-tag:hover {
  background: rgba(0,212,255,0.18);
  border-color: var(--color-accent);
  color: var(--color-accent-light);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}
.meta-dot { opacity: 0.5; }
.meta-cert {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 1px 4px;
  font-weight: 600;
  font-size: 0.65rem;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}
.price-from {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--text-primary);
}
.card-cta {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.04em;
  transition: color 0.2s;
}
.movie-card:hover .card-cta { color: var(--color-accent-light); }

/* Compact variant */
.card-compact .card-info { padding: 0.625rem; }
.card-compact .card-title { font-size: 0.875rem; }
</style>
