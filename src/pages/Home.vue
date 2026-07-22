<template>
  <div class="home-page">

    <!-- ── Hero Carousel ── -->
    <HeroCarousel :movies="trendingMovies" />

    <!-- ── Genre Quick Filters ── -->
    <section class="categories-section container">
      <div class="categories-scroll">
        <router-link
          v-for="cat in categories"
          :key="cat.label"
          :to="{ path: '/movies', query: cat.query }"
          class="cat-chip"
          :class="{ 'cat-chip--active': isActiveCategory(cat) }"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span>{{ cat.label }}</span>
        </router-link>
      </div>
    </section>

    <!-- ── City Indicator ── -->
    <div class="city-indicator container" v-if="selectedCity">
      <div class="city-indicator-inner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Showing movies available in <strong>{{ selectedCity }}</strong></span>
      </div>
    </div>

    <!-- ── Now Showing ── -->
    <section class="section container">
      <div class="section-header">
        <div>
          <h2 class="section-title heading-display">
            🎬 <span class="text-gradient-primary">Now</span> Showing
          </h2>
          <p class="section-subtitle">Book tickets for movies in theatres now</p>
        </div>
        <router-link to="/movies?status=now_showing" class="view-all-link">View All →</router-link>
      </div>

      <div v-if="isLoading" class="grid grid-5">
        <div v-for="n in 5" :key="n" class="skeleton skeleton-card"></div>
      </div>
      <div v-else-if="error" class="error-state glass-card">
        <span>⚠️</span><p>{{ error }}</p>
        <button class="btn btn-accent btn-sm" @click="fetchMovies">Retry</button>
      </div>
      <div v-else-if="filteredNowShowing.length === 0" class="empty-state glass-card">
        <span>🎭</span><p>No movies showing in {{ selectedCity }} right now.</p>
      </div>
      <div v-else class="grid grid-5">
        <MovieCard
          v-for="(movie, i) in filteredNowShowing.slice(0, 10)"
          :key="movie.id"
          :movie="movie"
          class="animate-fade-in-up"
          :style="{ animationDelay: `${i * 50}ms` }"
        />
      </div>
    </section>

    <!-- ── Trending / Top Rated ── -->
    <section class="section container trending-section">
      <div class="section-header">
        <div>
          <h2 class="section-title heading-display">
            🔥 <span class="text-gradient">Top</span> Rated
          </h2>
          <p class="section-subtitle">Highest rated films of all time</p>
        </div>
        <router-link to="/movies" class="view-all-link">View All →</router-link>
      </div>

      <div v-if="isLoading" class="grid grid-5">
        <div v-for="n in 5" :key="n" class="skeleton skeleton-card"></div>
      </div>
      <div v-else class="grid grid-5">
        <MovieCard
          v-for="(movie, i) in topRated.slice(0, 5)"
          :key="movie.id"
          :movie="movie"
          class="animate-fade-in-up"
          :style="{ animationDelay: `${i * 60}ms` }"
        />
      </div>
    </section>

    <!-- ── Coming Soon ── -->
    <section class="coming-soon-strip" v-if="!isLoading && comingSoonMovies.length">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title heading-display">
              🗓️ <span class="text-gradient">Coming</span> Soon
            </h2>
            <p class="section-subtitle">Upcoming releases to watch for</p>
          </div>
          <router-link to="/movies?status=coming_soon" class="view-all-link">View All →</router-link>
        </div>

        <div class="coming-soon-scroll">
          <div class="coming-soon-track">
            <MovieCard
              v-for="movie in comingSoonMovies.slice(0, 8)"
              :key="movie.id"
              :movie="movie"
              class="coming-soon-card"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ── Feature Highlights ── -->
    <section class="features-section container">
      <div class="features-grid">
        <div class="feature-card glass-card" v-for="f in features" :key="f.title">
          <span class="feature-icon">{{ f.icon }}</span>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.desc }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import HeroCarousel from '@/components/movies/HeroCarousel.vue'
import MovieCard    from '@/components/movies/MovieCard.vue'
import { useMovies }  from '@/composables/useMovies'
import { useCity }    from '@/composables/useCity'

const { movies, isLoading, error, fetchMovies, nowShowingMovies, comingSoonMovies, trendingMovies } = useMovies()
const { selectedCity } = useCity()
const route = useRoute()

const categories = [
  { label: 'Action',    icon: '💥', query: { genre: 'Action' } },
  { label: 'Drama',     icon: '🎭', query: { genre: 'Drama' } },
  { label: 'Comedy',    icon: '😂', query: { genre: 'Comedy' } },
  { label: 'Sci-Fi',    icon: '🚀', query: { genre: 'Sci-Fi' } },
  { label: 'Romance',   icon: '❤️', query: { genre: 'Romance' } },
  { label: 'Horror',    icon: '👻', query: { genre: 'Horror' } },
  { label: 'Thriller',  icon: '🔪', query: { genre: 'Thriller' } },
  { label: 'Biography', icon: '📖', query: { genre: 'Biography' } },
  { label: 'Animation', icon: '🎨', query: { genre: 'Animation' } },
  { label: 'Hindi',     icon: '🇮🇳', query: { language: 'Hindi' } },
]

const features = [
  { icon: '🎟️', title: 'Easy Booking',     desc: 'Reserve seats in under 60 seconds with our streamlined checkout.' },
  { icon: '💺', title: 'Seat Selection',   desc: 'Pick your perfect seat from an interactive theatre layout.' },
  { icon: '🔒', title: 'Secure Sessions',  desc: 'Your bookings and account are protected at all times.' },
  { icon: '⚡', title: 'Instant Confirm',  desc: 'Get instant booking confirmation with full details.' },
]

function isActiveCategory(cat) {
  if (cat.query?.genre)    return route.query.genre === cat.query.genre
  if (cat.query?.language) return route.query.language === cat.query.language
  return false
}

// Filter now-showing by selected city
const filteredNowShowing = computed(() => {
  if (!selectedCity.value) return nowShowingMovies.value
  return nowShowingMovies.value.filter(m =>
    !Array.isArray(m.cities) || m.cities.includes(selectedCity.value)
  )
})

// Top rated across all movies
const topRated = computed(() =>
  [...movies.value].sort((a, b) => b.rating - a.rating).slice(0, 5)
)

onMounted(fetchMovies)
</script>

<style scoped>
.home-page { padding-bottom: var(--space-4xl); }

/* ── Categories ──────────────────────────────────────────── */
.categories-section {
  padding: 1.5rem 0 0.5rem;
}
.categories-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 0.5rem;
}
.categories-scroll::-webkit-scrollbar { display: none; }

.cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  border-radius: var(--radius-full);
  background: var(--bg-glass);
  border: 1.5px solid var(--border-color);
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.cat-chip:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(0,212,255,0.06);
  transform: translateY(-1px);
}
.cat-chip--active {
  border-color: var(--color-accent);
  background: rgba(0,212,255,0.1);
  color: var(--color-accent);
}
.cat-icon { font-size: 0.875rem; }

/* ── City Indicator ──────────────────────────────────────── */
.city-indicator {
  margin-top: 0.75rem;
}
.city-indicator-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
}
.city-indicator-inner strong { color: var(--text-primary); }

/* ── Sections ────────────────────────────────────────────── */
.section {
  padding: 3rem 0 0;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
}
.section-title {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  margin-bottom: 0.25rem;
}
.section-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
}
.view-all-link {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent);
  text-decoration: none;
  white-space: nowrap;
  padding: 0.35rem 0.875rem;
  border: 1px solid rgba(0,212,255,0.3);
  border-radius: var(--radius-full);
  transition: all 0.2s;
}
.view-all-link:hover {
  background: rgba(0,212,255,0.1);
  border-color: var(--color-accent);
}

/* ── Trending section bg ─────────────────────────────────── */
.trending-section {
  background: linear-gradient(180deg, transparent, rgba(0,212,255,0.03), transparent);
  border-radius: var(--radius-xl);
}

/* ── Grids ───────────────────────────────────────────────── */
.grid { display: grid; gap: 1.25rem; }
.grid-5 { grid-template-columns: repeat(5, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* ── Coming Soon ─────────────────────────────────────────── */
.coming-soon-strip {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 3rem 0;
  margin-top: 3rem;
}
.coming-soon-scroll { overflow-x: auto; scrollbar-width: none; margin-top: 1.5rem; }
.coming-soon-scroll::-webkit-scrollbar { display: none; }
.coming-soon-track { display: flex; gap: 1.25rem; width: max-content; }
.coming-soon-card { width: 200px; flex-shrink: 0; }

/* ── Features ────────────────────────────────────────────── */
.features-section { padding: 3rem 0; }
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}
.feature-card {
  padding: 2rem 1.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
}
.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-glow);
}
.feature-icon { font-size: 2rem; display: block; margin-bottom: 1rem; }
.feature-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}
.feature-desc {
  color: var(--text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
}

/* ── Empty / Error ───────────────────────────────────────── */
.empty-state, .error-state {
  padding: 3rem;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
}
.empty-state span, .error-state span { font-size: 2rem; }

/* Skeleton */
.skeleton { background: var(--bg-glass); border-radius: var(--radius-lg); animation: skeleton-pulse 1.5s ease-in-out infinite; }
.skeleton-card { aspect-ratio: 2/3; }
@keyframes skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

/* Animation delays */
.animate-fade-in-up { animation: fadeInUp 0.4s ease both; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1200px) { .grid-5 { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 960px)  { .grid-5, .grid-4 { grid-template-columns: repeat(3, 1fr); } .features-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .grid-5, .grid-4 { grid-template-columns: repeat(2, 1fr); } .features-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 400px)  { .grid-5, .grid-4 { grid-template-columns: 1fr; } }
</style>
