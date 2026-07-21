/* ============================================================
   api.js — Centralized Axios Service Layer
   All HTTP requests to JSON Server go through this module.
   Provides GET, POST, PUT, PATCH, DELETE with error handling.
   ============================================================ */

import axios from 'axios'

// Create Axios instance with base configuration.
// Uses relative '/api' path so requests go through Vite's dev-server proxy
// (configured in vite.config.js: /api → http://localhost:3000).
// For production builds, set VITE_API_BASE_URL to the deployed JSON Server URL.
// Always use the Vite dev-server proxy (/api → localhost:3000).
// Using an absolute URL like http://localhost:3000 breaks in Replit
// because the browser cannot reach localhost directly through the proxy.
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// ── Request Interceptor ─────────────────────────────────
// Attaches any required headers before each request
api.interceptors.request.use(
  (config) => {
    // Could add auth token here if using token-based auth
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ── Response Interceptor ────────────────────────────────
// Centralised error handling for all API responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Construct a user-friendly error object
    const customError = {
      message: 'An unexpected error occurred',
      status: null,
      data: null
    }

    if (error.response) {
      // Server responded with an error status
      customError.status = error.response.status
      customError.data = error.response.data

      switch (error.response.status) {
        case 400:
          customError.message = 'Bad request. Please check your input.'
          break
        case 404:
          customError.message = 'The requested resource was not found.'
          break
        case 409:
          customError.message = 'A conflict occurred. The resource may already exist.'
          break
        case 500:
          customError.message = 'Internal server error. Please try again later.'
          break
        default:
          customError.message = `Server error (${error.response.status})`
      }
    } else if (error.request) {
      // Request was made but no response received (network failure)
      customError.message = 'Network error. Please check if JSON Server is running on port 3000.'
      customError.status = 0
    }

    return Promise.reject(customError)
  }
)

/* ── API Service Methods ─────────────────────────────────
   Each method wraps Axios calls with async/await pattern.
   These are the CRUD operations used throughout the app.
   ───────────────────────────────────────────────────────── */

// ── Movies API ──────────────────────────────────────────
export const moviesAPI = {
  // GET: Fetch all movies with optional query parameters
  getAll: (params = {}) => api.get('/movies', { params }),

  // GET: Fetch single movie by ID
  getById: (id) => api.get(`/movies/${id}`),

  // POST: Create a new movie
  create: (movieData) => api.post('/movies', movieData),

  // PUT: Replace entire movie record
  update: (id, movieData) => api.put(`/movies/${id}`, movieData),

  // PATCH: Partially update a movie
  patch: (id, movieData) => api.patch(`/movies/${id}`, movieData),

  // DELETE: Remove a movie
  delete: (id) => api.delete(`/movies/${id}`)
}

// ── Users API ───────────────────────────────────────────
export const usersAPI = {
  // GET: Fetch all users (used for auth validation)
  getAll: (params = {}) => api.get('/users', { params }),

  // GET: Fetch single user by ID
  getById: (id) => api.get(`/users/${id}`),

  // POST: Register a new user
  create: (userData) => api.post('/users', userData),

  // PUT: Update user profile
  update: (id, userData) => api.put(`/users/${id}`, userData),

  // PATCH: Partially update user
  patch: (id, userData) => api.patch(`/users/${id}`, userData)
}

// ── Bookings API ────────────────────────────────────────
export const bookingsAPI = {
  // GET: Fetch all bookings (optionally filter by userId)
  getAll: (params = {}) => api.get('/bookings', { params }),

  // GET: Fetch single booking
  getById: (id) => api.get(`/bookings/${id}`),

  // POST: Create a new booking
  create: (bookingData) => api.post('/bookings', bookingData),

  // PUT: Update a booking
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),

  // PATCH: Partially update (e.g., cancel booking)
  patch: (id, bookingData) => api.patch(`/bookings/${id}`, bookingData),

  // DELETE: Remove a booking
  delete: (id) => api.delete(`/bookings/${id}`)
}

// ── Theatres API ────────────────────────────────────────
export const theatresAPI = {
  getAll: (params = {}) => api.get('/theatres', { params }),
  getById: (id) => api.get(`/theatres/${id}`)
}

// ── Shows API ───────────────────────────────────────────
export const showsAPI = {
  getAll: (params = {}) => api.get('/shows', { params }),
  getById: (id) => api.get(`/shows/${id}`),
  patch: (id, data) => api.patch(`/shows/${id}`, data)
}

// ── Seats API ───────────────────────────────────────────
export const seatsAPI = {
  getAll: (params = {}) => api.get('/seats', { params }),
  create: (seatData) => api.post('/seats', seatData),
  patch: (id, data) => api.patch(`/seats/${id}`, data)
}

// Export default Axios instance for custom requests
export default api
