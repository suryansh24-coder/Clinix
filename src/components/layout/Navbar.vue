<!-- ============================================================
     Navbar.vue — Premium Navigation Bar
     Inline search, theme toggle, Bookings link, gradient effects
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
        <router-link to="/" class="nav-link" active-class="nav-link-active" exact @click="closeMobile">
          Home
        </router-link>
        <router-link to="/movies" class="nav-link" active-class="nav-link-active" @click="closeMobile">
          Movies
        </router-link>
        <router-link to="/my-bookings" class="nav-link nav-link-bookings" active-class="nav-link-active" @click="closeMobile">
          🎟️ Bookings
        </router-link>

        <!-- Mobile-only auth + search -->
        <div class="mobile-search-section">
          <div class="mobile-search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="searchText"
              type="text"
              placeholder="Search movies..."
              class="mobile-search-input"
              @keyup.enter="performSearch"
            />
          </div>
        </div>

        <div class="mobile-auth-section">
          <template v-if="isLoggedIn">
            <router-link to="/profile" class="nav-link" @click="closeMobile">Profile</router-link>
            <button class="btn btn-outline btn-sm" @click="handleLogout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-ghost btn-sm" @click="closeMobile">Sign In</router-link>
            <router-link to="/register" class="btn btn-primary btn-sm" @click="closeMobile">Sign Up</router-link>
          </template>
        </div>
      </div>

      <!-- Right Section: Inline Search + Theme + Auth -->
      <div class="navbar-actions">

        <!-- Inline Search Bar (desktop) -->
        <div class="inline-search" :class="{ focused: isSearchFocused }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref="searchInputRef"
            v-model="searchText"
            type="text"
            placeholder="Search movies, genres, actors..."
            class="inline-search-input"
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
            @keyup.enter="performSearch"
            @keyup.escape="searchText = ''"
          />
          <button v-if="searchText" class="search-clear" @click="searchText = ''" title="Clear">✕</button>
        </div>

        <!-- Theme Toggle -->
        <button
          class="btn-icon nav-icon-btn theme-toggle"
          @click="toggleTheme"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <transition name="theme-icon" mode="out-in">
            <span v-if="isDark" key="moon" class="theme-icon">☀️</span>
            <span v-else key="sun" class="theme-icon">🌙</span>
          </transition>
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
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const { isLoggedIn, userName, logout } = useAuth()
const { isDark, toggleTheme } = useTheme()

// ── Reactive State ────────────────────────────────────────
const isScrolled      = ref(false)
const isMobileMenuOpen = ref(false)
const isSearchFocused = ref(false)
const searchText      = ref('')
const searchInputRef  = ref(null)

// ── Scroll Detection ─────────────────────────────────────
function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

// ── Mobile Menu ──────────────────────────────────────────
function toggleMobile() { isMobileMenuOpen.value = !isMobileMenuOpen.value }
function closeMobile()  { isMobileMenuOpen.value = false }

// ── Search ───────────────────────────────────────────────
function performSearch() {
  if (searchText.value.trim()) {
    router.push({ name: 'Movies', query: { search: searchText.value.trim() } })
    searchText.value = ''
    closeMobile()
    searchInputRef.value?.blur()
  }
}

// ── Logout ───────────────────────────────────────────────
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
  padding: 0.6rem 0;
  transition: all var(--transition-base);
  background: transparent;
}


.navbar.scrolled {
  background: var(--navbar-bg-scrolled);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

.navbar-inner {
  display: flex;
  align-items: center;
  gap: var(--space-md);
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

.brand-icon { font-size: 1.4rem; }

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
  gap: 2px;
  flex-shrink: 0;
}

.nav-link {
  padding: 0.45rem 0.9rem;
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
  background: var(--accent-chip-bg) !important;
}

/* Bookings link — subtle gradient pill */
.nav-link-bookings {
  background: var(--bookings-btn-bg);
  color: var(--color-primary) !important;
  border: 1px solid rgba(229, 9, 20, 0.2);
  font-weight: 600;
}
.nav-link-bookings:hover {
  background: rgba(229, 9, 20, 0.18) !important;
  border-color: var(--color-primary);
  color: var(--color-primary-light) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(229, 9, 20, 0.25);
}

/* ── Inline Search Bar (desktop) ─────────────────────────── */
.inline-search {
  flex: 1;
  max-width: 340px;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0.45rem 0.9rem;
  background: var(--bg-input);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-full);
  color: var(--text-muted);
  transition: all var(--transition-base);
  min-width: 0;
}

.inline-search svg {
  flex-shrink: 0;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.inline-search.focused,
.inline-search:focus-within {
  border-color: var(--color-accent);
  background: var(--bg-input-focus);
  box-shadow: 0 0 0 3px var(--accent-glow-sm);
}

.inline-search.focused svg {
  color: var(--color-accent);
}

.inline-search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  min-width: 0;
}

.inline-search-input::placeholder {
  color: var(--text-muted);
}

.search-clear {
  color: var(--text-muted);
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: var(--radius-full);
  background: var(--bg-glass);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}
.search-clear:hover {
  color: var(--text-primary);
  background: var(--bg-glass-hover);
}

/* ── Navbar Actions ──────────────────────────────────────── */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-shrink: 0;
}

.nav-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.nav-icon-btn:hover {
  color: var(--text-primary);
  background: var(--bg-glass-hover);
  transform: scale(1.06);
}

/* Theme Toggle */
.theme-toggle {
  font-size: 1rem;
  border-color: transparent;
}
.theme-toggle:hover {
  border-color: var(--border-color);
  transform: rotate(15deg) scale(1.08);
}

.theme-icon {
  display: block;
  line-height: 1;
  font-size: 1.05rem;
}

.theme-icon-enter-active,
.theme-icon-leave-active { transition: all 0.2s ease; }
.theme-icon-enter-from   { opacity: 0; transform: rotate(-90deg) scale(0.6); }
.theme-icon-leave-to     { opacity: 0; transform: rotate(90deg) scale(0.6); }

/* ── User Avatar ─────────────────────────────────────────── */
.user-avatar-btn {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  background: var(--gradient-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all var(--transition-fast);
  flex-shrink: 0;
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

.mobile-auth-section   { display: none; }
.mobile-search-section { display: none; }

/* ── Hamburger ───────────────────────────────────────────── */
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
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}
.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all var(--transition-base);
}
.hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1024px) {
  .inline-search { max-width: 220px; }
}

@media (max-width: 768px) {
  .hamburger          { display: flex; }
  .desktop-auth       { display: none; }
  .inline-search      { display: none; }

  .navbar-links {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    padding: var(--space-xl);
    gap: var(--space-sm);
    background: var(--mobile-menu-bg);
    backdrop-filter: blur(24px);
    transform: translateX(100%);
    transition: transform var(--transition-slow);
    align-items: stretch;
    overflow-y: auto;
  }

  .navbar-links.active { transform: translateX(0); }

  .nav-link {
    font-size: var(--font-size-lg);
    padding: 1rem;
    border-radius: var(--radius-md);
  }

  .mobile-search-section {
    display: block;
    margin-top: var(--space-md);
  }

  .mobile-search-bar {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: 0.75rem 1rem;
    background: var(--bg-input);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-lg);
    color: var(--text-muted);
  }
  .mobile-search-bar:focus-within {
    border-color: var(--color-accent);
  }
  .mobile-search-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-size: var(--font-size-base);
  }
  .mobile-search-input::placeholder { color: var(--text-muted); }

  .mobile-auth-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-top: var(--space-xl);
    padding-top: var(--space-xl);
    border-top: 1px solid var(--border-color);
  }
}

@media (max-width: 480px) {
  .nav-link-bookings { display: none; }
}
</style>
