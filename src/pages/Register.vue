<!-- ============================================================
     Register.vue — Create Account Page
     Registers a new user via JSON Server + LocalStorage.
     Validates all fields, prevents duplicate emails,
     and auto-logs-in on success.
     ============================================================ -->
<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card glass-card animate-scale-in">

        <!-- Brand Header -->
        <div class="auth-brand">
          <span class="brand-icon">🎬</span>
          <span class="brand-text">Cine<span class="brand-accent">Vault</span></span>
        </div>

        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Join CineVault and start booking today</p>

        <!-- Registration Form -->
        <form class="auth-form" @submit.prevent="handleRegister" novalidate>

          <!-- Full Name -->
          <div class="form-group">
            <label class="form-label" for="name">Full Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="form-input"
              :class="{ 'input-error': fieldErrors.name }"
              placeholder="John Doe"
              @blur="validateField('name')"
            />
            <span v-if="fieldErrors.name" class="form-error">{{ fieldErrors.name }}</span>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input"
              :class="{ 'input-error': fieldErrors.email }"
              placeholder="you@example.com"
              @blur="validateField('email')"
            />
            <span v-if="fieldErrors.email" class="form-error">{{ fieldErrors.email }}</span>
          </div>

          <!-- Phone -->
          <div class="form-group">
            <label class="form-label" for="phone">Phone Number <span class="optional">(optional)</span></label>
            <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="form-input"
                placeholder="9876543210"
                maxlength="10"
                inputmode="numeric"
                pattern="[0-9]*"
                @input="form.phone = $event.target.value.replace(/\D/g, '')"
              />
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div class="password-wrap">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'input-error': fieldErrors.password }"
                placeholder="Min. 6 characters"
                @blur="validateField('password')"
              />
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <span v-if="fieldErrors.password" class="form-error">{{ fieldErrors.password }}</span>
            <!-- Password Strength Meter -->
            <div class="strength-bar" v-if="form.password">
              <div class="strength-fill" :class="strengthClass" :style="{ width: strengthWidth }"></div>
            </div>
            <span class="strength-label" v-if="form.password" :class="strengthClass">{{ strengthLabel }}</span>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label class="form-label" for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              class="form-input"
              :class="{ 'input-error': fieldErrors.confirmPassword }"
              placeholder="Re-enter your password"
              @blur="validateField('confirmPassword')"
            />
            <span v-if="fieldErrors.confirmPassword" class="form-error">{{ fieldErrors.confirmPassword }}</span>
          </div>

          <!-- Global Error Banner -->
          <div class="error-banner" v-if="authError">
            <span>⚠️</span> {{ authError }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary btn-lg w-full"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner"></span>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>

        </form>

        <div class="auth-divider">
          <span>Already have an account?</span>
        </div>

        <router-link to="/login" class="btn btn-outline btn-lg w-full" style="text-align:center;">
          Sign In
        </router-link>

      </div>
    </div>

    <!-- Background Decoration -->
    <div class="auth-bg-decoration">
      <div class="deco-circle deco-1"></div>
      <div class="deco-circle deco-2"></div>
    </div>
  </div>
</template>

<script setup>
/* ── Imports ─────────────────────────────────────────────── */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const router    = useRouter()
const { showToast } = useToast()

const { register, isLoading, error: authError, clearError } = useAuth()

// ── Form State ────────────────────────────────────────────
const form = ref({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
const fieldErrors  = ref({ name: '', email: '', password: '', confirmPassword: '' })
const showPassword = ref(false)

// ── Password Strength ─────────────────────────────────────
const passwordStrength = computed(() => {
  const p = form.value.password
  if (!p) return 0
  let score = 0
  if (p.length >= 6)  score++
  if (p.length >= 10) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthClass = computed(() => {
  const s = passwordStrength.value
  if (s <= 1) return 'strength-weak'
  if (s <= 3) return 'strength-medium'
  return 'strength-strong'
})

const strengthWidth = computed(() => {
  return Math.max(20, (passwordStrength.value / 5) * 100) + '%'
})

const strengthLabel = computed(() => {
  const s = passwordStrength.value
  if (s <= 1) return 'Weak'
  if (s <= 3) return 'Moderate'
  return 'Strong'
})

// ── Field Validation ──────────────────────────────────────
function validateField(field) {
  clearError()
  if (field === 'name') {
    fieldErrors.value.name = form.value.name.trim().length < 2
      ? 'Name must be at least 2 characters.' : ''
  }
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
    fieldErrors.value.password = form.value.password.length < 6
      ? 'Password must be at least 6 characters.' : ''
  }
  if (field === 'confirmPassword') {
    fieldErrors.value.confirmPassword = form.value.password !== form.value.confirmPassword
      ? 'Passwords do not match.' : ''
  }
}

function isFormValid() {
  ;['name', 'email', 'password', 'confirmPassword'].forEach(validateField)
  return Object.values(fieldErrors.value).every(e => !e)
}

// ── Handle Registration ───────────────────────────────────
async function handleRegister() {
  clearError()
  if (!isFormValid()) return

  try {
    await register({
      name:     form.value.name.trim(),
      email:    form.value.email,
      password: form.value.password,
      phone: form.value.phone.replace(/\D/g, '').slice(0, 10)
    })

    showToast?.({ type: 'success', title: 'Account created!', message: 'Welcome to CineVault!' })
    router.push('/')
  } catch (err) {
    showToast?.({ type: 'error', title: 'Registration failed', message: err.message })
  }
}
</script>

<style scoped>
/* ── Inherits layout from Login pattern ─────────────────── */
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
  max-width: 480px;
  position: relative;
  z-index: 2;
}

.auth-card { padding: var(--space-2xl); }

.auth-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  justify-content: center;
  margin-bottom: var(--space-xl);
  color: var(--text-primary);
}

.brand-icon { font-size: 2rem; }
.brand-text { font-family: var(--font-display); font-size: var(--font-size-2xl); font-weight: 800; }
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

.auth-form { display: flex; flex-direction: column; gap: var(--space-lg); }

.optional { color: var(--text-muted); font-size: var(--font-size-xs); }

.input-error { border-color: var(--color-primary) !important; }

.password-wrap { position: relative; }
.password-wrap .form-input { padding-right: 3rem; }
.password-toggle {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  opacity: 0.6;
  transition: opacity var(--transition-fast);
}
.password-toggle:hover { opacity: 1; }

/* Strength Bar */
.strength-bar {
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  margin-top: 6px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.4s ease;
}

.strength-weak   .strength-fill, .strength-fill.strength-weak   { background: var(--color-primary); }
.strength-medium .strength-fill, .strength-fill.strength-medium { background: var(--color-gold); }
.strength-strong .strength-fill, .strength-fill.strength-strong { background: var(--color-neon-green); }

.strength-label {
  font-size: var(--font-size-xs);
  margin-top: 4px;
  display: block;
}
.strength-label.strength-weak   { color: var(--color-primary); }
.strength-label.strength-medium { color: var(--color-gold); }
.strength-label.strength-strong { color: var(--color-neon-green); }

.error-banner {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: rgba(229,9,20,0.1);
  border: 1px solid rgba(229,9,20,0.3);
  border-radius: var(--radius-md);
  color: var(--color-primary-light);
  font-size: var(--font-size-sm);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

.auth-divider {
  text-align: center;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  margin: var(--space-xl) 0 var(--space-md);
}

.auth-bg-decoration { position: fixed; inset: 0; pointer-events: none; z-index: 1; }
.deco-circle { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; }
.deco-1 { width: 400px; height: 400px; background: var(--color-accent); top: -100px; left: -100px; }
.deco-2 { width: 300px; height: 300px; background: var(--color-primary); bottom: -80px; right: -80px; }
</style>
