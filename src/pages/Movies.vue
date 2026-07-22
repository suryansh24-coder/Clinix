<template>
  <div class="movies-page">
    <div class="container">

      <!-- Page Header -->
      <div class="page-header animate-fade-in-up">
        <h1 class="page-title heading-display">
          Browse <span class="text-gradient">Movies</span>
        </h1>
        <p class="page-subtitle">{{ filteredMovies.length }} movies found</p>
      </div>

      <div class="movies-layout">

        <!-- ── Filter Sidebar ── -->
        <aside class="filter-sidebar glass-card">
          <div class="filter-header">
            <h3 class="filter-title">Filters</h3>
            <button class="btn-reset" @click="resetFilters">Reset All</button>
          </div>

          <!-- Search -->
          <div class="filter-group">
            <label class="filter-label">Search</label>
            <div class="search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Title, actor, director..."
                class="form-input search-field"
                @keyup.enter="void 0"
              />
              <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
            </div>
          </div>

          <!-- City Filter -->
          <div class="filter-group">
            <label class="filter-label">City</label>
            <select v-model="localSelectedCity" class="form-input">
              <option value="">All Cities</option>
              <option v-for="c in popularCityNames" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <!-- Sort By -->
          <div class="filter-group">
            <label class="filter-label">Sort By</label>
            <select v-model="sortBy" class="form-input">
              <option value="rating">⭐ Top Rated</option>
              <option value="releaseDate">📅 Latest First</option>
              <option value="title">🔤 Title A–Z</option>
              <option value="price">💰 Price: Low–High</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div class="filter-group">
            <label class="filter-label">Status</label>
            <div class="chip-group">
              <button class="filter-chip" :class="{ active: statusFilter === '' }" @click="statusFilter = ''">All</button>
              <button class="filter-chip" :class="{ active: statusFilter === 'now_showing' }" @click="statusFilter = 'now_showing'">Now Showing</button>
              <button class="filter-chip" :class="{ active: statusFilter === 'coming_soon' }" @click="statusFilter = 'coming_soon'">Coming Soon</button>
            </div>
          </div>

          <!-- Genre -->
          <div class="filter-group">
            <label class="filter-label">Genre</label>
            <div class="chip-group">
              <button class="filter-chip" :class="{ active: !selectedGenre }" @click="selectedGenre = ''">All</button>
              <button
                v-for="genre in allGenres"
                :key="genre"
                class="filter-chip"
                :class="{ active: selectedGenre === genre }"
                @click="selectedGenre = genre"
              >{{ genre }}</button>
            </div>
          </div>

          <!-- Language -->
          <div class="filter-group">
            <label class="filter-label">Language</label>
            <div class="chip-group">
              <button class="filter-chip" :class="{ active: !selectedLanguage }" @click="selectedLanguage = ''">All</button>
              <button
                v-for="lang in allLanguages"
                :key="lang"
                class="filter-chip"
                :class="{ active: selectedLanguage === lang }"
                @click="selectedLanguage = lang"
              >{{ lang }}</button>
            </div>
          </div>

          <!-- Min Rating -->
          <div class="filter-group">
            <label class="filter-label">Min Rating: <strong>{{ selectedRating > 0 ? selectedRating + '★' : 'Any' }}</strong></label>
            <input v-model.number="selectedRating" type="range" min="0" max="9" step="0.5" class="rating-slider" />
            <div class="slider-labels"><span>Any</span><span>9★</span></div>
          </div>
        </aside>

        <!-- ── Movie Grid ── -->
        <div class="movies-content">

          <!-- Active filter badges -->
          <div class="active-filters" v-if="hasActiveFilters">
            <span class="active-filter-badge" v-if="searchQuery">
              🔍 "{{ searchQuery }}" <button @click="searchQuery = ''">×</button>
            </span>
            <span class="active-filter-badge" v-if="selectedGenre">
              {{ selectedGenre }} <button @click="selectedGenre = ''">×</button>
            </span>
            <span class="active-filter-badge" v-if="selectedLanguage">
              {{ selectedLanguage }} <button @click="selectedLanguage = ''">×</button>
            </span>
            <span class="active-filter-badge" v-if="selectedRating > 0">
              {{ selectedRating }}★+ <button @click="selectedRating = 0">×</button>
            </span>
            <span class="active-filter-badge" v-if="statusFilter">
              {{ statusFilter === 'now_showing' ? 'Now Showing' : 'Coming Soon' }}
              <button @click="statusFilter = ''">×</button>
            </span>
            <span class="active-filter-badge" v-if="localSelectedCity">
              📍 {{ localSelectedCity }} <button @click="localSelectedCity = ''">×</button>
            </span>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="grid grid-4">
            <div v-for="n in 12" :key="n" class="skeleton skeleton-card"></div>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="state-message glass-card">
            <span>⚠️</span>
            <p>{{ error }}</p>
            <button class="btn btn-accent btn-sm" @click="fetchMovies">Retry</button>
          </div>

          <!-- No results -->
          <div v-else-if="displayMovies.length === 0" class="state-message glass-card">
            <span>🔍</span>
            <p>No movies match your filters.</p>
            <button class="btn btn-outline btn-sm" @click="resetFilters">Clear Filters</button>
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-4">
            <MovieCard
              v-for="(movie, i) in paginatedMovies"
              :key="movie.id"
              :movie="movie"
              class="animate-fade-in-up"
              :style="{ animationDelay: `${(i % 8) * 40}ms` }"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button class="page-arrow" @click="currentPage--" :disabled="currentPage === 1">←</button>
            <div class="page-numbers">
              <button
                v-for="p in visiblePages"
                :key="p"
                class="page-btn"
                :class="{ active: p === currentPage, ellipsis: p === '...' }"
                @click="p !== '...' && (currentPage = p)"
              >{{ p }}</button>
            </div>
            <button class="page-arrow" @click="currentPage++" :disabled="currentPage === totalPages">→</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MovieCard    from '@/components/movies/MovieCard.vue'
import { useMovies }  from '@/composables/useMovies'
import { useCity }    from '@/composables/useCity'

const route = useRoute()
const {
  movies, isLoading, error, fetchMovies,
  filteredMovies, allGenres, allLanguages, resetFilters,
  searchQuery, selectedGenre, selectedLanguage, selectedRating,
  selectedPriceRange, selectedCity, sortBy
} = useMovies()
const { popularCities } = useCity()

const popularCityNames = computed(() => popularCities.map(c => c.name))

// Local city ref (linked to composable)
const localSelectedCity = computed({
  get: () => selectedCity.value,
  set: v => { selectedCity.value = v }
})

const statusFilter = ref('')
const currentPage  = ref(1)
const PAGE_SIZE    = 16

// Apply status filter on top of composable filteredMovies
const displayMovies = computed(() => {
  if (!statusFilter.value) return filteredMovies.value
  return filteredMovies.value.filter(m => m.status === statusFilter.value)
})

const totalPages = computed(() => Math.ceil(displayMovies.value.length / PAGE_SIZE))

const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return displayMovies.value.slice(start, start + PAGE_SIZE)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur   = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

const hasActiveFilters = computed(() =>
  searchQuery.value || selectedGenre.value || selectedLanguage.value ||
  selectedRating.value > 0 || statusFilter.value || localSelectedCity.value
)

// Reset page when filters change
watch([searchQuery, selectedGenre, selectedLanguage, selectedRating, statusFilter, selectedCity], () => {
  currentPage.value = 1
})

// Read URL query params on mount
onMounted(async () => {
  await fetchMovies()
  if (route.query.search)   searchQuery.value    = route.query.search
  if (route.query.genre)    selectedGenre.value  = route.query.genre
  if (route.query.language) selectedLanguage.value = route.query.language
  if (route.query.status)   statusFilter.value   = route.query.status
})

function localResetFilters() {
  resetFilters()
  statusFilter.value   = ''
  currentPage.value    = 1
}
</script>

<style scoped>
.movies-page { padding: 2rem 0 var(--space-4xl); }
.page-header { margin-bottom: 2rem; }
.page-title { font-size: clamp(1.75rem, 4vw, 2.5rem); }
.page-subtitle { color: var(--text-muted); font-size: 0.9375rem; margin-top: 0.35rem; }

.movies-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;
}

/* ── Sidebar ─────────────────────────────────────────────── */
.filter-sidebar {
  padding: 1.5rem;
  position: sticky;
  top: 88px;
}
.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid var(--border-color);
}
.filter-title {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
}
.btn-reset {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
  transition: opacity 0.2s;
  background: none;
  border: none;
  padding: 0;
}
.btn-reset:hover { opacity: 0.75; }

.filter-group { margin-bottom: 1.25rem; }
.filter-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.625rem;
}
.search-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-input);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-muted);
}
.search-wrap:focus-within { border-color: var(--color-accent); }
.search-field {
  flex: 1; background: none; border: none; outline: none;
  color: var(--text-primary); font-size: 0.875rem; padding: 0;
}
.search-field::placeholder { color: var(--text-muted); }
.clear-btn { color: var(--text-muted); font-size: 0.75rem; cursor: pointer; padding: 0; background: none; border: none; }
.clear-btn:hover { color: var(--text-primary); }

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--bg-input);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: var(--font-body);
  outline: none;
  transition: border-color 0.2s;
}
.form-input:focus { border-color: var(--color-accent); }

/* Genre chips */
.chip-group { display: flex; flex-wrap: wrap; gap: 0.375rem; }
.filter-chip {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}
.filter-chip:hover { border-color: var(--color-accent); color: var(--color-accent); }
.filter-chip.active {
  background: rgba(0,212,255,0.12);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* Slider */
.rating-slider {
  width: 100%;
  accent-color: var(--color-accent);
  margin: 0.375rem 0;
  cursor: pointer;
}
.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* ── Movies Content ──────────────────────────────────────── */
.movies-content { min-height: 400px; }

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}
.active-filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 4px 10px;
  background: rgba(229,9,20,0.1);
  border: 1px solid rgba(229,9,20,0.3);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary);
}
.active-filter-badge button {
  background: none; border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1;
  padding: 0;
  font-weight: 700;
  margin-left: 2px;
}
.active-filter-badge button:hover { color: var(--color-primary-dark); }

.grid { display: grid; gap: 1.25rem; }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

.skeleton { background: var(--bg-glass); border-radius: var(--radius-lg); animation: skel 1.5s ease-in-out infinite; }
.skeleton-card { aspect-ratio: 2/3; }
@keyframes skel { 0%,100%{opacity:1} 50%{opacity:.5} }

.state-message {
  padding: 3rem;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
}
.state-message span { font-size: 2.5rem; }

/* ── Pagination ──────────────────────────────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2.5rem;
}
.page-arrow {
  width: 38px; height: 38px;
  border-radius: var(--radius-md);
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 1.125rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.page-arrow:hover:not(:disabled) { border-color: var(--color-accent); color: var(--color-accent); }
.page-arrow:disabled { opacity: 0.4; cursor: not-allowed; }
.page-numbers { display: flex; gap: 4px; }
.page-btn {
  width: 38px; height: 38px;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.page-btn:hover:not(.ellipsis) { border-color: var(--color-accent); color: var(--color-accent); }
.page-btn.active { background: var(--color-accent); border-color: var(--color-accent); color: #fff; font-weight: 700; }
.page-btn.ellipsis { cursor: default; border: none; background: none; }

.animate-fade-in-up { animation: fadeInUp 0.35s ease both; }
@keyframes fadeInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1100px) { .grid-4 { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 900px) {
  .movies-layout { grid-template-columns: 240px 1fr; }
  .grid-4 { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .movies-layout { grid-template-columns: 1fr; }
  .filter-sidebar { position: static; }
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 400px) { .grid-4 { grid-template-columns: 1fr; } }
</style>
