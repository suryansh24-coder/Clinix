/* ============================================================
   useAuth.js — Authentication Composable
   Provides reactive authentication state and methods
   to Vue components using the Composition API.
   Uses LocalStorage for session persistence.
   ============================================================ */

import { ref, computed, readonly } from 'vue'
import authService from '@/services/auth'

// ── Reactive State (Singleton) ──────────────────────────
// These refs are shared across all components that use this composable
const currentUser = ref(authService.getCurrentUser())
const isLoading = ref(false)
const error = ref(null)

/* ── useAuth Composable ──────────────────────────────────── */
export function useAuth() {
  // Computed property: is the user logged in?
  const isLoggedIn = computed(() => !!currentUser.value)

  // Computed property: user's display name
  const userName = computed(() => currentUser.value?.name || 'Guest')

  /**
   * Register a new user
   * Updates reactive state on success/failure
   */
  async function register(userData) {
    isLoading.value = true
    error.value = null
    try {
      const user = await authService.register(userData)
      currentUser.value = user
      return user
    } catch (err) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Login with email and password
   * Updates reactive state on success/failure
   */
  async function login(email, password) {
    isLoading.value = true
    error.value = null
    try {
      const user = await authService.login(email, password)
      currentUser.value = user
      return user
    } catch (err) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout the current user
   * Clears reactive state and LocalStorage
   */
  function logout() {
    authService.logout()
    currentUser.value = null
    error.value = null
  }

  /**
   * Update user profile
   */
  async function updateProfile(updates) {
    if (!currentUser.value) return
    isLoading.value = true
    error.value = null
    try {
      const updated = await authService.updateProfile(currentUser.value.id, updates)
      currentUser.value = updated
      return updated
    } catch (err) {
      error.value = err.message || 'Update failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clear any displayed error
   */
  function clearError() {
    error.value = null
  }

  /**
   * Restore session from LocalStorage
   * Called on app initialisation (onMounted in App.vue)
   */
  function restoreSession() {
    const user = authService.getCurrentUser()
    currentUser.value = user
  }

  return {
    // State (readonly to prevent external mutation)
    currentUser: readonly(currentUser),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    isLoggedIn,
    userName,

    // Methods
    register,
    login,
    logout,
    updateProfile,
    clearError,
    restoreSession
  }
}
