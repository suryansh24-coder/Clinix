<!-- ============================================================
     HeroCarousel.vue — Featured Movies Hero Banner
     Auto-rotating carousel with large banners, movie info,
     gradient overlays, and call-to-action buttons.
     ============================================================ -->
<template>
  <section class="hero-section">
    <div class="hero-carousel" v-if="movies.length">
      <!-- Current Slide -->
      <transition name="hero-fade" mode="out-in">
        <div class="hero-slide" :key="currentIndex">
          <!-- Background Banner Image -->
          <div class="hero-bg">
            <img :src="currentMovie.banner" :alt="currentMovie.title" />
            <div class="hero-gradient"></div>
          </div>

          <!-- Hero Content -->
          <div class="container hero-content">
            <div class="hero-info animate-fade-in-up">
              <!-- Badges -->
              <div class="hero-badges">
                <span class="badge badge-primary">{{ currentMovie.certificate || 'UA' }}</span>
                <span class="badge badge-accent">{{ currentMovie.language }}</span>
                <span v-if="currentMovie.status === 'now_showing'" class="badge badge-green">
                  Now Showing
                </span>
              </div>

              <!-- Title -->
              <h1 class="hero-title heading-display">{{ currentMovie.title }}</h1>

              <!-- Meta -->
              <div class="hero-meta">
                <span class="hero-rating">
                  <span class="star">★</span> {{ currentMovie.rating }}/10
                </span>
                <span class="hero-dot">•</span>
                <span>{{ currentMovie.duration }}</span>
                <span class="hero-dot">•</span>
                <span>{{ genreText }}</span>
              </div>

              <!-- Description -->
              <p class="hero-desc">{{ currentMovie.description }}</p>

              <!-- Actions -->
              <div class="hero-actions">
                <router-link
                  :to="{ name: 'MovieDetails', params: { id: currentMovie.id } }"
                  class="btn btn-primary btn-lg"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="M22 10V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 110 4v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 110-4z"/></svg>
                  Book Tickets
                </router-link>
                <router-link
                  :to="{ name: 'MovieDetails', params: { id: currentMovie.id } }"
                  class="btn btn-ghost btn-lg"
                >
                  More Info →
                </router-link>
              </div>
            </div>

            <!-- Poster (visible on desktop) -->
            <div class="hero-poster animate-scale-in">
              <img :src="currentMovie.poster" :alt="currentMovie.title" />
            </div>
          </div>
        </div>
      </transition>

      <!-- Carousel Indicators -->
      <div class="hero-indicators">
        <button
          v-for="(movie, index) in movies"
          :key="movie.id"
          class="indicator"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
          :aria-label="`Go to slide ${index + 1}`"
        ></button>
      </div>

      <!-- Navigation Arrows -->
      <button class="hero-arrow hero-arrow-left" @click="prevSlide" aria-label="Previous slide">
        ‹
      </button>
      <button class="hero-arrow hero-arrow-right" @click="nextSlide" aria-label="Next slide">
        ›
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

/* ── Props ───────────────────────────────────────────────── */
const props = defineProps({
  movies: { type: Array, default: () => [] }
})

// ── State ─────────────────────────────────────────────────
const currentIndex = ref(0)
let autoPlayTimer = null

// ── Computed ──────────────────────────────────────────────
const currentMovie = computed(() => props.movies[currentIndex.value] || {})

const genreText = computed(() => {
  if (Array.isArray(currentMovie.value.genre)) {
    return currentMovie.value.genre.join(' / ')
  }
  return ''
})

// ── Navigation Methods ────────────────────────────────────
function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % props.movies.length
  resetAutoPlay()
}

function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + props.movies.length) % props.movies.length
  resetAutoPlay()
}

function goToSlide(index) {
  currentIndex.value = index
  resetAutoPlay()
}

// ── Auto-play (changes slide every 6 seconds) ────────────
function startAutoPlay() {
  autoPlayTimer = setInterval(nextSlide, 6000)
}

function resetAutoPlay() {
  clearInterval(autoPlayTimer)
  startAutoPlay()
}

// ── Lifecycle: Start/stop auto-play ─────────────────────
onMounted(() => {
  if (props.movies.length > 1) startAutoPlay()
})

onUnmounted(() => {
  clearInterval(autoPlayTimer)
})
</script>

<style scoped>
.hero-section {
  position: relative;
  margin-top: -72px; /* Overlap navbar for immersive effect */
}

.hero-carousel {
  position: relative;
  overflow: hidden;
}

.hero-slide {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
}

/* ── Background ──────────────────────────────────────────── */
.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgba(10, 10, 26, 0.98) 0%, rgba(10, 10, 26, 0.8) 40%, rgba(10, 10, 26, 0.3) 70%, rgba(10, 10, 26, 0.6) 100%),
    linear-gradient(to top, rgba(10, 10, 26, 1) 0%, transparent 40%);
}

/* ── Content ─────────────────────────────────────────────── */
.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3xl);
  padding-top: 100px;
  padding-bottom: var(--space-3xl);
}

.hero-info {
  flex: 1;
  max-width: 600px;
}

.hero-badges {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
}

.hero-title {
  font-size: var(--font-size-5xl);
  margin-bottom: var(--space-md);
  color: #ffffff;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
}

.hero-rating {
  color: var(--color-gold);
  font-weight: 700;
}

.star { font-size: 0.9em; }
.hero-dot { opacity: 0.3; }

.hero-desc {
  color: rgba(255, 255, 255, 0.85);
  font-size: var(--font-size-base);
  line-height: 1.7;
  margin-bottom: var(--space-xl);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hero-actions {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

/* ── Poster ──────────────────────────────────────────────── */
.hero-poster {
  flex-shrink: 0;
  width: 280px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.hero-poster img {
  width: 100%;
  height: auto;
  display: block;
}

/* ── Indicators ──────────────────────────────────────────── */
.hero-indicators {
  position: absolute;
  bottom: var(--space-2xl);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--space-sm);
  z-index: 5;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.3);
  border: none;
  padding: 0;
  transition: all var(--transition-base);
}

.indicator.active {
  background: var(--color-accent);
  width: 32px;
  box-shadow: 0 0 10px var(--color-accent);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.6);
}

/* ── Arrows ──────────────────────────────────────────────── */
.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  font-size: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--transition-base);
  opacity: 0;
}

.hero-carousel:hover .hero-arrow {
  opacity: 1;
}

.hero-arrow:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-50%) scale(1.1);
}

.hero-arrow-left { left: var(--space-lg); }
.hero-arrow-right { right: var(--space-lg); }

/* ── Slide Transition ────────────────────────────────────── */
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 0.6s ease;
}
.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1024px) {
  .hero-poster { width: 220px; }
  .hero-title { font-size: var(--font-size-4xl); }
}

@media (max-width: 768px) {
  .hero-slide { min-height: 75vh; }
  .hero-poster { display: none; }
  .hero-title { font-size: var(--font-size-3xl); }
  .hero-content { padding-top: 120px; }
  .hero-arrow { display: none; }
}

@media (max-width: 480px) {
  .hero-title { font-size: var(--font-size-2xl); }
  .hero-slide { min-height: 70vh; }
}
</style>
