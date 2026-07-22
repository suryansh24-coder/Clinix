<template>
  <div class="movie-details-page">

    <!-- Loading -->
    <div v-if="isLoading" class="detail-loading container">
      <div class="skeleton" style="height: 480px; border-radius: var(--radius-xl);"></div>
      <div style="margin-top: 2rem; display:flex; flex-direction:column; gap:1rem;">
        <div class="skeleton skeleton-text" style="width: 45%; height: 2.5rem;"></div>
        <div class="skeleton skeleton-text" style="width: 30%;"></div>
        <div class="skeleton skeleton-text" style="width: 70%;"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-page container">
      <span>🎬</span>
      <h2>Movie not found</h2>
      <p>{{ error }}</p>
      <router-link to="/movies" class="btn btn-accent">Browse Movies</router-link>
    </div>

    <!-- Movie Content -->
    <template v-else-if="movie">

      <!-- ── Hero Banner ── -->
      <div class="movie-banner">
        <img :src="movie.banner || movie.poster" :alt="movie.title" class="banner-img" @error="handleBannerError" />
        <div class="banner-gradient"></div>

        <button class="back-btn btn btn-ghost btn-sm" @click="$router.back()">
          ← Back
        </button>

        <div class="banner-content container">
          <div class="banner-poster">
            <img :src="movie.poster" :alt="movie.title" @error="handlePosterError" />
          </div>
          <div class="banner-info animate-fade-in-up">
            <div class="info-badges">
              <span class="badge badge-primary">{{ movie.certificate }}</span>
              <span class="badge badge-accent">{{ movie.language }}</span>
              <span v-if="movie.status === 'now_showing'" class="badge badge-green">Now Showing</span>
              <span v-else class="badge badge-gold">Coming Soon</span>
            </div>

            <h1 class="movie-title heading-display">{{ movie.title }}</h1>

            <div class="movie-meta">
              <span class="rating-display">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {{ movie.rating }}/10
              </span>
              <span class="meta-sep">·</span>
              <span>{{ movie.duration }}</span>
              <span class="meta-sep">·</span>
              <span>{{ genreText }}</span>
              <span class="meta-sep">·</span>
              <span>{{ formatDate(movie.releaseDate) }}</span>
            </div>

            <div class="price-row">
              <span class="price-label">Tickets from</span>
              <span class="price-amount">₹{{ movie.price }}</span>
            </div>

            <div class="banner-actions" v-if="movie.status === 'now_showing'">
              <button class="btn btn-primary btn-lg" @click="scrollToShows">
                🎟️ Book Tickets
              </button>
              <button v-if="movie.trailerYouTubeId" class="btn btn-outline btn-lg" @click="scrollToTrailer">
                ▶ Watch Trailer
              </button>
            </div>
            <div v-else class="coming-soon-cta">
              <span class="badge badge-gold">Releasing {{ formatDate(movie.releaseDate) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Body ── -->
      <div class="details-body container">

        <!-- ── Left Column ── -->
        <div class="details-main">

          <!-- Synopsis -->
          <section class="detail-section glass-card">
            <h2 class="detail-section-title">Synopsis</h2>
            <p class="synopsis-text">{{ movie.description }}</p>
          </section>

          <!-- ── Trailer ── -->
          <section
            v-if="movie.trailerYouTubeId"
            ref="trailerSection"
            class="detail-section glass-card"
          >
            <h2 class="detail-section-title">🎬 Official Trailer</h2>
            <div class="trailer-container">
              <iframe
                :src="`https://www.youtube-nocookie.com/embed/${movie.trailerYouTubeId}?rel=0&modestbranding=1&showinfo=0&color=white`"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                loading="lazy"
                title="Movie Trailer"
              ></iframe>
            </div>
          </section>

          <!-- ── Cast ── -->
          <section class="detail-section glass-card" v-if="movie.cast?.length">
            <h2 class="detail-section-title">Cast & Crew</h2>
            <div class="cast-grid">
              <div
                v-for="member in movie.cast"
                :key="getCastName(member)"
                class="cast-card"
              >
                <div class="cast-avatar-wrap">
                  <img
                    :src="getCastImage(member)"
                    :alt="getCastName(member)"
                    class="cast-avatar-img"
                    @error="e => e.target.src = getFallbackAvatar(getCastName(member))"
                  />
                </div>
                <div class="cast-info">
                  <span class="cast-name">{{ getCastName(member) }}</span>
                  <span v-if="getCastRole(member)" class="cast-role">{{ getCastRole(member) }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- ── Shows ── -->
          <section
            v-if="movie.status === 'now_showing'"
            ref="showsSection"
            class="detail-section"
          >
            <h2 class="section-title heading-display" style="margin-bottom: 1.25rem;">
              🎭 <span class="text-gradient">Select</span> Shows
            </h2>

            <div v-if="showsLoading" class="shows-loading">
              <div v-for="n in 3" :key="n" class="skeleton" style="height: 120px; margin-bottom: 1rem; border-radius: 12px;"></div>
            </div>

            <div v-else-if="groupedShows.length === 0" class="no-shows glass-card">
              <span>🎭</span>
              <p>No shows available at this moment. Check back soon!</p>
            </div>

            <div v-else class="theatre-list">
              <div
                v-for="group in groupedShows"
                :key="group.theatre.id"
                class="theatre-card glass-card"
              >
                <div class="theatre-header">
                  <div>
                    <h3 class="theatre-name">{{ group.theatre.name }}</h3>
                    <p class="theatre-location">📍 {{ group.theatre.location }}{{ group.theatre.city ? `, ${group.theatre.city}` : '' }}</p>
                  </div>
                  <div class="theatre-facilities">
                    <span v-for="fac in (group.theatre.facilities || []).slice(0, 2)" :key="fac" class="facility-badge">{{ fac }}</span>
                  </div>
                </div>

                <div class="show-times">
                  <button
                    v-for="show in group.shows"
                    :key="show.id"
                    class="time-slot"
                    :class="{
                      'slot-selected': selectedShow?.id === show.id,
                      'slot-full':     show.availableSeats === 0
                    }"
                    :disabled="show.availableSeats === 0"
                    @click="selectShow(show, group.theatre)"
                  >
                    <span class="slot-time">{{ show.time }}</span>
                    <span class="slot-seats" :class="seatClass(show.availableSeats, show.totalSeats)">
                      {{ show.availableSeats === 0 ? 'Housefull' : show.availableSeats + ' seats' }}
                    </span>
                    <span class="slot-price">₹{{ show.price }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="proceed-section" v-if="selectedShow">
              <div class="selected-show-summary glass-card">
                <div class="summary-item"><span class="sum-label">Movie</span><span class="sum-val">{{ movie.title }}</span></div>
                <div class="summary-item"><span class="sum-label">Theatre</span><span class="sum-val">{{ selectedTheatre?.name }}</span></div>
                <div class="summary-item"><span class="sum-label">Time</span><span class="sum-val">{{ selectedShow.time }}</span></div>
                <div class="summary-item"><span class="sum-label">Date</span><span class="sum-val">{{ selectedShow.date }}</span></div>
              </div>
              <router-link
                :to="{ name: 'Booking', params: { movieId: movie.id, showId: selectedShow.id } }"
                class="btn btn-primary btn-lg w-full"
              >
                Continue to Seat Selection →
              </router-link>
            </div>
          </section>
        </div>

        <!-- ── Sidebar ── -->
        <aside class="details-sidebar">
          <div class="sidebar-card glass-card">
            <h3 class="sidebar-card-title">Movie Info</h3>
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
                <span class="dr-label">IMDb</span>
                <span class="dr-value" style="color:#fbbf24; font-weight:700;">⭐ {{ movie.rating }}/10</span>
              </div>
            </div>
          </div>

          <!-- Genre tags sidebar -->
          <div class="sidebar-card glass-card" v-if="movie.genre?.length">
            <h3 class="sidebar-card-title">Genres</h3>
            <div class="sidebar-genres">
              <router-link
                v-for="g in movie.genre"
                :key="g"
                :to="{ path: '/movies', query: { genre: g } }"
                class="sidebar-genre-tag"
              >{{ g }}</router-link>
            </div>
          </div>

          <!-- Cities showing in -->
          <div class="sidebar-card glass-card" v-if="movie.cities?.length">
            <h3 class="sidebar-card-title">Available In</h3>
            <div class="cities-available">
              <span v-for="city in movie.cities.slice(0, 8)" :key="city" class="city-available-tag">{{ city }}</span>
            </div>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMovies }  from '@/composables/useMovies'
import { theatresAPI } from '@/services/api'

const props = defineProps({ id: { type: String, required: true } })

const {
  isLoading, error, currentMovie: movie,
  fetchMovie, fetchShowsForMovie, shows
} = useMovies()

const showsLoading    = ref(false)
const theatres        = ref([])
const selectedShow    = ref(null)
const selectedTheatre = ref(null)
const showsSection    = ref(null)
const trailerSection  = ref(null)

// ── Cast helpers (supports string or object format) ──────
function getCastName(member) {
  return typeof member === 'string' ? member : (member?.name || '')
}
function getCastRole(member) {
  if (typeof member === 'string') return ''
  return member?.role || ''
}
function getCastImage(member) {
  if (typeof member === 'object' && member?.image) return member.image
  return getFallbackAvatar(getCastName(member))
}
function getFallbackAvatar(name) {
  const colors = ['b91c1c','7c3aed','0369a1','d97706','059669','db2777','0891b2','4f46e5']
  const idx = Math.abs(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % colors.length
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${colors[idx]}&color=fff&size=200`
}

// ── Computed ─────────────────────────────────────────────
const genreText = computed(() =>
  Array.isArray(movie.value?.genre) ? movie.value.genre.join(' / ') : ''
)

const groupedShows = computed(() => {
  const groups = {}
  shows.value.forEach(show => {
    const theatre = theatres.value.find(t => t.id === show.theatreId)
    if (!theatre) return
    if (!groups[show.theatreId]) groups[show.theatreId] = { theatre, shows: [] }
    groups[show.theatreId].shows.push(show)
  })
  return Object.values(groups)
})

// ── Lifecycle ─────────────────────────────────────────────
onMounted(async () => {
  await fetchMovie(props.id)
  showsLoading.value = true
  try {
    await fetchShowsForMovie(props.id)
    const theatreData = await theatresAPI.getAll()
    theatres.value = Array.isArray(theatreData?.data) ? theatreData.data : []
  } catch {
    theatres.value = []
  } finally {
    showsLoading.value = false
  }
})

function selectShow(show, theatre) {
  selectedShow.value    = show
  selectedTheatre.value = theatre
}
function scrollToShows() {
  showsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function scrollToTrailer() {
  trailerSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function seatClass(available, total) {
  if (available === 0)           return 'seats-full'
  if (available / total < 0.2)   return 'seats-low'
  if (available / total < 0.5)   return 'seats-medium'
  return 'seats-high'
}
function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}
function handleBannerError(e) { e.target.style.opacity = '0' }
function handlePosterError(e) {
  e.target.src = `https://placehold.co/400x600/1a1a2e/666?text=Poster`
}
</script>

<style scoped>
.movie-details-page { padding-bottom: var(--space-4xl); }

/* ── Loading / Error ─────────────────────────────────────── */
.detail-loading { padding: var(--space-2xl) 0; }
.error-page {
  padding: var(--space-4xl) 0;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: var(--space-md);
}
.error-page span { font-size: 4rem; }
.error-page h2 { font-family: var(--font-display); font-size: var(--font-size-3xl); }

/* ── Banner ──────────────────────────────────────────────── */
.movie-banner {
  position: relative;
  height: 520px;
  overflow: hidden;
  background: #0d0d1a;
}
.banner-img { width: 100%; height: 100%; object-fit: cover; }
.banner-gradient {
  position: absolute; inset: 0;
  background:
    linear-gradient(to right, rgba(10,10,26,0.98) 0%, rgba(10,10,26,0.8) 45%, rgba(10,10,26,0.3) 100%),
    linear-gradient(to top, var(--bg-primary) 0%, transparent 35%);
}
.back-btn {
  position: absolute;
  top: var(--space-xl); left: var(--space-xl);
  z-index: 10;
}
.banner-content {
  position: absolute;
  bottom: 0; left: 0; right: 0;
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
  box-shadow: 0 16px 40px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.1);
  transition: transform 0.3s ease;
}
.banner-poster:hover { transform: scale(1.03); }
.banner-poster img { width: 100%; height: 100%; object-fit: cover; display: block; }

.banner-info { flex: 1; color: #fff; }
.info-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.875rem; }

.movie-title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 900;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  margin-bottom: 0.75rem;
  line-height: 1.1;
}

.movie-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.9375rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 1rem;
}
.meta-sep { opacity: 0.4; }
.rating-display {
  display: flex; align-items: center; gap: 0.3rem;
  font-weight: 700;
  color: #fbbf24;
}

.price-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; }
.price-label { font-size: 0.875rem; color: rgba(255,255,255,0.6); }
.price-amount {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
}

.banner-actions { display: flex; gap: 0.875rem; flex-wrap: wrap; }
.coming-soon-cta { margin-top: 0.5rem; }

/* ── Body Layout ─────────────────────────────────────────── */
.details-body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-2xl);
  padding-top: var(--space-2xl);
}

/* ── Sections ────────────────────────────────────────────── */
.detail-section { margin-bottom: var(--space-lg); }
.detail-section-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-accent);
  display: inline-block;
}
.synopsis-text {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 0.9375rem;
}

/* ── Trailer ─────────────────────────────────────────────── */
.trailer-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #000;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.trailer-container iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* ── Cast ────────────────────────────────────────────────── */
.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 1rem;
}
.cast-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  transition: transform 0.2s;
}
.cast-card:hover { transform: translateY(-3px); }
.cast-avatar-wrap {
  width: 80px; height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  transition: border-color 0.2s;
  flex-shrink: 0;
}
.cast-card:hover .cast-avatar-wrap { border-color: var(--color-accent); }
.cast-avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cast-info { display: flex; flex-direction: column; gap: 0.15rem; }
.cast-name {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}
.cast-role {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-style: italic;
  line-height: 1.3;
}

/* ── Shows ───────────────────────────────────────────────── */
.shows-loading { display: flex; flex-direction: column; gap: 1rem; }
.no-shows {
  text-align: center;
  padding: var(--space-2xl);
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
}
.no-shows span { font-size: 2rem; }
.theatre-list { display: flex; flex-direction: column; gap: 1rem; }

.theatre-card { padding: 1.25rem; }
.theatre-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}
.theatre-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}
.theatre-location { font-size: 0.8125rem; color: var(--text-muted); margin-top: 2px; }
.theatre-facilities { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.facility-badge {
  padding: 2px 8px;
  background: rgba(0,212,255,0.1);
  border: 1px solid rgba(0,212,255,0.2);
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-accent);
}

.show-times { display: flex; flex-wrap: wrap; gap: 0.625rem; }
.time-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-color);
  background: var(--bg-glass);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 90px;
}
.time-slot:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: rgba(0,212,255,0.06);
}
.time-slot.slot-selected {
  border-color: var(--color-accent);
  background: rgba(0,212,255,0.12);
  box-shadow: 0 0 0 3px rgba(0,212,255,0.15);
}
.time-slot.slot-full { opacity: 0.45; cursor: not-allowed; }
.slot-time { font-family: var(--font-display); font-size: 0.9375rem; font-weight: 700; color: var(--text-primary); }
.slot-seats { font-size: 0.7rem; font-weight: 600; }
.seats-high  { color: #22c55e; }
.seats-medium{ color: #f59e0b; }
.seats-low   { color: #ef4444; }
.seats-full  { color: var(--text-muted); }
.slot-price  { font-size: 0.75rem; color: var(--text-muted); }

.proceed-section { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.selected-show-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding: 1rem 1.25rem;
}
.summary-item { display: flex; flex-direction: column; gap: 2px; }
.sum-label { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.sum-val { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }

/* ── Sidebar ─────────────────────────────────────────────── */
.details-sidebar { position: sticky; top: 88px; display: flex; flex-direction: column; gap: 1rem; }
.sidebar-card { padding: var(--space-xl); }
.sidebar-card-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}
.detail-rows { display: flex; flex-direction: column; gap: 0.75rem; }
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.875rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.dr-label { color: var(--text-muted); flex-shrink: 0; font-size: 0.8125rem; }
.dr-value { color: var(--text-primary); font-weight: 600; text-align: right; }

/* Genre tags in sidebar */
.sidebar-genres { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.sidebar-genre-tag {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.2);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-accent);
  text-decoration: none;
  transition: background 0.2s;
}
.sidebar-genre-tag:hover { background: rgba(0,212,255,0.18); }

/* City tags */
.cities-available { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.city-available-tag {
  padding: 3px 10px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1024px) {
  .details-body { grid-template-columns: 1fr; }
  .details-sidebar { position: static; }
}
@media (max-width: 768px) {
  .movie-banner { height: auto; min-height: 480px; }
  .banner-content { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .banner-poster { width: 120px; }
  .back-btn { top: 1rem; left: 1rem; }
  .cast-grid { grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); }
  .selected-show-summary { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 480px) {
  .banner-poster { display: none; }
  .cast-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); }
}
</style>
