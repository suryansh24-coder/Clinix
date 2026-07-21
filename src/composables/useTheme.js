/* ============================================================
   useTheme.js — Global Theme Management
   Light theme by default; persists to localStorage.
   Applies data-theme attribute to <html> element.
   ============================================================ */

import { ref, watch } from 'vue'

const STORAGE_KEY = 'cinevault-theme'
const theme = ref(localStorage.getItem(STORAGE_KEY) || 'light')

// Apply on init
document.documentElement.setAttribute('data-theme', theme.value)

// Sync to DOM + localStorage on every change
watch(theme, (val) => {
  document.documentElement.setAttribute('data-theme', val)
  localStorage.setItem(STORAGE_KEY, val)
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const isDark = ref(false)
  watch(theme, (val) => { isDark.value = val === 'dark' }, { immediate: true })

  return { theme, isDark, toggleTheme }
}
