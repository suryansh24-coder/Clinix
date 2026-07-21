/* ============================================================
   useToast.js — Global Toast Notification Composable
   Module-level singleton so any component can call showToast()
   without relying on provide/inject parent-child hierarchy.
   ToastContainer.vue reads the same reactive state to render toasts.
   ============================================================ */

import { ref } from 'vue'

// ── Singleton state shared across all components ──────────
const toasts = ref([])
let idCounter = 0

/**
 * Show a toast notification from anywhere in the app.
 * @param {Object} options - { type, title, message, duration }
 *   type: 'success' | 'error' | 'warning' | 'info'
 */
function showToast({ type = 'info', title = '', message = '', duration = 4000 } = {}) {
  const id = ++idCounter
  toasts.value.push({ id, type, title, message, duration })
  setTimeout(() => removeToast(id), duration)
}

/**
 * Remove a toast by its ID.
 */
function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

export function useToast() {
  return { toasts, showToast, removeToast }
}
