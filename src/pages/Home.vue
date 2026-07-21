<!-- ============================================================
     Home.vue — Landing Page
     Features hero carousel, trending movies, now showing,
     coming soon sections, and category quick-filters.
     Uses onMounted lifecycle hook to fetch data.
     ============================================================ -->
<template>
  <div class="home-page">

    <!-- ── Hero Carousel ── -->
    <HeroCarousel :movies="trendingMovies" />

    <!-- ── Quick Category Filters ── -->
    <section class="categories-section container">
      <div class="categories-row">
        <button
          v-for="cat in categories"
          :key="cat.label"
          class="cat-chip"
          @click="goToMovies(cat.query)"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          {{ cat.label }}
        </button>
      </div>
    </section>

    <!-- ── Trending Movies ── -->
    <section class="section container">
      <div class="section-header">
        <div>
          <h2 class="section-title heading-display">
            🔥 <span class="text-gradient">Trending</span> Now
          </h2>
          <p class="section-subtitle">Top rated movies this week</p>
        </div>
        <router-link to="/movies" class="btn btn-outline btn-sm">View All →</router-link>
      </div>

      <!-- Skeleton Loader -->
      <div v-if="isLoading" class="grid grid-5">
        <div v-for="n in 5" :key="n" class="skeleton skeleton-card"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state glass-card">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button class="btn btn-accent btn-sm" @click="fetchMovies">Retry</button>
      </div>

      <!-- Movie Grid -->
      <div v-else class="grid grid-5">
        <MovieCard
          v-for="(movie, i) in trendingMovies.slice(0, 5)"
          :key="movie.id"
          :movie="movie"
          class="animate-fade-in-up"
          :class="`delay-${i + 1}`"
        />
      </div>
    </section>

    <!-- ── Now Showing ── -->
    <section class="section container">
      <div class="section-header">
        <div>
          <h2 class="section-title heading-display">
            🎬 <span class="text-gradient-primary">Now</span> Showing
          </h2>
          <p class="section-subtitle">Book tickets for movies currently in theatres</p>
        </div>
        <router-link to="/movies" class="btn btn-outline btn-sm">See All →</router-link>
      </div>

      <div v-if="!isLoading" class="grid grid-4">
        <MovieCard
          v-for="movie in nowShowingMovies.slice(0, 8)"
          :key="movie.id"
          :movie="movie"
        />
      </div>
    </section>

    <!-- ── Coming Soon Banner Strip ── -->
    <section class="coming-soon-strip" v-if="comingSoonMovies.length">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title heading-display">
              🚀 Coming <span class="text-gradient">Soon</span>
            </h2>
            <p class="section-subtitle">Mark your calendars</p>
          </div>
        </div>
        <div class="grid grid-4">
          <MovieCard
            v-for="movie in comingSoonMovies"
            :key="movie.id"
            :movie="movie"
            compact
          />
        </div>
      </div>
    </section>

    <!-- ── Features Row ── -->
    <section class="features-section container">
      <div class="features-grid">
        <div class="feature-card glass-card" v-for="feat in features" :key="feat.title">
          <span class="feature-icon">{{ feat.icon }}</span>
          <h3 class="feature-title">{{ feat.title }}</h3>
          <p class="feature-desc">{{ feat.desc }}</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
/* ── Imports ─────────────────────────────────────────────── */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovies } from '@/composables/useMovies'
import HeroCarousel from '@/components/movies/HeroCarousel.vue'
import MovieCard from '@/components/movies/MovieCard.vue'

const router = useRouter()

// ── Composable — reactive movie data ────────────────────
const {
  isLoading,
  error,
  trendingMovies,
  nowShowingMovies,
  comingSoonMovies,
  fetchMovies
} = useMovies()

// ── Lifecycle: fetch movies when page mounts ─────────────
onMounted(() => {
  fetchMovies()
})

// ── Category quick-filter shortcuts ─────────────────────
const categories = [
  { label: 'Action',    icon: '💥', query: { genre: 'Action' } },
  { label: 'Drama',     icon: '🎭', query: { genre: 'Drama' } },
  { label: 'Sci-Fi',   icon: '🚀', query: { genre: 'Sci-Fi' } },
  { label: 'Romance',  icon: '❤️',  query: { genre: 'Romance' } },
  { label: 'Horror',   icon: '👻', query: { genre: 'Horror' } },
  { label: 'Comedy',   icon: '😄', query: { genre: 'Comedy' } },
  { label: 'Hindi',    icon: '🇮🇳', query: { language: 'Hindi' } },
  { label: 'Tamil',    icon: '🎶', query: { language: 'Tamil' } },
]

// ── App feature highlights ───────────────────────────────
const features = [
  { icon: '🎟️', title: 'Easy Booking',     desc: 'Book tickets in under 60 seconds with our streamlined checkout.' },
  { icon: '💺', title: 'Seat Selection',   desc: 'Pick your perfect seat from an interactive theatre layout.' },
  { icon: '🔒', title: 'Secure Sessions',  desc: 'Your bookings and account are protected at all times.' },
  { icon: '⚡', title: 'Instant Confirm',  desc: 'Get instant booking confirmation with full details.' },
]

// ── Navigate to /movies with pre-applied filters ─────────
function goToMovies(query) {
  router.push({ name: 'Movies', query })
}
</script>

<style scoped>
.home-page {
  padding-bottom: var(--space-4xl);
}

/* ── Category Chips ──────────────────────────────────────── */
.categories-section {
  padding: var(--space-xl) 0;
}

.categories-row {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.5rem 1.1rem;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.cat-chip:hover {
  background: var(--bg-glass-hover);
  color: var(--color-accent);
  border-color: var(--border-glow);
  transform: translateY(-2px);
}

.cat-icon { font-size: 1rem; }

/* ── Sections ────────────────────────────────────────────── */
.section {
  padding: var(--space-2xl) 0;
}

/* ── Coming Soon Strip ───────────────────────────────────── */
.coming-soon-strip {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: var(--space-2xl) 0;
  margin: var(--space-xl) 0;
}

/* ── Error State ─────────────────────────────────────────── */
.error-state {
  padding: var(--space-2xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}
.error-icon { font-size: 2rem; }

/* ── Features ────────────────────────────────────────────── */
.features-section {
  padding: var(--space-3xl) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

.feature-card {
  padding: var(--space-xl);
  text-align: center;
}

.feature-icon { font-size: 2.5rem; display: block; margin-bottom: var(--space-md); }

.feature-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.feature-desc {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .features-grid { grid-template-columns: 1fr; }
}
</style>
