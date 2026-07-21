<!-- ============================================================
     Movies.vue — Movie Listing Page
     Grid of all movies with sidebar filters: genre, language,
     rating, price. Search, sort, and pagination included.
     Uses watchEffect to react to URL query params.
     ============================================================ -->
<template>
  <div class="movies-page">
    <div class="container">

      <!-- ── Page Header ── -->
      <div class="page-header animate-fade-in-up">
        <h1 class="page-title heading-display">Browse <span class="text-gradient">Movies</span></h1>
        <p class="page-subtitle">{{ filteredMovies.length }} movies found</p>
      </div>

      <div class="movies-layout">

        <!-- ── Filter Sidebar ── -->
        <aside class="filter-sidebar glass-card">
          <div class="filter-header">
            <h3 class="filter-title">Filters</h3>
            <button class="btn btn-ghost btn-sm" @click="resetFilters">Reset</button>
          </div>

          <!-- Search -->
          <div class="filter-group">
            <label class="form-label">Search</label>
            <div class="search-input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Title, genre, actor..."
                class="form-input search-field"
              />
            </div>
          </div>

          <!-- Sort By -->
          <div class="filter-group">
            <label class="form-label">Sort By</label>
            <select v-model="sortBy" class="form-input">
              <option value="rating">⭐ Top Rated</option>
              <option value="releaseDate">📅 Release Date</option>
              <option value="title">🔤 Title A–Z</option>
              <option value="price">💰 Price: Low–High</option>
            </select>
          </div>

          <!-- Genre -->
          <div class="filter-group">
            <label class="form-label">Genre</label>
            <div class="genre-chips">
              <button
                class="genre-chip"
                :class="{ active: !selectedGenre }"
                @click="selectedGenre = ''"
              >All</button>
              <button
                v-for="genre in allGenres"
                :key="genre"
                class="genre-chip"
                :class="{ active: selectedGenre === genre }"
                @click="selectedGenre = genre"
              >{{ genre }}</button>
            </div>
          </div>

          <!-- Language -->
          <div class="filter-group">
            <label class="form-label">Language</label>
            <div class="genre-chips">
              <button
                class="genre-chip"
                :class="{ active: !selectedLanguage }"
                @click="selectedLanguage = ''"
              >All</button>
              <button
                v-for="lang in allLanguages"
                :key="lang"
                class="genre-chip"
                :class="{ active: selectedLanguage === lang }"
                @click="selectedLanguage = lang"
              >{{ lang }}</button>
            </div>
          </div>

          <!-- Minimum Rating -->
          <div class="filter-group">
            <label class="form-label">Min Rating: {{ selectedRating > 0 ? selectedRating + '★' : 'Any' }}</label>
            <input
              v-model.number="selectedRating"
              type="range"
              min="0" max="9" step="0.5"
              class="rating-slider"
            />
            <div class="slider-labels">
              <span>Any</span>
              <span>9.0★</span>
            </div>
          </div>

          <!-- Status Filter -->
          <div class="filter-group">
            <label class="form-label">Status</label>
            <div class="genre-chips">
              <button class="genre-chip" :class="{ active: !statusFilter }" @click="statusFilter = ''">All</button>
              <button class="genre-chip" :class="{ active: statusFilter === 'now_showing' }" @click="statusFilter = 'now_showing'">Now Showing</button>
              <button class="genre-chip" :class="{ active: statusFilter === 'coming_soon' }" @click="statusFilter = 'coming_soon'">Coming Soon</button>
            </div>
          </div>
        </aside>

        <!-- ── Movie Grid ── -->
        <main class="movies-main">

          <!-- Active Filter Pills -->
          <div class="active-filters" v-if="hasActiveFilters">
            <span v-if="searchQuery" class="filter-pill">
              "{{ searchQuery }}" <button @click="searchQuery = ''">✕</button>
            </span>
            <span v-if="selectedGenre" class="filter-pill">
              {{ selectedGenre }} <button @click="selectedGenre = ''">✕</button>
            </span>
            <span v-if="selectedLanguage" class="filter-pill">
              {{ selectedLanguage }} <button @click="selectedLanguage = ''">✕</button>
            </span>
            <span v-if="selectedRating > 0" class="filter-pill">
              ≥ {{ selectedRating }}★ <button @click="selectedRating = 0">✕</button>
            </span>
            <span v-if="statusFilter" class="filter-pill">
              {{ statusFilter === 'now_showing' ? 'Now Showing' : 'Coming Soon' }}
              <button @click="statusFilter = ''">✕</button>
            </span>
          </div>

          <!-- Loading Skeleton -->
          <div v-if="isLoading" class="grid grid-3">
            <div v-for="n in 9" :key="n" class="skeleton skeleton-card"></div>
          </div>

          <!-- No Results -->
          <div v-else-if="displayMovies.length === 0" class="no-results glass-card">
            <span>🎬</span>
            <h3>No movies found</h3>
            <p>Try adjusting your filters or search term.</p>
            <button class="btn btn-accent" @click="resetFilters">Clear Filters</button>
          </div>

          <!-- Movies Grid -->
          <div v-else class="grid grid-3">
            <MovieCard
              v-for="movie in displayMovies"
              :key="movie.id"
              :movie="movie"
              class="animate-fade-in-up"
            />
          </div>

          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
            <button
              class="btn btn-ghost btn-sm"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >← Prev</button>

            <div class="page-numbers">
              <button
                v-for="p in totalPages"
                :key="p"
                class="page-btn"
                :class="{ active: p === currentPage }"
                @click="currentPage = p"
              >{{ p }}</button>
            </div>

            <button
              class="btn btn-ghost btn-sm"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >Next →</button>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
/* ── Imports ─────────────────────────────────────────────── */
import { ref, computed, onMounted, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useMovies } from '@/composables/useMovies'
import MovieCard from '@/components/movies/MovieCard.vue'

const route = useRoute()

// ── Composable ────────────────────────────────────────────
const {
  isLoading,
  allGenres,
  allLanguages,
  filteredMovies,
  searchQuery,
  selectedGenre,
  selectedLanguage,
  selectedRating,
  sortBy,
  fetchMovies,
  resetFilters
} = useMovies()

// ── Local filter state ────────────────────────────────────
const statusFilter = ref('')
const currentPage  = ref(1)
const PAGE_SIZE    = 9

// ── Computed: has any active filter ──────────────────────
const hasActiveFilters = computed(() =>
  !!(searchQuery.value || selectedGenre.value || selectedLanguage.value ||
     selectedRating.value > 0 || statusFilter.value)
)

// ── Computed: apply status filter on top of composable's filteredMovies
const statusFiltered = computed(() => {
  if (!statusFilter.value) return filteredMovies.value
  return filteredMovies.value.filter(m => m.status === statusFilter.value)
})

// ── Pagination ────────────────────────────────────────────
const totalPages = computed(() => Math.ceil(statusFiltered.value.length / PAGE_SIZE))

const displayMovies = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return statusFiltered.value.slice(start, start + PAGE_SIZE)
})

// Reset to page 1 whenever filters change
watch([searchQuery, selectedGenre, selectedLanguage, selectedRating, sortBy, statusFilter], () => {
  currentPage.value = 1
})

// ── Lifecycle: read URL params, then fetch ────────────────
// watchEffect: reacts to route.query changes automatically
watchEffect(() => {
  if (route.query.search)   searchQuery.value    = route.query.search
  if (route.query.genre)    selectedGenre.value  = route.query.genre
  if (route.query.language) selectedLanguage.value = route.query.language
  if (route.query.status)   statusFilter.value   = route.query.status
})

onMounted(() => {
  fetchMovies()
})
</script>

<style scoped>
.movies-page {
  padding: var(--space-2xl) 0 var(--space-4xl);
}

/* ── Page Header ─────────────────────────────────────────── */
.page-header {
  margin-bottom: var(--space-xl);
}
.page-title { font-size: var(--font-size-4xl); }
.page-subtitle { color: var(--text-muted); font-size: var(--font-size-sm); margin-top: 4px; }

/* ── Layout ──────────────────────────────────────────────── */
.movies-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-xl);
  align-items: start;
}

/* ── Sidebar ─────────────────────────────────────────────── */
.filter-sidebar {
  padding: var(--space-xl);
  position: sticky;
  top: 88px;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
}

.filter-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--font-size-lg);
}

.filter-group {
  margin-bottom: var(--space-xl);
}

.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-wrap svg {
  position: absolute;
  left: 0.875rem;
  color: var(--text-muted);
  pointer-events: none;
}

.search-field { padding-left: 2.5rem; }

/* Genre / Language chips */
.genre-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--space-sm);
}

.genre-chip {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background: var(--bg-glass);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.genre-chip:hover,
.genre-chip.active {
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* Rating Slider */
.rating-slider {
  width: 100%;
  margin-top: var(--space-sm);
  accent-color: var(--color-accent);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: 4px;
}

/* ── Active Filter Pills ─────────────────────────────────── */
.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--color-accent);
}

.filter-pill button {
  color: inherit;
  opacity: 0.7;
  font-size: 10px;
  padding: 0;
  line-height: 1;
}

.filter-pill button:hover { opacity: 1; }

/* ── No Results ──────────────────────────────────────────── */
.no-results {
  padding: var(--space-3xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.no-results span { font-size: 3rem; }
.no-results h3 { font-family: var(--font-display); font-size: var(--font-size-xl); }
.no-results p { color: var(--text-muted); }

/* ── Pagination ──────────────────────────────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin-top: var(--space-2xl);
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.page-btn.active,
.page-btn:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1024px) {
  .movies-layout { grid-template-columns: 240px 1fr; }
}

@media (max-width: 768px) {
  .movies-layout {
    grid-template-columns: 1fr;
  }

  .filter-sidebar {
    position: static;
  }
}
</style>
