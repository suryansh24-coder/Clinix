<!-- ============================================================
     MovieCard.vue — Premium Movie Card Component
     Displays movie poster, title, rating, genre, and price.
     Features hover lift effect, gradient overlay, and rating badge.
     Reusable across Home, Movies, and search results pages.
     ============================================================ -->
<template>
  <router-link
    :to="{ name: 'MovieDetails', params: { id: movie.id } }"
    class="movie-card"
    :class="{ 'card-compact': compact }"
  >
    <!-- Poster Image with Gradient Overlay -->
    <div class="card-poster">
      <img
        :src="movie.poster"
        :alt="movie.title"
        loading="lazy"
        @error="handleImageError"
      />
      <!-- Gradient overlay for text readability -->
      <div class="poster-overlay"></div>

      <!-- Rating Badge (top-right) -->
      <div class="card-rating">
        <span class="rating-star">★</span>
        <span>{{ movie.rating }}</span>
      </div>

      <!-- Status Badge (top-left) -->
      <div v-if="movie.status === 'coming_soon'" class="card-status badge badge-gold">
        Coming Soon
      </div>

      <!-- Hover Overlay with Book Button -->
      <div class="card-hover-overlay">
        <span class="hover-play">▶</span>
        <span class="hover-text">View Details</span>
      </div>
    </div>

    <!-- Card Info Section -->
    <div class="card-info">
      <h3 class="card-title">{{ movie.title }}</h3>

      <!-- Genre Tags -->
      <div class="card-genres">
        <span
          v-for="genre in displayGenres"
          :key="genre"
          class="genre-tag"
        >
          {{ genre }}
        </span>
      </div>

      <!-- Movie Meta: Language, Duration -->
      <div class="card-meta">
        <span class="meta-item">{{ movie.language }}</span>
        <span class="meta-dot">•</span>
        <span class="meta-item">{{ movie.duration }}</span>
      </div>

      <!-- Price -->
      <div class="card-price">
        <span class="price-label">From</span>
        <span class="price-value">₹{{ movie.price }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

/* ── Props ───────────────────────────────────────────────── */
const props = defineProps({
  movie: { type: Object, required: true },
  compact: { type: Boolean, default: false }
})

// Show max 2 genres to keep the card clean
const displayGenres = computed(() => {
  if (Array.isArray(props.movie.genre)) {
    return props.movie.genre.slice(0, 2)
  }
  return []
})

// Fallback for broken poster images
function handleImageError(e) {
  e.target.src = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" fill="%2312122a"><rect width="400" height="600"/><text x="200" y="300" text-anchor="middle" fill="%236b6b8d" font-size="20">🎬</text></svg>'
  )
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
  transition: all var(--transition-slow);
  position: relative;
}

/* ── Hover Lift Effect ───────────────────────────────────── */
.movie-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: var(--border-glow);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), var(--shadow-glow);
}

/* ── Poster Section ──────────────────────────────────────── */
.card-poster {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
}

.card-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.movie-card:hover .card-poster img {
  transform: scale(1.08);
}

.poster-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(10, 10, 26, 0.9), transparent);
  pointer-events: none;
}

/* ── Rating Badge ────────────────────────────────────────── */
.card-rating {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-gold);
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.rating-star { font-size: 0.7rem; }

/* ── Status Badge ────────────────────────────────────────── */
.card-status {
  position: absolute;
  top: var(--space-sm);
  left: var(--space-sm);
}

/* ── Hover Overlay ───────────────────────────────────────── */
.card-hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.movie-card:hover .card-hover-overlay {
  opacity: 1;
}

.hover-play {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  font-size: 1.25rem;
  color: #fff;
  box-shadow: var(--shadow-glow-primary);
  transition: transform var(--transition-spring);
}

.movie-card:hover .hover-play {
  transform: scale(1.1);
}

.hover-text {
  color: #fff;
  font-size: var(--font-size-sm);
  font-weight: 600;
}

/* ── Card Info ───────────────────────────────────────────── */
.card-info {
  padding: var(--space-md) var(--space-md) var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: 700;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-genres {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.genre-tag {
  font-size: 0.65rem;
  padding: 2px 8px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  color: var(--text-muted);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-weight: 600;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.meta-dot { opacity: 0.4; }

.card-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: auto;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border-color);
}

.price-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.price-value {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-neon-green);
}

/* ── Compact Variant ─────────────────────────────────────── */
.card-compact .card-poster {
  aspect-ratio: 3 / 4;
}

.card-compact .card-info {
  padding: var(--space-sm);
}

.card-compact .card-title {
  font-size: var(--font-size-sm);
}
</style>
