<!-- ============================================================
     Navbar.vue — Premium Navigation Bar
     Glassmorphism-styled navbar with responsive hamburger menu,
     search, auth state display, and smooth scroll effects.
     ============================================================ -->
<template>
  <nav class="navbar" :class="{ scrolled: isScrolled, 'menu-open': isMobileMenuOpen }">
    <div class="container navbar-inner">
      <!-- Logo / Brand -->
      <router-link to="/" class="navbar-brand" @click="closeMobile">
        <span class="brand-icon">🎬</span>
        <span class="brand-text">Cine<span class="brand-accent">Vault</span></span>
      </router-link>

      <!-- Desktop Navigation Links -->
      <div class="navbar-links" :class="{ active: isMobileMenuOpen }">
        <router-link to="/" class="nav-link" active-class="nav-link-active" @click="closeMobile">
          Home
        </router-link>
        <router-link to="/movies" class="nav-link" active-class="nav-link-active" @click="closeMobile">
          Movies
        </router-link>
        <router-link
          v-if="isLoggedIn"
          to="/my-bookings"
          class="nav-link"
          active-class="nav-link-active"
          @click="closeMobile"
        >
          My Bookings
        </router-link>

        <!-- Mobile-only auth buttons -->
        <div class="mobile-auth-section">
          <template v-if="isLoggedIn">
            <router-link to="/profile" class="nav-link" @click="closeMobile">
              Profile
            </router-link>
            <button class="btn btn-outline btn-sm" @click="handleLogout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-ghost btn-sm" @click="closeMobile">
              Sign In
            </router-link>
            <router-link to="/register" class="btn btn-primary btn-sm" @click="closeMobile">
              Sign Up
            </router-link>
          </template>
        </div>
      </div>

      <!-- Right Section: Auth + Search -->
      <div class="navbar-actions">
        <!-- Search Toggle -->
        <button class="btn-icon nav-icon-btn" @click="toggleSearch" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        <!-- Desktop Auth Buttons -->
        <div class="desktop-auth">
          <template v-if="isLoggedIn">
            <router-link to="/profile" class="user-avatar-btn" :title="userName">
              <span class="avatar-initial">{{ userName.charAt(0).toUpperCase() }}</span>
            </router-link>
            <button class="btn btn-ghost btn-sm" @click="handleLogout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-ghost btn-sm">Sign In</router-link>
            <router-link to="/register" class="btn btn-primary btn-sm">Sign Up</router-link>
          </template>
        </div>

        <!-- Mobile Hamburger -->
        <button
          class="hamburger"
          :class="{ open: isMobileMenuOpen }"
          @click="toggleMobile"
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Floating Search Bar -->
    <transition name="search-slide">
      <div v-if="isSearchOpen" class="search-overlay">
        <div class="container">
          <div class="search-bar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref="searchInputRef"
              v-model="searchText"
              type="text"
              placeholder="Search movies, genres, actors..."
              class="search-input"
              @keyup.enter="performSearch"
              @keyup.escape="closeSearch"
            />
            <button class="search-close" @click="closeSearch">✕</button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { isLoggedIn, userName, logout } = useAuth()

// ── Reactive State ────────────────────────────────────────
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchText = ref('')
const searchInputRef = ref(null)

// ── Scroll Detection ────────────────────────────────────
// Adds "scrolled" class for glassmorphism effect on scroll
function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

// ── Lifecycle: Add/remove scroll listener ───────────────
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// ── Mobile Menu Toggle ──────────────────────────────────
function toggleMobile() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
function closeMobile() {
  isMobileMenuOpen.value = false
}

// ── Search Toggle ───────────────────────────────────────
function toggleSearch() {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    nextTick(() => searchInputRef.value?.focus())
  }
}
function closeSearch() {
  isSearchOpen.value = false
  searchText.value = ''
}

// ── Search Navigation ───────────────────────────────────
function performSearch() {
  if (searchText.value.trim()) {
    router.push({ name: 'Movies', query: { search: searchText.value.trim() } })
    closeSearch()
    closeMobile()
  }
}

// ── Logout Handler ──────────────────────────────────────
function handleLogout() {
  logout()
  closeMobile()
  router.push({ name: 'Home' })
}
</script>

<style scoped>
/* ── Navbar Container ────────────────────────────────────── */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  padding: 0.75rem 0;
  transition: all var(--transition-base);
  background: transparent;
}

.navbar.scrolled {
  background: rgba(10, 10, 26, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xl);
}

/* ── Brand ───────────────────────────────────────────────── */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: var(--text-primary);
  flex-shrink: 0;
}

.brand-icon { font-size: 1.5rem; }

.brand-text {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.brand-accent {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Navigation Links ────────────────────────────────────── */
.navbar-links {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.nav-link {
  padding: 0.5rem 1rem;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  text-decoration: none;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-glass);
}

.nav-link-active {
  color: var(--color-accent) !important;
  background: rgba(0, 212, 255, 0.08);
}

/* ── Navbar Actions ──────────────────────────────────────── */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.nav-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  background: var(--bg-glass);
  transition: all var(--transition-fast);
}

.nav-icon-btn:hover {
  color: var(--text-primary);
  background: var(--bg-glass-hover);
}

/* ── User Avatar ─────────────────────────────────────────── */
.user-avatar-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--gradient-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.user-avatar-btn:hover {
  transform: scale(1.08);
  box-shadow: var(--shadow-glow);
}

.avatar-initial {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--font-size-sm);
  color: #fff;
}

/* ── Desktop Auth ────────────────────────────────────────── */
.desktop-auth {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.mobile-auth-section {
  display: none;
}

/* ── Hamburger Menu ──────────────────────────────────────── */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  padding: 6px;
  border-radius: var(--radius-md);
  background: var(--bg-glass);
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all var(--transition-base);
}

.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
}
.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ── Floating Search Bar ─────────────────────────────────── */
.search-overlay {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: var(--space-md) 0;
  background: rgba(10, 10, 26, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 0.875rem 1.25rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-muted);
}

.search-bar:focus-within {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: var(--font-size-base);
}

.search-close {
  color: var(--text-muted);
  font-size: var(--font-size-lg);
  padding: 4px;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.search-close:hover {
  color: var(--text-primary);
  background: var(--bg-glass);
}

/* ── Search Transition ───────────────────────────────────── */
.search-slide-enter-active,
.search-slide-leave-active {
  transition: all 0.3s ease;
}
.search-slide-enter-from,
.search-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ── Responsive: Tablet & Mobile ─────────────────────────── */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .desktop-auth {
    display: none;
  }

  .navbar-links {
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    padding: var(--space-xl);
    gap: var(--space-sm);
    background: rgba(10, 10, 26, 0.98);
    backdrop-filter: blur(20px);
    transform: translateX(100%);
    transition: transform var(--transition-slow);
    align-items: stretch;
    overflow-y: auto;
  }

  .navbar-links.active {
    transform: translateX(0);
  }

  .nav-link {
    font-size: var(--font-size-lg);
    padding: 1rem;
    border-radius: var(--radius-md);
  }

  .mobile-auth-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-top: var(--space-xl);
    padding-top: var(--space-xl);
    border-top: 1px solid var(--border-color);
  }
}
</style>
