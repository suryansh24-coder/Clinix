/* ============================================================
   auth.js — Authentication Service using LocalStorage
   Handles user registration, login, logout, and session
   management entirely through LocalStorage.
   No JWT, no external auth providers.
   ============================================================ */

import { usersAPI } from './api'

// LocalStorage keys used for session management
const STORAGE_KEYS = {
  CURRENT_USER: 'cinevault_current_user',
  SESSION: 'cinevault_session',
  THEME: 'cinevault_theme',
  RECENTLY_VIEWED: 'cinevault_recently_viewed',
  BOOKING_DRAFT: 'cinevault_booking_draft'
}

/* ── Helper: Safe JSON parse from LocalStorage ──────────── */
function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

/* ── Helper: Save to LocalStorage ───────────────────────── */
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage might be full or unavailable
  }
}

/* ── Helper: Remove from LocalStorage ───────────────────── */
function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore removal errors
  }
}

/* ── Authentication Service ──────────────────────────────── */
const authService = {

  /**
   * Register a new user
   * - Checks for duplicate email in JSON Server
   * - Creates user record via API
   * - Automatically logs in after registration
   * @param {Object} userData - { name, email, password, phone }
   * @returns {Object} registered user data
   * @throws {Object} error with message
   */
  async register(userData) {
    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      throw { message: 'Name, email, and password are required.' }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      throw { message: 'Please enter a valid email address.' }
    }

    // Validate password length
    if (userData.password.length < 6) {
      throw { message: 'Password must be at least 6 characters.' }
    }

    try {
      // Check for duplicate email by querying JSON Server
      const { data: existingUsers } = await usersAPI.getAll({ email: userData.email })

      if (existingUsers.length > 0) {
        throw { message: 'An account with this email already exists.' }
      }

      // Create user in JSON Server database
      const newUser = {
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: userData.password, // Stored as-is (academic project)
        phone: userData.phone || '',
        avatar: '',
        createdAt: new Date().toISOString()
      }

      const { data: createdUser } = await usersAPI.create(newUser)

      // Auto-login after successful registration
      const sessionUser = { ...createdUser }
      delete sessionUser.password // Don't store password in session

      // Save user session to LocalStorage
      saveToStorage(STORAGE_KEYS.CURRENT_USER, sessionUser)
      saveToStorage(STORAGE_KEYS.SESSION, {
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      })

      return sessionUser
    } catch (error) {
      // Re-throw custom errors, wrap API errors
      if (error.message) throw error
      throw { message: 'Registration failed. Please try again.' }
    }
  },

  /**
   * Login an existing user
   * - Validates credentials against JSON Server data
   * - Saves session to LocalStorage
   * @param {string} email
   * @param {string} password
   * @returns {Object} user data
   * @throws {Object} error with message
   */
  async login(email, password) {
    // Validate inputs
    if (!email || !password) {
      throw { message: 'Email and password are required.' }
    }

    try {
      // Query JSON Server for user with matching email
      const { data: users } = await usersAPI.getAll({ email: email.toLowerCase() })

      if (users.length === 0) {
        throw { message: 'No account found with this email.' }
      }

      const user = users[0]

      // Validate password (plain text comparison for academic project)
      if (user.password !== password) {
        throw { message: 'Incorrect password. Please try again.' }
      }

      // Create session — exclude password from stored data
      const sessionUser = { ...user }
      delete sessionUser.password

      // Persist login session in LocalStorage
      saveToStorage(STORAGE_KEYS.CURRENT_USER, sessionUser)
      saveToStorage(STORAGE_KEYS.SESSION, {
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      })

      return sessionUser
    } catch (error) {
      if (error.message) throw error
      throw { message: 'Login failed. Please check if the server is running.' }
    }
  },

  /**
   * Logout the current user
   * Clears all session data from LocalStorage
   */
  logout() {
    removeFromStorage(STORAGE_KEYS.CURRENT_USER)
    removeFromStorage(STORAGE_KEYS.SESSION)
    removeFromStorage(STORAGE_KEYS.BOOKING_DRAFT)
  },

  /**
   * Get the currently logged-in user from LocalStorage
   * Used for session persistence across page refreshes
   * @returns {Object|null} user data or null
   */
  getCurrentUser() {
    const session = getFromStorage(STORAGE_KEYS.SESSION)
    if (session && session.isLoggedIn) {
      return getFromStorage(STORAGE_KEYS.CURRENT_USER)
    }
    return null
  },

  /**
   * Check if a user is currently authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const session = getFromStorage(STORAGE_KEYS.SESSION)
    return !!(session && session.isLoggedIn)
  },

  /**
   * Update user profile
   * - Updates in JSON Server and LocalStorage
   * @param {number} userId
   * @param {Object} updates
   * @returns {Object} updated user
   */
  async updateProfile(userId, updates) {
    try {
      const { data: updatedUser } = await usersAPI.patch(userId, updates)
      const sessionUser = { ...updatedUser }
      delete sessionUser.password
      saveToStorage(STORAGE_KEYS.CURRENT_USER, sessionUser)
      return sessionUser
    } catch (error) {
      throw { message: 'Failed to update profile.' }
    }
  },

  // ── LocalStorage Helpers for App State ─────────────────

  /** Save/Get theme preference */
  getTheme() { return getFromStorage(STORAGE_KEYS.THEME) || 'dark' },
  setTheme(theme) { saveToStorage(STORAGE_KEYS.THEME, theme) },

  /** Save/Get recently viewed movies */
  getRecentlyViewed() { return getFromStorage(STORAGE_KEYS.RECENTLY_VIEWED) || [] },
  addRecentlyViewed(movieId) {
    const recent = this.getRecentlyViewed()
    // Remove if already exists, add to front, keep max 10
    const filtered = recent.filter(id => id !== movieId)
    filtered.unshift(movieId)
    saveToStorage(STORAGE_KEYS.RECENTLY_VIEWED, filtered.slice(0, 10))
  },

  /** Save/Get booking draft (for resuming incomplete bookings) */
  getBookingDraft() { return getFromStorage(STORAGE_KEYS.BOOKING_DRAFT) },
  saveBookingDraft(draft) { saveToStorage(STORAGE_KEYS.BOOKING_DRAFT, draft) },
  clearBookingDraft() { removeFromStorage(STORAGE_KEYS.BOOKING_DRAFT) }
}

export { STORAGE_KEYS }
export default authService
