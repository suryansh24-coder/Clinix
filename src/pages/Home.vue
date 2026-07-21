<!-- ============================================================
     Home.vue — Landing Page
     Hero carousel, trending movies, now showing, coming soon,
     category quick-filters with active state, scroll animations.
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
          :class="{ 'cat-chip-active': activeCategory === cat.label }"
          @click="handleCategory(cat)"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          {{ cat.label }}
        </button>
      </div>
    </section>

    <!-- ── Trending Movies ── -->
    <section class="section container scroll-reveal" ref="trendingRef">
      <div class="section-header">
        <div>
          <h2 class="section-title heading-display">
            🔥 <span class="text-gradient">Trending</span> Now
          </h2>
          <p class="section-subtitle">Top rated movies this week</p>
        </div>
        <router-link to="/movies" class="btn btn-outline btn-sm view-all-btn">View All →</router-link>
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
    <section class="section container scroll-reveal" ref="nowShowingRef">
      <div class="section-header">
        <div>
          <h2 class="section-title heading-display">
            🎬 <span class="text-gradient-primary">Now</span> Showing
          </h2>
          <p class="section-subtitle">Book tickets for movies currently in theatres</p>
        </div>
        <router-link to="/movies?status=now_showing" class="btn btn-outline btn-sm view-all-btn">See All →</router-link>
      </div>

      <!-- Skeleton -->
      <div v-if="isLoading" class="grid grid-4">
        <div v-for="n in 8" :key="n" class="skeleton skeleton-card"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state glass-card">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button class="btn btn-accent btn-sm" @click="fetchMovies">Retry</button>
      </div>

      <!-- Empty -->
      <div v-else-if="nowShowingMovies.length === 0" class="empty-state glass-card">
        <span>🎭</span>
        <p>No movies currently showing. Check back soon!</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-4">
        <MovieCard
          v-for="(movie, i) in nowShowingMovies.slice(0, 8)"
          :key="movie.id"
          :movie="movie"
          class="animate-fade-in-up"
          :class="`delay-${(i % 4) + 1}`"
        />
      </div>
    </section>

    <!-- ── Coming Soon ── -->
    <section class="coming-soon-strip scroll-reveal" v-if="!isLoading && comingSoonMovies.length" ref="comingSoonRef">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title heading-display">
              🚀 Coming <span class="text-gradient">Soon</span>
            </h2>
            <p class="section-subtitle">Mark your calendars</p>
          </div>
          <router-link to="/movies?status=coming_soon" class="btn btn-outline btn-sm view-all-btn">View All →</router-link>
        </div>
        <div class="grid grid-4">
          <MovieCard
            v-for="movie in comingSoonMovies.slice(0, 4)"
            :key="movie.id"
            :movie="movie"
            compact
          />
        </div>
      </div>
    </section>

    <!-- ── Features Row ── -->
    <section class="features-section container scroll-reveal" ref="featuresRef">
      <div class="features-grid">
        <div class="feature-card glass-card" v-for="(feat, i) in features" :key="feat.title"
          :style="`animation-delay: ${i * 0.1}s`">
          <span class="feature-icon">{{ feat.icon }}</span>
          <h3 class="feature-title">{{ feat.title }}</h3>
          <p class="feature-desc">{{ feat.desc }}</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovies } from '@/composables/useMovies'
import HeroCarousel from '@/components/movies/HeroCarousel.vue'
import MovieCard from '@/components/movies/MovieCard.vue'

const router = useRouter()

const {
  isLoading,
  error,
  trendingMovies,
  nowShowingMovies,
  comingSoonMovies,
  fetchMovies
} = useMovies()

// Active category chip
const activeCategory = ref('')

// Scroll-reveal refs
const trendingRef   = ref(null)
const nowShowingRef = ref(null)
const comingSoonRef = ref(null)
const featuresRef   = ref(null)

onMounted(() => {
  fetchMovies()
  setupScrollReveal()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

// ── Intersection Observer for scroll animations ────────────
let observer = null
function setupScrollReveal() {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  const sections = [trendingRef.value, nowShowingRef.value, comingSoonRef.value, featuresRef.value]
  sections.forEach(el => el && observer.observe(el))
}

// ── Category quick-filter shortcuts ─────────────────────
const categories = [
  { label: 'Action',   icon: '💥', query: { genre: 'Action' } },
  { label: 'Drama',    icon: '🎭', query: { genre: 'Drama' } },
  { label: 'Sci-Fi',   icon: '🚀', query: { genre: 'Sci-Fi' } },
  { label: 'Romance',  icon: '❤️', query: { genre: 'Romance' } },
  { label: 'Horror',   icon: '👻', query: { genre: 'Horror' } },
  { label: 'Comedy',   icon: '😄', query: { genre: 'Comedy' } },
  { label: 'Hindi',    icon: '🇮🇳', query: { language: 'Hindi' } },
  { label: 'Tamil',    icon: '🎶', query: { language: 'Tamil' } },
]

function handleCategory(cat) {
  activeCategory.value = activeCategory.value === cat.label ? '' : cat.label
  router.push({ name: 'Movies', query: cat.query })
}

// ── App feature highlights ───────────────────────────────
const features = [
  { icon: '🎟️', title: 'Easy Booking',    desc: 'Book tickets in under 60 seconds with our streamlined checkout.' },
  { icon: '💺', title: 'Seat Selection',  desc: 'Pick your perfect seat from an interactive theatre layout.' },
  { icon: '🔒', title: 'Secure Sessions', desc: 'Your bookings and account are protected at all times.' },
  { icon: '⚡', title: 'Instant Confirm', desc: 'Get instant booking confirmation with full details.' },
]
</script>

<style scoped>
.home-page {
  padding-bottom: var(--space-4xl);
}

/* ── Scroll Reveal ───────────────────────────────────────── */
.scroll-reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ── Category Chips ──────────────────────────────────────── */
.categories-section {
  padding: var(--space-xl) 0 var(--space-md);
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
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-base);
  white-space: nowrap;
  cursor: pointer;
}

.cat-chip:hover {
  background: var(--accent-chip-bg);
  color: var(--color-accent);
  border-color: var(--border-glow);
  transform: translateY(-2px);
  box-shadow: 0 4px 14px var(--accent-glow-sm);
}

.cat-chip:active {
  transform: translateY(0) scale(0.97);
}

.cat-chip-active {
  background: var(--gradient-accent) !important;
  color: #fff !important;
  border-color: transparent !important;
  box-shadow: 0 4px 16px rgba(0, 212, 255, 0.35) !important;
  transform: translateY(-2px);
}

.cat-icon { font-size: 1rem; }

/* ── Sections ────────────────────────────────────────────── */
.section {
  padding: var(--space-2xl) 0;
}

/* ── View All Button ─────────────────────────────────────── */
.view-all-btn {
  background: var(--bg-glass);
  transition: all var(--transition-base);
}
.view-all-btn:hover {
  background: var(--accent-chip-bg);
  border-color: var(--color-accent);
  color: var(--color-accent);
  transform: translateX(3px);
}

/* ── Coming Soon Strip ───────────────────────────────────── */
.coming-soon-strip {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: var(--space-2xl) 0;
  margin: var(--space-xl) 0;
}

/* ── Error / Empty States ────────────────────────────────── */
.error-state,
.empty-state {
  padding: var(--space-2xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}
.error-icon { font-size: 2rem; }
.empty-state span { font-size: 2.5rem; }
.empty-state p { color: var(--text-muted); }

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
  transition: all var(--transition-slow);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-accent);
  opacity: 0;
  transition: opacity var(--transition-base);
  border-radius: inherit;
}

.feature-card:hover::before { opacity: 0.04; }

.feature-card:hover {
  transform: translateY(-6px);
  border-color: var(--border-glow);
  box-shadow: var(--shadow-glow);
}

.feature-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: var(--space-md);
  transition: transform var(--transition-spring);
}

.feature-card:hover .feature-icon {
  transform: scale(1.15) rotate(-4deg);
}

.feature-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
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
