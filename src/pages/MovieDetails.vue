<!-- ============================================================
     MovieDetails.vue — Movie Detail Page
     Shows large banner, synopsis, cast, ratings, and show
     timings grouped by theatre. Seat booking entry point.
     Lifecycle: onMounted fetches movie + shows data.
     ============================================================ -->
<template>
  <div class="movie-details-page">

    <!-- ── Loading State ── -->
    <div v-if="isLoading" class="detail-loading container">
      <div class="skeleton" style="height: 420px; border-radius: var(--radius-xl);"></div>
      <div style="margin-top: 2rem;">
        <div class="skeleton skeleton-text" style="width: 40%; height: 2rem;"></div>
        <div class="skeleton skeleton-text" style="width: 60%; margin-top: 1rem;"></div>
        <div class="skeleton skeleton-text" style="width: 80%;"></div>
      </div>
    </div>

    <!-- ── Error State ── -->
    <div v-else-if="error" class="error-page container">
      <span>🎬</span>
      <h2>Movie not found</h2>
      <p>{{ error }}</p>
      <router-link to="/movies" class="btn btn-accent">Browse Movies</router-link>
    </div>

    <!-- ── Movie Content ── -->
    <template v-else-if="movie">

      <!-- Hero Banner -->
      <div class="movie-banner">
        <img :src="movie.banner" :alt="movie.title" class="banner-img" @error="handleBannerError" />
        <div class="banner-gradient"></div>

        <!-- Back Button -->
        <button class="back-btn btn btn-ghost btn-sm" @click="$router.back()">
          ← Back
        </button>

        <!-- Banner Content -->
        <div class="banner-content container">
          <div class="banner-poster">
            <img :src="movie.poster" :alt="movie.title" @error="handlePosterError" />
          </div>
          <div class="banner-info animate-fade-in-up">
            <!-- Badges -->
            <div class="info-badges">
              <span class="badge badge-primary">{{ movie.certificate }}</span>
              <span class="badge badge-accent">{{ movie.language }}</span>
              <span class="badge badge-green" v-if="movie.status === 'now_showing'">Now Showing</span>
              <span class="badge badge-gold" v-else>Coming Soon</span>
            </div>

            <h1 class="movie-title heading-display">{{ movie.title }}</h1>

            <!-- Meta Row -->
            <div class="movie-meta">
              <span class="rating-display">
                <span class="star">★</span> {{ movie.rating }}/10
              </span>
              <span class="meta-sep">•</span>
              <span>{{ movie.duration }}</span>
              <span class="meta-sep">•</span>
              <span>{{ genreText }}</span>
              <span class="meta-sep">•</span>
              <span>{{ formatDate(movie.releaseDate) }}</span>
            </div>

            <!-- Price -->
            <div class="price-row">
              <span class="price-label">Tickets from</span>
              <span class="price-amount">₹{{ movie.price }}</span>
            </div>

            <!-- CTA -->
            <div class="banner-actions" v-if="movie.status === 'now_showing'">
              <button class="btn btn-primary btn-lg" @click="scrollToShows">
                🎟️ Book Tickets
              </button>
            </div>
            <div v-else class="coming-soon-cta">
              <span class="badge badge-gold">Releasing {{ formatDate(movie.releaseDate) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Main Details Section ── -->
      <div class="details-body container">

        <!-- Left Column -->
        <div class="details-main">

          <!-- Synopsis -->
          <section class="detail-section glass-card">
            <h2 class="detail-section-title">Synopsis</h2>
            <p class="synopsis-text">{{ movie.description }}</p>
          </section>

          <!-- Cast -->
          <section class="detail-section glass-card" v-if="movie.cast?.length">
            <h2 class="detail-section-title">Cast</h2>
            <div class="cast-grid">
              <div v-for="actor in movie.cast" :key="actor" class="cast-card">
                <div class="cast-avatar">{{ actor.charAt(0) }}</div>
                <span class="cast-name">{{ actor }}</span>
              </div>
            </div>
          </section>

          <!-- Shows Section (anchor target) -->
          <section ref="showsSection" class="detail-section" v-if="movie.status === 'now_showing'">
            <h2 class="section-title heading-display">Select Shows</h2>

            <div v-if="showsLoading" class="shows-loading">
              <div v-for="n in 3" :key="n" class="skeleton" style="height: 120px; margin-bottom: 1rem; border-radius: 12px;"></div>
            </div>

            <div v-else-if="groupedShows.length === 0" class="no-shows glass-card">
              <span>🎭</span>
              <p>No shows available at the moment.</p>
            </div>

            <!-- Shows Grouped by Theatre -->
            <div v-else class="theatre-list">
              <div
                v-for="group in groupedShows"
                :key="group.theatre.id"
                class="theatre-card glass-card"
              >
                <!-- Theatre Header -->
                <div class="theatre-header">
                  <div>
                    <h3 class="theatre-name">🏛️ {{ group.theatre.name }}</h3>
                    <p class="theatre-location">📍 {{ group.theatre.location }}</p>
                  </div>
                  <div class="theatre-facilities">
                    <span
                      v-for="fac in group.theatre.facilities?.slice(0, 2)"
                      :key="fac"
                      class="facility-badge"
                    >{{ fac }}</span>
                  </div>
                </div>

                <!-- Time Slots -->
                <div class="show-times">
                  <button
                    v-for="show in group.shows"
                    :key="show.id"
                    class="time-slot"
                    :class="{
                      'slot-selected': selectedShow?.id === show.id,
                      'slot-full': show.availableSeats === 0
                    }"
                    :disabled="show.availableSeats === 0"
                    @click="selectShow(show, group.theatre)"
                  >
                    <span class="slot-time">{{ show.time }}</span>
                    <span class="slot-seats" :class="seatClass(show.availableSeats, show.totalSeats)">
                      {{ show.availableSeats }} seats
                    </span>
                    <span class="slot-price">₹{{ show.price }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Proceed to Booking Button -->
            <div class="proceed-section" v-if="selectedShow">
              <div class="selected-show-summary glass-card">
                <span>🎬 {{ movie.title }}</span>
                <span>🏛️ {{ selectedTheatre?.name }}</span>
                <span>🕐 {{ selectedShow.time }}</span>
                <span>📅 {{ selectedShow.date }}</span>
              </div>
              <router-link
                :to="{ name: 'Booking', params: { movieId: movie.id, showId: selectedShow.id } }"
                class="btn btn-primary btn-lg w-full"
              >
                Proceed to Seat Selection →
              </router-link>
            </div>
          </section>
        </div>

        <!-- Right Column — Sidebar Info -->
        <aside class="details-sidebar">
          <div class="sidebar-card glass-card">
            <h3 class="sidebar-card-title">Movie Details</h3>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="dr-label">Director</span>
                <span class="dr-value">{{ movie.director }}</span>
              </div>
              <div class="detail-row">
                <span class="dr-label">Language</span>
                <span class="dr-value">{{ movie.language }}</span>
              </div>
              <div class="detail-row">
                <span class="dr-label">Duration</span>
                <span class="dr-value">{{ movie.duration }}</span>
              </div>
              <div class="detail-row">
                <span class="dr-label">Certificate</span>
                <span class="dr-value">
                  <span class="badge badge-primary">{{ movie.certificate }}</span>
                </span>
              </div>
              <div class="detail-row">
                <span class="dr-label">Genre</span>
                <span class="dr-value">{{ genreText }}</span>
              </div>
              <div class="detail-row">
                <span class="dr-label">Release</span>
                <span class="dr-value">{{ formatDate(movie.releaseDate) }}</span>
              </div>
              <div class="detail-row">
                <span class="dr-label">IMDb Rating</span>
                <span class="dr-value rating-display">⭐ {{ movie.rating }}/10</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup>
/* ── Imports ─────────────────────────────────────────────── */
import { ref, computed, onMounted } from 'vue'
import { useMovies } from '@/composables/useMovies'
import { theatresAPI } from '@/services/api'

/* ── Props from router ───────────────────────────────────── */
const props = defineProps({ id: { type: String, required: true } })

// ── Composable ────────────────────────────────────────────
const { isLoading, error, currentMovie: movie, fetchMovie, fetchShowsForMovie, shows } = useMovies()

// ── Local state ────────────────────────────────────────────
const showsLoading  = ref(false)
const theatres      = ref([])
const selectedShow  = ref(null)
const selectedTheatre = ref(null)
const showsSection  = ref(null)

// ── Computed: genre text ──────────────────────────────────
const genreText = computed(() =>
  Array.isArray(movie.value?.genre) ? movie.value.genre.join(' / ') : ''
)

// ── Computed: group shows by theatre ──────────────────────
const groupedShows = computed(() => {
  const groups = {}
  shows.value.forEach(show => {
    const theatre = theatres.value.find(t => t.id === show.theatreId)
    if (!theatre) return
    if (!groups[show.theatreId]) {
      groups[show.theatreId] = { theatre, shows: [] }
    }
    groups[show.theatreId].shows.push(show)
  })
  return Object.values(groups)
})

// ── Lifecycle: fetch movie data on mount ─────────────────
onMounted(async () => {
  try {
    await fetchMovie(props.id)
    showsLoading.value = true
    const [showData, theatreData] = await Promise.all([
      fetchShowsForMovie(props.id),
      theatresAPI.getAll()
    ])
    theatres.value = theatreData.data
  } catch {
    // Error handled by composable
  } finally {
    showsLoading.value = false
  }
})

// ── Select a show slot ────────────────────────────────────
function selectShow(show, theatre) {
  selectedShow.value = show
  selectedTheatre.value = theatre
}

// ── Scroll to shows section ───────────────────────────────
function scrollToShows() {
  showsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── Seat availability colour ──────────────────────────────
function seatClass(available, total) {
  const ratio = available / total
  if (available === 0) return 'seats-full'
  if (ratio < 0.2)    return 'seats-low'
  if (ratio < 0.5)    return 'seats-medium'
  return 'seats-high'
}

// ── Format date helper ────────────────────────────────────
function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ── Image error fallbacks ─────────────────────────────────
function handleBannerError(e) {
  e.target.style.opacity = '0'
}
function handlePosterError(e) {
  e.target.src = `https://picsum.photos/seed/fallback${props.id}/400/600`
}
</script>

<style scoped>
.movie-details-page {
  padding-bottom: var(--space-4xl);
}

/* ── Loading / Error ─────────────────────────────────────── */
.detail-loading { padding: var(--space-2xl) 0; }
.error-page {
  padding: var(--space-4xl) 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}
.error-page span { font-size: 4rem; }
.error-page h2 { font-family: var(--font-display); font-size: var(--font-size-3xl); }

/* ── Banner ──────────────────────────────────────────────── */
.movie-banner {
  position: relative;
  height: 520px;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-gradient {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgba(10,10,26,0.97) 0%, rgba(10,10,26,0.75) 50%, rgba(10,10,26,0.4) 100%),
    linear-gradient(to top, var(--bg-primary) 0%, transparent 40%);
}

.back-btn {
  position: absolute;
  top: var(--space-xl);
  left: var(--space-xl);
  z-index: 10;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  gap: var(--space-2xl);
  padding-bottom: var(--space-2xl);
}

.banner-poster {
  flex-shrink: 0;
  width: 180px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.1);
  box-shadow: var(--shadow-lg);
}

.banner-poster img { width: 100%; display: block; }

.banner-info { flex: 1; }

.info-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.movie-title {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--space-md);
  line-height: 1.1;
}

.movie-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-lg);
}

.rating-display {
  color: var(--color-gold);
  font-weight: 700;
}

.star { font-size: 0.85em; }
.meta-sep { opacity: 0.35; }

.price-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}
.price-label { color: var(--text-muted); font-size: var(--font-size-sm); }
.price-amount {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-neon-green);
}

.banner-actions { display: flex; gap: var(--space-md); }
.coming-soon-cta { margin-top: var(--space-sm); }

/* ── Body Layout ─────────────────────────────────────────── */
.details-body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-xl);
  margin-top: var(--space-2xl);
}

.details-main { display: flex; flex-direction: column; gap: var(--space-xl); }

/* ── Detail Section ──────────────────────────────────────── */
.detail-section {
  padding: var(--space-xl);
}

.detail-section-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.synopsis-text {
  color: var(--text-secondary);
  line-height: 1.8;
}

/* ── Cast ────────────────────────────────────────────────── */
.cast-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.cast-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  width: 80px;
}

.cast-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--gradient-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--font-size-xl);
  color: #fff;
}

.cast-name {
  font-size: var(--font-size-xs);
  text-align: center;
  color: var(--text-secondary);
  line-height: 1.3;
}

/* ── Shows ───────────────────────────────────────────────── */
.no-shows {
  padding: var(--space-2xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}
.no-shows span { font-size: 2.5rem; }

.theatre-list { display: flex; flex-direction: column; gap: var(--space-lg); }

.theatre-card { padding: var(--space-xl); }

.theatre-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
  gap: var(--space-md);
}

.theatre-name {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
}

.theatre-location {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  margin-top: 4px;
}

.theatre-facilities {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.facility-badge {
  padding: 3px 10px;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.15);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--color-accent);
}

/* ── Time Slots ──────────────────────────────────────────── */
.show-times {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.time-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-glass);
  transition: all var(--transition-base);
  min-width: 100px;
}

.time-slot:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: rgba(0,212,255,0.08);
}

.time-slot.slot-selected {
  border-color: var(--color-accent);
  background: rgba(0,212,255,0.15);
  box-shadow: var(--shadow-glow);
}

.time-slot.slot-full {
  opacity: 0.4;
  cursor: not-allowed;
}

.slot-time {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--font-size-base);
}

.slot-seats { font-size: var(--font-size-xs); }
.seats-high { color: var(--color-neon-green); }
.seats-medium { color: var(--color-gold); }
.seats-low { color: #ff8800; }
.seats-full { color: var(--color-primary); }

.slot-price {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

/* ── Proceed Section ─────────────────────────────────────── */
.proceed-section {
  margin-top: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.selected-show-summary {
  padding: var(--space-md) var(--space-lg);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* ── Sidebar ─────────────────────────────────────────────── */
.details-sidebar { position: sticky; top: 88px; }

.sidebar-card { padding: var(--space-xl); }

.sidebar-card-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.detail-rows { display: flex; flex-direction: column; gap: var(--space-md); }

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-sm);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.dr-label { color: var(--text-muted); flex-shrink: 0; }
.dr-value { color: var(--text-primary); font-weight: 500; text-align: right; }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1024px) {
  .details-body { grid-template-columns: 1fr; }
  .details-sidebar { position: static; }
}

@media (max-width: 768px) {
  .movie-banner { height: auto; min-height: 500px; }
  .banner-content { flex-direction: column; align-items: flex-start; }
  .banner-poster { width: 120px; }
  .movie-title { font-size: var(--font-size-2xl); }
  .back-btn { top: var(--space-md); left: var(--space-md); }
}
</style>
