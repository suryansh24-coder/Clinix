<!-- ============================================================
     Login.vue — Sign In Page
     LocalStorage-based authentication form.
     Validates fields client-side, calls authService.login(),
     shows toast notifications, redirects after success.
     ============================================================ -->
<template>
  <div class="auth-page">
    <div class="auth-container">

      <!-- Auth Card -->
      <div class="auth-card glass-card animate-scale-in">

        <!-- Brand Header -->
        <div class="auth-brand">
          <span class="brand-icon">🎬</span>
          <span class="brand-text">Cine<span class="brand-accent">Vault</span></span>
        </div>

        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Sign in to book your favourite movies</p>

        <!-- Login Form -->
        <form class="auth-form" @submit.prevent="handleLogin" novalidate>

          <!-- Email Field -->
          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input"
              :class="{ 'input-error': fieldErrors.email }"
              placeholder="you@example.com"
              autocomplete="email"
              @blur="validateField('email')"
            />
            <span v-if="fieldErrors.email" class="form-error">{{ fieldErrors.email }}</span>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div class="password-wrap">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'input-error': fieldErrors.password }"
                placeholder="Enter your password"
                autocomplete="current-password"
                @blur="validateField('password')"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <span v-if="fieldErrors.password" class="form-error">{{ fieldErrors.password }}</span>
          </div>

          <!-- Global Error Banner -->
          <div class="error-banner" v-if="authError">
            <span>⚠️</span> {{ authError }}
          </div>

          <!-- Demo Credentials Hint -->
          <div class="demo-hint">
            <span>💡 Demo:</span>
            <code>demo@cinevault.com</code> / <code>demo1234</code>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary btn-lg w-full"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner"></span>
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>

        </form>

        <!-- Divider -->
        <div class="auth-divider">
          <span>Don't have an account?</span>
        </div>

        <!-- Register Link -->
        <router-link to="/register" class="btn btn-outline btn-lg w-full" style="text-align:center;">
          Create Account
        </router-link>

      </div>
    </div>

    <!-- Background Decoration -->
    <div class="auth-bg-decoration">
      <div class="deco-circle deco-1"></div>
      <div class="deco-circle deco-2"></div>
      <div class="deco-circle deco-3"></div>
    </div>
  </div>
</template>

<script setup>
/* ── Imports ─────────────────────────────────────────────── */
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const router    = useRouter()
const route     = useRoute()
const { showToast } = useToast()

// ── Composable ────────────────────────────────────────────
const { login, isLoading, error: authError, clearError } = useAuth()

// ── Form State ────────────────────────────────────────────
const form = ref({ email: '', password: '' })
const fieldErrors   = ref({ email: '', password: '' })
const showPassword  = ref(false)

// ── Field-level Validation ────────────────────────────────
function validateField(field) {
  clearError()
  if (field === 'email') {
    if (!form.value.email) {
      fieldErrors.value.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      fieldErrors.value.email = 'Enter a valid email address.'
    } else {
      fieldErrors.value.email = ''
    }
  }
  if (field === 'password') {
    fieldErrors.value.password = form.value.password ? '' : 'Password is required.'
  }
}

function isFormValid() {
  validateField('email')
  validateField('password')
  return !fieldErrors.value.email && !fieldErrors.value.password
}

// ── Handle Login Submission ───────────────────────────────
async function handleLogin() {
  clearError()
  if (!isFormValid()) return

  try {
    await login(form.value.email, form.value.password)

    showToast?.({ type: 'success', title: 'Welcome back!', message: 'You are signed in.' })

    // Redirect to intended page or home
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (err) {
    // Error is set by useAuth composable via authError
    showToast?.({ type: 'error', title: 'Login failed', message: err.message })
  }
}
</script>

<style scoped>
/* ── Auth Page Layout ────────────────────────────────────── */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  position: relative;
  overflow: hidden;
}

.auth-container {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 2;
}

/* ── Auth Card ───────────────────────────────────────────── */
.auth-card {
  padding: var(--space-2xl);
}

.auth-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  justify-content: center;
  margin-bottom: var(--space-xl);
  color: var(--text-primary);
  text-decoration: none;
}

.brand-icon { font-size: 2rem; }

.brand-text {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: 800;
}

.brand-accent {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-title {
  font-family: var(--font-display);
  font-size: var(--font-size-3xl);
  font-weight: 800;
  text-align: center;
  margin-bottom: var(--space-sm);
}

.auth-subtitle {
  text-align: center;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-2xl);
}

/* ── Form ────────────────────────────────────────────────── */
.auth-form { display: flex; flex-direction: column; gap: var(--space-lg); }

.input-error { border-color: var(--color-primary) !important; }

/* Password toggle */
.password-wrap { position: relative; }

.password-wrap .form-input { padding-right: 3rem; }

.password-toggle {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity var(--transition-fast);
}

.password-toggle:hover { opacity: 1; }

/* Error Banner */
.error-banner {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: rgba(229, 9, 20, 0.1);
  border: 1px solid rgba(229, 9, 20, 0.3);
  border-radius: var(--radius-md);
  color: var(--color-primary-light);
  font-size: var(--font-size-sm);
}

/* Demo Hint */
.demo-hint {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  background: var(--bg-glass);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
}

.demo-hint code {
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.15);
  border-radius: 4px;
  padding: 1px 6px;
  color: var(--color-accent);
  font-family: monospace;
}

/* Loading Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

/* Divider */
.auth-divider {
  text-align: center;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  margin: var(--space-xl) 0 var(--space-md);
}

/* ── Background Decoration ───────────────────────────────── */
.auth-bg-decoration {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.deco-1 {
  width: 400px;
  height: 400px;
  background: var(--color-primary);
  top: -100px;
  right: -100px;
}

.deco-2 {
  width: 300px;
  height: 300px;
  background: var(--color-accent);
  bottom: -80px;
  left: -80px;
}

.deco-3 {
  width: 200px;
  height: 200px;
  background: var(--color-neon-purple);
  top: 40%;
  left: 40%;
}
</style>
