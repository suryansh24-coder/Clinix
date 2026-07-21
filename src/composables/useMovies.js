/* ============================================================
   useMovies.js — Movies Composable
   Provides reactive movie data, search, filtering, sorting,
   and CRUD operations for movie-related components.
   ============================================================ */

import { ref, computed, readonly } from 'vue'
import { moviesAPI, showsAPI, theatresAPI } from '@/services/api'
import authService from '@/services/auth'

/* ── useMovies Composable ────────────────────────────────── */
export function useMovies() {
  // ── Reactive State ──────────────────────────────────────
  const movies = ref([])
  const currentMovie = ref(null)
  const shows = ref([])
  const theatres = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // ── Filter & Search State ───────────────────────────────
  const searchQuery = ref('')
  const selectedGenre = ref('')
  const selectedLanguage = ref('')
  const selectedRating = ref(0)
  const selectedPriceRange = ref([0, 500])
  const sortBy = ref('rating') // rating, title, price, releaseDate

  // ── Computed: Extract unique genres from movie data ─────
  const allGenres = computed(() => {
    const genres = new Set()
    movies.value.forEach(movie => {
      if (Array.isArray(movie.genre)) {
        movie.genre.forEach(g => genres.add(g))
      }
    })
    return Array.from(genres).sort()
  })

  // ── Computed: Extract unique languages ─────────────────
  const allLanguages = computed(() => {
    const langs = new Set()
    movies.value.forEach(m => langs.add(m.language))
    return Array.from(langs).sort()
  })

  // ── Computed: Filtered & Sorted movies ────────────────
  const filteredMovies = computed(() => {
    let result = [...movies.value]

    // Search filter — matches title, genre, cast, director
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(q) ||
        (Array.isArray(movie.genre) && movie.genre.some(g => g.toLowerCase().includes(q))) ||
        (Array.isArray(movie.cast) && movie.cast.some(c => c.toLowerCase().includes(q))) ||
        (movie.director && movie.director.toLowerCase().includes(q))
      )
    }

    // Genre filter
    if (selectedGenre.value) {
      result = result.filter(movie =>
        Array.isArray(movie.genre) && movie.genre.includes(selectedGenre.value)
      )
    }

    // Language filter
    if (selectedLanguage.value) {
      result = result.filter(movie => movie.language === selectedLanguage.value)
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

    // Sort
    switch (sortBy.value) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'price':
        result.sort((a, b) => a.price - b.price)
        break
      case 'releaseDate':
        result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
        break
    }

    return result
  })

  // ── Computed: Now showing movies ──────────────────────
  const nowShowingMovies = computed(() =>
    movies.value.filter(m => m.status === 'now_showing')
  )

  // ── Computed: Coming soon movies ──────────────────────
  const comingSoonMovies = computed(() =>
    movies.value.filter(m => m.status === 'coming_soon')
  )

  // ── Computed: Trending (top rated now showing) ────────
  const trendingMovies = computed(() =>
    [...nowShowingMovies.value].sort((a, b) => b.rating - a.rating).slice(0, 5)
  )

  // ── CRUD: Fetch all movies ────────────────────────────
  async function fetchMovies() {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await moviesAPI.getAll()
      movies.value = data
    } catch (err) {
      error.value = err.message || 'Failed to fetch movies'
    } finally {
      isLoading.value = false
    }
  }

  // ── CRUD: Fetch single movie by ID ────────────────────
  async function fetchMovie(id) {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await moviesAPI.getById(id)
      currentMovie.value = data

      // Track recently viewed in LocalStorage
      authService.addRecentlyViewed(Number(id))

      return data
    } catch (err) {
      error.value = err.message || 'Movie not found'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ── CRUD: Create a movie ──────────────────────────────
  async function createMovie(movieData) {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await moviesAPI.create(movieData)
      movies.value.push(data)
      return data
    } catch (err) {
      error.value = err.message || 'Failed to create movie'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ── CRUD: Update a movie ──────────────────────────────
  async function updateMovie(id, movieData) {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await moviesAPI.update(id, movieData)
      const index = movies.value.findIndex(m => m.id === id)
      if (index !== -1) movies.value[index] = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to update movie'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ── CRUD: Delete a movie ──────────────────────────────
  async function deleteMovie(id) {
    isLoading.value = true
    error.value = null
    try {
      await moviesAPI.delete(id)
      movies.value = movies.value.filter(m => m.id !== id)
    } catch (err) {
      error.value = err.message || 'Failed to delete movie'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ── Fetch shows for a movie ───────────────────────────
  async function fetchShowsForMovie(movieId) {
    try {
      const { data } = await showsAPI.getAll({ movieId: Number(movieId) })
      shows.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch shows'
      return []
    }
  }

  // ── Fetch all theatres ────────────────────────────────
  async function fetchTheatres() {
    try {
      const { data } = await theatresAPI.getAll()
      theatres.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch theatres'
      return []
    }
  }

  // ── Reset all filters ────────────────────────────────
  function resetFilters() {
    searchQuery.value = ''
    selectedGenre.value = ''
    selectedLanguage.value = ''
    selectedRating.value = 0
    selectedPriceRange.value = [0, 500]
    sortBy.value = 'rating'
  }

  return {
    // State
    movies: readonly(movies),
    currentMovie: readonly(currentMovie),
    shows: readonly(shows),
    theatres: readonly(theatres),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Filter state (writable for two-way binding)
    searchQuery,
    selectedGenre,
    selectedLanguage,
    selectedRating,
    selectedPriceRange,
    sortBy,

    // Computed
    allGenres,
    allLanguages,
    filteredMovies,
    nowShowingMovies,
    comingSoonMovies,
    trendingMovies,

    // Methods
    fetchMovies,
    fetchMovie,
    createMovie,
    updateMovie,
    deleteMovie,
    fetchShowsForMovie,
    fetchTheatres,
    resetFilters
  }
}
