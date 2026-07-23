<template>
  <nav class="navbar" :class="{ scrolled: isScrolled, 'menu-open': isMobileMenuOpen }">
    <div class="navbar-inner">

      <!-- ── LEFT: Logo + Auth ─────────────────────────── -->
      <div class="navbar-left">
        <router-link to="/" class="navbar-brand" @click="closeMobile">
          <svg class="brand-logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#e50914"/>
            <path d="M8 10h3l2 4 2-4h3v12h-3v-6l-2 4-2-4v6H8V10z" fill="white"/>
            <path d="M20 10h4a4 4 0 010 8h-1v4h-3V10zm3 5.5a1.5 1.5 0 000-3h-1v3h1z" fill="white"/>
          </svg>
          <span class="brand-text">Cine<span class="brand-accent">Vault</span></span>
        </router-link>
      </div>

      <!-- ── CENTER: Nav Links ─────────────────────────── -->
      <div class="navbar-links" :class="{ active: isMobileMenuOpen }">
        <router-link to="/" class="nav-link" exact-active-class="nav-link--active" @click="closeMobile">Home</router-link>
        <router-link to="/movies" class="nav-link" active-class="nav-link--active" @click="closeMobile">Movies</router-link>
        <router-link to="/my-bookings" class="nav-link" active-class="nav-link--active" @click="closeMobile">Bookings</router-link>

        <!-- Mobile-only sections -->
        <div class="mobile-only-section">
          <div class="mobile-search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input v-model="searchText" type="text" placeholder="Search movies..." class="mobile-search-input" @keyup.enter="performSearch" />
          </div>
          <template v-if="isLoggedIn">
            <router-link to="/profile" class="nav-link" @click="closeMobile">Profile</router-link>
            <button class="btn btn-outline btn-sm w-full" @click="handleLogout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-ghost btn-sm w-full" @click="closeMobile">Sign In</router-link>
            <router-link to="/register" class="btn btn-primary btn-sm w-full" @click="closeMobile">Sign Up</router-link>
          </template>
        </div>
      </div>

      <!-- ── RIGHT: City + Search + Theme ─────────────── -->
      <div class="navbar-actions">

        <!-- City Selector -->
        <button class="city-selector-btn" @click="openCityPicker" :title="`Showing in ${selectedCity}`">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span class="city-name">{{ selectedCity }}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        <!-- Inline Search -->
        <div class="inline-search" :class="{ focused: isSearchFocused }">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            ref="searchInputRef"
            v-model="searchText"
            type="text"
            placeholder="Search movies, actors..."
            class="inline-search-input"
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
            @keyup.enter="performSearch"
            @keyup.escape="searchText = ''"
          />
          <button v-if="searchText" class="search-clear" @click="searchText = ''">✕</button>
        </div>

        <!-- Theme Toggle -->
        <button class="btn-icon nav-icon-btn" @click="toggleTheme" :title="isDark ? 'Light Mode' : 'Dark Mode'">
          <transition name="theme-icon" mode="out-in">
            <span v-if="isDark" key="sun">☀️</span>
            <span v-else key="moon">🌙</span>
          </transition>
        </button>

        <!-- Desktop Auth -->
          <div class="navbar-auth-right desktop-auth">
            <template v-if="isLoggedIn">
              <router-link to="/profile" class="nav-auth-avatar" title="My Profile">
                <span>{{ userInitial }}</span>
              </router-link>
            </template>

            <template v-else>
              <router-link to="/login" class="btn btn-ghost btn-sm nav-signin">
                Sign In
              </router-link>

              <router-link to="/register" class="btn btn-primary btn-sm nav-signup">
                Sign Up
              </router-link>
            </template>
          </div>

        <!-- Hamburger -->
        <button class="hamburger" @click="isMobileMenuOpen = !isMobileMenuOpen" :class="{ open: isMobileMenuOpen }" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- ── City Picker Modal ──────────────────────────── -->
    <transition name="city-modal">
      <div v-if="showCityPicker" class="city-picker-overlay" @click.self="closeCityPicker">
        <div class="city-picker-panel">
          <div class="city-picker-header">
            <h3>Select City</h3>
            <button class="city-picker-close" @click="closeCityPicker">✕</button>
          </div>

          <!-- Search -->
          <div class="city-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input v-model="citySearchQuery" type="text" placeholder="Search for your city" class="city-search-input" ref="citySearchRef" />
          </div>

          <!-- Detect Location -->
          <button class="detect-location-btn" @click="detectLocation">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" opacity=".3"/></svg>
            Detect my location
          </button>

          <!-- Popular Cities -->
          <div class="popular-cities-section">
            <p class="section-label">Popular Cities</p>
            <div class="cities-grid">
              <button
                v-for="city in filteredPopularCities"
                :key="city.name"
                class="city-tile"
                :class="{ active: selectedCity === city.name }"
                @click="selectCity(city.name)"
              >
                <div class="city-icon-wrap">
                  <span class="city-emoji">{{ city.emoji }}</span>
                </div>
                <span class="city-tile-name">{{ city.name }}</span>
              </button>
            </div>
          </div>

          <!-- All Cities (filtered) -->
          <div v-if="citySearchQuery && filteredAllCities.length" class="all-cities-section">
            <p class="section-label">All Cities</p>
            <div class="all-cities-list">
              <button
                v-for="city in filteredAllCities"
                :key="city"
                class="city-list-item"
                :class="{ active: selectedCity === city }"
                @click="selectCity(city)"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ city }}
              </button>
            </div>
          </div>

          <div v-if="!citySearchQuery" class="view-all-row">
            <button class="view-all-cities-btn" @click="showAllCities = !showAllCities">
              {{ showAllCities ? 'Show less ↑' : 'View All Cities ↓' }}
            </button>
          </div>

          <div v-if="showAllCities && !citySearchQuery" class="all-cities-list extended">
            <button
              v-for="city in extraCities"
              :key="city"
              class="city-list-item"
              :class="{ active: selectedCity === city }"
              @click="selectCity(city)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ city }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'
import { useCity } from '@/composables/useCity'

const router = useRouter()
const { isLoggedIn, currentUser, logout } = useAuth()
const { isDark, toggleTheme } = useTheme()
const { selectedCity, popularCities, allCities, setCity } = useCity()

// ── State ────────────────────────────────────────────────
const isScrolled         = ref(false)
const isMobileMenuOpen   = ref(false)
const isSearchFocused    = ref(false)
const searchText         = ref('')
const searchInputRef     = ref(null)
const showCityPicker     = ref(false)
const citySearchQuery    = ref('')
const citySearchRef      = ref(null)
const showAllCities      = ref(false)

// ── Computed ─────────────────────────────────────────────
const userInitial = computed(() =>
  currentUser.value?.name?.charAt(0).toUpperCase() || 'U'
)

const extraCities = computed(() =>
  allCities.filter(c => !popularCities.find(p => p.name === c))
)

const filteredPopularCities = computed(() => {
  if (!citySearchQuery.value) return popularCities
  const q = citySearchQuery.value.toLowerCase()
  return popularCities.filter(c => c.name.toLowerCase().includes(q))
})

const filteredAllCities = computed(() => {
  if (!citySearchQuery.value) return []
  const q = citySearchQuery.value.toLowerCase()
  return allCities.filter(c =>
    c.toLowerCase().includes(q) && !popularCities.find(p => p.name === c)
  )
})

// ── Methods ──────────────────────────────────────────────
function closeMobile() { isMobileMenuOpen.value = false }

async function openCityPicker() {
  showCityPicker.value = true
  citySearchQuery.value = ''
  showAllCities.value = false
  await nextTick()
  citySearchRef.value?.focus()
}

function closeCityPicker() { showCityPicker.value = false }

function selectCity(cityName) {
  setCity(cityName)
  closeCityPicker()
}

function detectLocation() {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    () => {
      // In a real app, reverse geocode the coordinates
      // For demo, default to Mumbai if location detected
      selectCity('Mumbai')
    },
    () => {
      closeCityPicker()
    }
  )
}

function performSearch() {
  if (!searchText.value.trim()) return
  router.push({ path: '/movies', query: { search: searchText.value.trim() } })
  isMobileMenuOpen.value = false
}

function handleLogout() {
  logout()
  router.push('/')
  closeMobile()
}

// ── Scroll listener ──────────────────────────────────────
function handleScroll() { isScrolled.value = window.scrollY > 20 }

// ── Close city picker on Escape ──────────────────────────
function handleKeydown(e) {
  if (e.key === 'Escape') {
    closeCityPicker()
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* ── Base Navbar ─────────────────────────────────────────── */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: var(--z-sticky);
  height: 64px;
  background: var(--bg-navbar);
  border-bottom: 1px solid transparent;
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.navbar.scrolled {
  background: var(--bg-navbar-scrolled);
  border-bottom-color: var(--border-color);
  box-shadow: 0 1px 12px rgba(0,0,0,0.15);
  backdrop-filter: blur(20px);
}

.navbar-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 0;
}

/* ── LEFT section ────────────────────────────────────────── */
.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
}

.brand-logo-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.brand-text {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--text-primary);
}

.brand-accent { color: var(--color-accent); }

/* Auth on left (desktop) */
.navbar-auth-right { display: flex; align-items: center; gap: 0.5rem; }

.nav-auth-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.875rem;
  text-decoration: none;
  transition: transform 0.2s;
}
.nav-auth-avatar:hover { transform: scale(1.08); }

.nav-signin {
  font-weight: 500;
  color: var(--text-secondary) !important;
  border: 1px solid var(--border-color) !important;
  background: transparent !important;
  padding: 0.4rem 0.875rem !important;
  font-size: 0.8125rem !important;
}
.nav-signin:hover {
  color: var(--text-primary) !important;
  border-color: var(--color-accent) !important;
}
.nav-signup {
  padding: 0.4rem 0.875rem !important;
  font-size: 0.8125rem !important;
}

/* ── CENTER Nav Links ────────────────────────────────────── */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.875rem;
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease;
  letter-spacing: 0.01em;
}
.nav-link:hover { color: var(--text-primary); background: var(--bg-glass); }
.nav-link--active {
  color: var(--color-accent);
  background: rgba(0, 212, 255, 0.08);
  font-weight: 600;
}
[data-theme="dark"] .nav-link--active { color: var(--color-accent); }

/* ── RIGHT actions ───────────────────────────────────────── */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* City Selector */
.city-selector-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-md);
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.city-selector-btn:hover {
  color: var(--text-primary);
  border-color: var(--color-accent);
  background: rgba(0, 212, 255, 0.05);
}
.city-name { max-width: 80px; overflow: hidden; text-overflow: ellipsis; }

/* Search */
.inline-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: var(--bg-input);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-full);
  color: var(--text-muted);
  transition: all 0.2s ease;
  width: 200px;
}
.inline-search.focused,
.inline-search:focus-within {
  border-color: var(--color-accent);
  background: var(--bg-input-focus);
  width: 260px;
}
.inline-search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 0.8125rem;
  font-family: var(--font-body);
}
.inline-search-input::placeholder { color: var(--text-muted); }
.search-clear {
  font-size: 0.7rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
}
.search-clear:hover { color: var(--text-primary); }

/* Theme Toggle */
.btn-icon {
  width: 36px; height: 36px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}
.btn-icon:hover { border-color: var(--color-accent); background: rgba(0,212,255,0.08); }

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px; height: 36px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  padding: 8px;
}
.hamburger span {
  display: block;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.25s ease;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.mobile-only-section { display: none; }

/* ── City Picker Modal ───────────────────────────────────── */
.city-picker-overlay {
  position: fixed;
  inset: 64px 0 0 0;
  background: rgba(0,0,0,0.6);
  z-index: calc(var(--z-sticky) + 5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 0.5rem 1rem;
}

.city-picker-panel {
  width: 100%;
  max-width: 520px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.city-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.city-picker-header h3 {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}
.city-picker-close {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.875rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.city-picker-close:hover { background: rgba(229,9,20,0.1); border-color: var(--color-primary); color: var(--color-primary); }

.city-search-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-input);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-muted);
  margin-bottom: 0.875rem;
}
.city-search-wrap:focus-within { border-color: var(--color-accent); }
.city-search-input {
  flex: 1; background: none; border: none; outline: none;
  color: var(--text-primary); font-size: 0.9375rem; font-family: var(--font-body);
}
.city-search-input::placeholder { color: var(--text-muted); }

.detect-location-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  transition: opacity 0.2s;
}
.detect-location-btn:hover { opacity: 0.75; }

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.875rem;
}

/* Cities Grid — 5 columns like BookMyShow */
.cities-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.city-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 0.5rem;
  border-radius: var(--radius-lg);
  background: var(--bg-glass);
  border: 1.5px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}
.city-tile:hover {
  border-color: var(--color-accent);
  background: rgba(0,212,255,0.06);
  transform: translateY(-2px);
}
.city-tile.active {
  border-color: var(--color-primary);
  background: rgba(229,9,20,0.06);
}

.city-icon-wrap {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem;
  transition: transform 0.2s;
}
.city-tile:hover .city-icon-wrap { transform: scale(1.1); }
.city-tile.active .city-icon-wrap { background: rgba(229,9,20,0.1); }

.city-tile-name {
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.2;
}
.city-tile.active .city-tile-name { color: var(--color-primary); }

/* All cities list */
.all-cities-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}
.all-cities-list.extended { margin-top: 0.75rem; }

.city-list-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.city-list-item:hover { border-color: var(--color-accent); color: var(--text-primary); }
.city-list-item.active { border-color: var(--color-primary); color: var(--color-primary); background: rgba(229,9,20,0.05); }

.view-all-row { text-align: center; margin-top: 0.75rem; }
.view-all-cities-btn {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}
.view-all-cities-btn:hover { opacity: 0.8; }

/* Modal transition */
.city-modal-enter-active, .city-modal-leave-active { transition: opacity 0.2s ease; }
.city-modal-enter-from, .city-modal-leave-to { opacity: 0; }
.city-modal-enter-active .city-picker-panel,
.city-modal-leave-active .city-picker-panel { transition: transform 0.2s ease, opacity 0.2s ease; }
.city-modal-enter-from .city-picker-panel { transform: translateY(-12px); opacity: 0; }
.city-modal-leave-to .city-picker-panel { transform: translateY(-8px); opacity: 0; }

/* Theme icon transition */
.theme-icon-enter-active, .theme-icon-leave-active { transition: opacity 0.15s, transform 0.15s; }
.theme-icon-enter-from { opacity: 0; transform: scale(0.5) rotate(-30deg); }
.theme-icon-leave-to { opacity: 0; transform: scale(0.5) rotate(30deg); }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 960px) {
  .inline-search { width: 160px; }
  .inline-search.focused, .inline-search:focus-within { width: 180px; }
}

@media (max-width: 768px) {
  .navbar-links {
    display: none;
    position: fixed;
    top: 64px; left: 0; right: 0;
    background: var(--bg-navbar-scrolled);
    backdrop-filter: blur(20px);
    flex-direction: column;
    align-items: stretch;
    padding: 1.5rem;
    gap: 0.5rem;
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: calc(var(--z-sticky) - 1);
    overflow-y: auto;
    max-height: calc(100vh - 64px);
  }
  .navbar-links.active { display: flex; }
  .nav-link { font-size: 1rem; padding: 0.75rem 1rem; }
  .mobile-only-section { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }
  .mobile-search-bar { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: var(--bg-input); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); color: var(--text-muted); }
  .mobile-search-input { flex: 1; background: none; border: none; outline: none; color: var(--text-primary); font-size: 1rem; }
  .desktop-auth { display: none; }
  .inline-search { display: none; }
  .hamburger { display: flex; }
  .city-name { max-width: 60px; }
  .cities-grid { grid-template-columns: repeat(4, 1fr); }
  .city-picker-overlay { padding: 0.5rem; }
  .city-picker-panel { max-width: 100%; }
}

@media (max-width: 480px) {
  .cities-grid { grid-template-columns: repeat(3, 1fr); }
  .city-selector-btn .city-name { display: none; }
}
</style>
