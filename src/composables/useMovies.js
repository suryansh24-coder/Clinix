/* ============================================================
   useMovies.js — Movies Composable
   Supports cast as string[] OR object[] {name,role,image}
   ============================================================ */

import { ref, computed, readonly } from 'vue'
import { moviesAPI, showsAPI, theatresAPI } from '@/services/api'
import authService from '@/services/auth'

export function useMovies() {
  // ── Reactive State ──────────────────────────────────────
  const movies        = ref([])
  const currentMovie  = ref(null)
  const shows         = ref([])
  const theatres      = ref([])
  const isLoading     = ref(false)
  const error         = ref(null)

  // ── Filter State ────────────────────────────────────────
  const searchQuery        = ref('')
  const selectedGenre      = ref('')
  const selectedLanguage   = ref('')
  const selectedRating     = ref(0)
  const selectedPriceRange = ref([0, 500])
  const selectedCity       = ref('')
  const sortBy             = ref('rating')

  // ── Helper: get cast member name regardless of format ───
  function castName(member) {
    if (typeof member === 'string') return member
    return member?.name || ''
  }

  // ── Computed: Unique genres ──────────────────────────────
  const allGenres = computed(() => {
    const genres = new Set()
    movies.value.forEach(movie => {
      if (Array.isArray(movie.genre)) movie.genre.forEach(g => genres.add(g))
    })
    return Array.from(genres).sort()
  })

  // ── Computed: Unique languages ───────────────────────────
  const allLanguages = computed(() => {
    const langs = new Set()
    movies.value.forEach(m => {
      // Normalize "Telugu/Hindi" → just list both
      const raw = m.language || ''
      raw.split('/').forEach(l => langs.add(l.trim()))
    })
    return Array.from(langs).sort()
  })

  // ── Computed: Filtered & Sorted movies ──────────────────
  const filteredMovies = computed(() => {
    let result = [...movies.value]

    // Search filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(movie =>
        movie.title?.toLowerCase().includes(q) ||
        (Array.isArray(movie.genre) && movie.genre.some(g => g.toLowerCase().includes(q))) ||
        (Array.isArray(movie.cast) && movie.cast.some(c => castName(c).toLowerCase().includes(q))) ||
        (movie.director && movie.director.toLowerCase().includes(q))
      )
    }

    // Genre filter
    if (selectedGenre.value) {
      result = result.filter(movie =>
        Array.isArray(movie.genre) && movie.genre.includes(selectedGenre.value)
      )
    }

    // Language filter (partial match for combined languages like "Telugu/Hindi")
    if (selectedLanguage.value) {
      result = result.filter(movie =>
        (movie.language || '').includes(selectedLanguage.value)
      )
    }

    // Rating filter
    if (selectedRating.value > 0) {
      result = result.filter(movie => movie.rating >= selectedRating.value)
    }

    // Price filter
    if (selectedPriceRange.value[1] < 500) {
      result = result.filter(movie =>
        movie.price >= selectedPriceRange.value[0] &&
        movie.price <= selectedPriceRange.value[1]
      )
    }

    // City filter
    if (selectedCity.value) {
      result = result.filter(movie =>
        !Array.isArray(movie.cities) || movie.cities.includes(selectedCity.value)
      )
    }

    // Sort
    switch (sortBy.value) {
      case 'rating':     result.sort((a, b) => b.rating - a.rating); break
      case 'title':      result.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'price':      result.sort((a, b) => a.price - b.price); break
      case 'releaseDate':result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)); break
    }

    return result
  })

  // ── Computed: Status subsets ─────────────────────────────
  const nowShowingMovies = computed(() =>
    movies.value.filter(m => m.status === 'now_showing')
  )
  const comingSoonMovies = computed(() =>
    movies.value.filter(m => m.status === 'coming_soon')
  )
  const trendingMovies = computed(() =>
    movies.value
      .filter(m => m.status === 'now_showing')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
  )

  // ── Fetch all movies ─────────────────────────────────────
  async function fetchMovies() {
    isLoading.value = true
    error.value = null
    try {
      const response = await moviesAPI.getAll()
      movies.value = Array.isArray(response.data) ? response.data : []
    } catch (err) {
      error.value = err?.message || 'Failed to load movies'
      movies.value = []
    } finally {
      isLoading.value = false
    }
  }

  // ── Fetch single movie ───────────────────────────────────
  async function fetchMovie(id) {
    isLoading.value = true
    error.value = null
    currentMovie.value = null
    try {
      const response = await moviesAPI.getById(id)
      currentMovie.value = response.data || null
    } catch (err) {
      error.value = err?.message || 'Movie not found'
    } finally {
      isLoading.value = false
    }
  }

  // ── Fetch shows for a movie ──────────────────────────────
  async function fetchShowsForMovie(movieId) {
    try {
      const [showsRes, theatresRes] = await Promise.all([
        showsAPI.getByMovie(movieId),
        theatresAPI.getAll()
      ])
      shows.value     = Array.isArray(showsRes.data)     ? showsRes.data     : []
      theatres.value  = Array.isArray(theatresRes.data)  ? theatresRes.data  : []
    } catch {
      shows.value    = []
      theatres.value = []
    }
  }

  // ── Fetch all theatres ───────────────────────────────────
  async function fetchTheatres() {
    try {
      const response = await theatresAPI.getAll()
      theatres.value = Array.isArray(response.data) ? response.data : []
    } catch {
      theatres.value = []
    }
  }

  // ── CRUD (admin) ─────────────────────────────────────────
  async function createMovie(data) {
    try {
      const response = await moviesAPI.create(data)
      movies.value.push(response.data)
      return response.data
    } catch (err) {
      throw err
    }
  }

  async function updateMovie(id, data) {
    try {
      const response = await moviesAPI.update(id, data)
      const idx = movies.value.findIndex(m => m.id === id)
      if (idx !== -1) movies.value[idx] = response.data
      return response.data
    } catch (err) {
      throw err
    }
  }

  async function deleteMovie(id) {
    try {
      await moviesAPI.delete(id)
      movies.value = movies.value.filter(m => m.id !== id)
    } catch (err) {
      throw err
    }
  }

  // ── Reset filters ────────────────────────────────────────
  function resetFilters() {
    searchQuery.value       = ''
    selectedGenre.value     = ''
    selectedLanguage.value  = ''
    selectedRating.value    = 0
    selectedPriceRange.value= [0, 500]
    selectedCity.value      = ''
    sortBy.value            = 'rating'
  }

  return {
    // State (read-only refs)
    movies:       readonly(movies),
    currentMovie: readonly(currentMovie),
    shows:        readonly(shows),
    theatres:     readonly(theatres),
    isLoading:    readonly(isLoading),
    error:        readonly(error),

    // Filter state (writable)
    searchQuery, selectedGenre, selectedLanguage,
    selectedRating, selectedPriceRange, selectedCity, sortBy,

    // Computed
    allGenres, allLanguages,
    filteredMovies, nowShowingMovies, comingSoonMovies, trendingMovies,

    // Methods
    fetchMovies, fetchMovie, createMovie, updateMovie, deleteMovie,
    fetchShowsForMovie, fetchTheatres, resetFilters,

    // Helpers
    castName
  }
}
