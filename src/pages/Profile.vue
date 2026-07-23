<!-- ============================================================
     Profile.vue — User Profile Page (Protected)
     Displays and edits user information stored in JSON Server.
     Shows recent bookings summary. Uses PATCH for updates.
     Lifecycle: onMounted loads fresh user + booking data.
     ============================================================ -->
<template>
  <div class="profile-page">
    <div class="container">

      <!-- ── Page Header ── -->
      <div class="page-header animate-fade-in-up">
        <h1 class="page-title heading-display">My <span class="text-gradient">Profile</span></h1>
        <button class="btn btn-outline btn-sm logout-btn" @click="handleLogout">
          🚪 Logout
        </button>
      </div>

      <div class="profile-layout">

        <!-- ── Left: Profile Card ── -->
        <aside class="profile-sidebar">
          <div class="profile-card glass-card">
            <!-- Avatar -->
            <div class="avatar-section">
              <div class="avatar-circle">
                {{ currentUser?.name?.charAt(0)?.toUpperCase() }}
              </div>
              <h2 class="user-name">{{ currentUser?.name }}</h2>
              <p class="user-email">{{ currentUser?.email }}</p>
              <span class="member-since">Member since {{ formatDate(currentUser?.createdAt) }}</span>
            </div>

            <!-- Stats Row -->
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-value">{{ totalBookings }}</span>
                <span class="stat-label">Bookings</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-value">{{ confirmedCount }}</span>
                <span class="stat-label">Confirmed</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-value">₹{{ totalSpent }}</span>
                <span class="stat-label">Spent</span>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="quick-links glass-card">
            <router-link to="/my-bookings" class="quick-link">
              <span>🎟️</span> My Bookings
              <span class="ql-arrow">→</span>
            </router-link>
            <router-link to="/movies" class="quick-link">
              <span>🎬</span> Browse Movies
              <span class="ql-arrow">→</span>
            </router-link>
          </div>
        </aside>

        <!-- ── Right: Edit Form + Recent Bookings ── -->
        <main class="profile-main">

          <!-- Edit Profile Form -->
          <section class="profile-section glass-card">
            <div class="section-head">
              <h3 class="section-head-title">Personal Information</h3>
              <button
                v-if="!isEditing"
                class="btn btn-ghost btn-sm"
                @click="startEdit"
              >✏️ Edit</button>
              <div v-else class="edit-actions">
                <button class="btn btn-ghost btn-sm" @click="cancelEdit">Cancel</button>
                <button
                  class="btn btn-accent btn-sm"
                  :disabled="isSaving"
                  @click="saveProfile"
                >
                  <span v-if="isSaving" class="spinner"></span>
                  {{ isSaving ? 'Saving…' : 'Save Changes' }}
                </button>
              </div>
            </div>

            <!-- View Mode -->
            <div v-if="!isEditing" class="info-grid">
              <div class="info-item">
                <span class="ii-label">Full Name</span>
                <span class="ii-value">{{ currentUser?.name }}</span>
              </div>
              <div class="info-item">
                <span class="ii-label">Email</span>
                <span class="ii-value">{{ currentUser?.email }}</span>
              </div>
              <div class="info-item">
                <span class="ii-label">Phone</span>
                <span class="ii-value">{{ currentUser?.phone || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="ii-label">Account ID</span>
                <span class="ii-value">#{{ currentUser?.id }}</span>
              </div>
            </div>

            <!-- Edit Mode -->
            <form v-else class="edit-form" @submit.prevent="saveProfile" novalidate>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input
                    v-model="editForm.name"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': editErrors.name }"
                    @blur="validateEdit('name')"
                  />
                  <span v-if="editErrors.name" class="form-error">{{ editErrors.name }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label">Phone</label>
                  <input
                    v-model="editForm.phone"
                    type="tel"
                    class="form-input"
                    placeholder="9876543210"
                    maxlength="10"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    @input="editForm.phone = $event.target.value.replace(/\D/g, '')"
                  />
                </div>
              </div>

              <!-- Error/Success Banner -->
              <div class="save-error" v-if="saveError">⚠️ {{ saveError }}</div>
            </form>
          </section>

          <!-- Change Password Section -->
          <section class="profile-section glass-card">
            <div class="section-head">
              <h3 class="section-head-title">Security</h3>
              <button class="btn btn-ghost btn-sm" @click="showPasswordForm = !showPasswordForm">
                {{ showPasswordForm ? 'Cancel' : '🔑 Change Password' }}
              </button>
            </div>

            <div v-if="!showPasswordForm" class="security-row">
              <span class="security-label">Password</span>
              <span class="security-value">••••••••</span>
            </div>

            <form v-else class="edit-form" @submit.prevent="changePassword" novalidate>
              <div class="form-group">
                <label class="form-label">Current Password</label>
                <input v-model="pwForm.current" type="password" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">New Password</label>
                <input v-model="pwForm.newPw" type="password" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Confirm New Password</label>
                <input v-model="pwForm.confirm" type="password" class="form-input" />
              </div>
              <div class="save-error" v-if="pwError">⚠️ {{ pwError }}</div>
              <button type="submit" class="btn btn-accent" :disabled="isSavingPw">
                {{ isSavingPw ? 'Updating…' : 'Update Password' }}
              </button>
            </form>
          </section>

          <!-- Recent Bookings Preview -->
          <section class="profile-section glass-card">
            <div class="section-head">
              <h3 class="section-head-title">Recent Bookings</h3>
              <router-link to="/my-bookings" class="btn btn-ghost btn-sm">View All →</router-link>
            </div>

            <div v-if="bookingsLoading" class="bookings-skeleton">
              <div v-for="n in 3" :key="n" class="skeleton skeleton-text"></div>
            </div>

            <div v-else-if="recentBookings.length === 0" class="no-bookings">
              <span>🎟️</span>
              <p>No bookings yet.</p>
              <router-link to="/movies" class="btn btn-accent btn-sm">Book Now</router-link>
            </div>

            <div v-else class="recent-list">
              <div
                v-for="booking in recentBookings"
                :key="booking.id"
                class="recent-item"
              >
                <div class="ri-left">
                  <span class="ri-title">{{ booking.movieTitle }}</span>
                  <span class="ri-meta">{{ booking.theatre }} • {{ formatDate(booking.date) }}</span>
                </div>
                <div class="ri-right">
                  <span class="ri-price">₹{{ booking.totalPrice }}</span>
                  <span class="ri-status badge" :class="booking.status === 'confirmed' ? 'badge-green' : 'badge-primary'">
                    {{ booking.status }}
                  </span>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
/* ── Imports ─────────────────────────────────────────────── */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useBookings } from '@/composables/useBookings'
import { usersAPI } from '@/services/api'
import { useToast } from '@/composables/useToast'

const router    = useRouter()
const { showToast } = useToast()

// ── Auth Composable ───────────────────────────────────────
const { currentUser, logout, updateProfile } = useAuth()

// ── Bookings Composable ───────────────────────────────────
const { bookings, isLoading: bookingsLoading, fetchUserBookings } = useBookings()

// ── Local State ────────────────────────────────────────────
const isEditing       = ref(false)
const isSaving        = ref(false)
const saveError       = ref('')
const showPasswordForm = ref(false)
const isSavingPw      = ref(false)
const pwError         = ref('')

const editForm = ref({ name: '', phone: '' })
const editErrors = ref({ name: '' })
const pwForm   = ref({ current: '', newPw: '', confirm: '' })

// ── Computed stats ────────────────────────────────────────
const totalBookings  = computed(() => bookings.value.length)
const confirmedCount = computed(() => bookings.value.filter(b => b.status === 'confirmed').length)
const totalSpent     = computed(() =>
  bookings.value.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.totalPrice || 0), 0)
)
const recentBookings = computed(() => bookings.value.slice(0, 5))

// ── Lifecycle: load data on mount ─────────────────────────
onMounted(() => {
  fetchUserBookings()
})

// ── Edit Profile ──────────────────────────────────────────
function startEdit() {
  editForm.value = { name: currentUser.value?.name || '', phone: currentUser.value?.phone || '' }
  editErrors.value = { name: '' }
  saveError.value = ''
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  saveError.value = ''
}

function validateEdit(field) {
  if (field === 'name') {
    editErrors.value.name = editForm.value.name.trim().length < 2
      ? 'Name must be at least 2 characters.' : ''
  }
}

async function saveProfile() {
  validateEdit('name')
  if (editErrors.value.name) return
  isSaving.value = true
  saveError.value = ''
  try {
    await updateProfile({
      name: editForm.value.name.trim(),
      phone: editForm.value.phone.replace(/\D/g, '').slice(0, 10)
    })
    isEditing.value = false
    showToast?.({ type: 'success', title: 'Profile Updated', message: 'Your details have been saved.' })
  } catch (err) {
    saveError.value = err.message || 'Update failed. Please try again.'
  } finally {
    isSaving.value = false
  }
}

// ── Change Password ───────────────────────────────────────
async function changePassword() {
  pwError.value = ''
  if (!pwForm.value.current) { pwError.value = 'Enter your current password.'; return }
  if (pwForm.value.newPw.length < 6) { pwError.value = 'New password must be at least 6 characters.'; return }
  if (pwForm.value.newPw !== pwForm.value.confirm) { pwError.value = 'Passwords do not match.'; return }

  isSavingPw.value = true
  try {
    // Fetch full user record to verify current password
    const { data: users } = await usersAPI.getAll({ email: currentUser.value.email })
    if (!users.length || users[0].password !== pwForm.value.current) {
      throw { message: 'Current password is incorrect.' }
    }
    await usersAPI.patch(currentUser.value.id, { password: pwForm.value.newPw })
    showToast?.({ type: 'success', title: 'Password Updated', message: 'Your password has been changed.' })
    showPasswordForm.value = false
    pwForm.value = { current: '', newPw: '', confirm: '' }
  } catch (err) {
    pwError.value = err.message || 'Failed to update password.'
  } finally {
    isSavingPw.value = false
  }
}

// ── Logout ────────────────────────────────────────────────
function handleLogout() {
  logout()
  showToast?.({ type: 'info', title: 'Signed out', message: 'See you next time!' })
  router.push('/')
}

// ── Format date ───────────────────────────────────────────
function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.profile-page { padding: var(--space-2xl) 0 var(--space-4xl); }

/* ── Header ──────────────────────────────────────────────── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}
.page-title { font-size: var(--font-size-4xl); }

/* ── Layout ──────────────────────────────────────────────── */
.profile-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--space-xl);
  align-items: start;
}

/* ── Sidebar ─────────────────────────────────────────────── */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  position: sticky;
  top: 88px;
}

.profile-card { padding: var(--space-xl); text-align: center; }

.avatar-section { margin-bottom: var(--space-xl); }

.avatar-circle {
  width: 90px;
  height: 90px;
  border-radius: var(--radius-full);
  background: var(--gradient-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: var(--font-size-4xl);
  font-weight: 800;
  color: #fff;
  margin: 0 auto var(--space-md);
  box-shadow: var(--shadow-glow);
}

.user-name { font-family: var(--font-display); font-size: var(--font-size-2xl); font-weight: 700; }
.user-email { color: var(--text-muted); font-size: var(--font-size-sm); margin-top: 4px; }
.member-since {
  display: inline-block;
  margin-top: var(--space-sm);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-color);
}

.stat-item { text-align: center; }
.stat-value { display: block; font-family: var(--font-display); font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-accent); }
.stat-label { font-size: var(--font-size-xs); color: var(--text-muted); margin-top: 2px; }
.stat-divider { width: 1px; height: 40px; background: var(--border-color); }

/* Quick Links */
.quick-links { padding: var(--space-md); display: flex; flex-direction: column; gap: 4px; }

.quick-link {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 0.75rem var(--space-md);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.quick-link:hover { background: var(--bg-glass-hover); color: var(--color-accent); }
.ql-arrow { margin-left: auto; }

/* ── Main ────────────────────────────────────────────────── */
.profile-main { display: flex; flex-direction: column; gap: var(--space-xl); }

.profile-section { padding: var(--space-xl); }

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.section-head-title { font-family: var(--font-display); font-size: var(--font-size-xl); font-weight: 700; }
.edit-actions { display: flex; gap: var(--space-sm); }

/* Info Grid (View Mode) */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
}

.info-item { display: flex; flex-direction: column; gap: 6px; }
.ii-label { font-size: var(--font-size-xs); color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.ii-value { font-size: var(--font-size-base); font-weight: 500; }

/* Edit Form */
.edit-form { display: flex; flex-direction: column; gap: var(--space-lg); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); }
.input-error { border-color: var(--color-primary) !important; }

.save-error {
  color: var(--color-primary-light);
  font-size: var(--font-size-sm);
  background: rgba(229,9,20,0.08);
  border: 1px solid rgba(229,9,20,0.2);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
}

/* Security */
.security-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
.security-label { color: var(--text-muted); }
.security-value { letter-spacing: 0.1em; }

/* Recent Bookings */
.bookings-skeleton { display: flex; flex-direction: column; gap: var(--space-sm); }

.no-bookings {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-2xl) 0;
  text-align: center;
  color: var(--text-muted);
}
.no-bookings span { font-size: 2.5rem; }

.recent-list { display: flex; flex-direction: column; gap: 0; }

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-md) 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  flex-wrap: wrap;
}

.recent-item:last-child { border-bottom: none; }

.ri-left { display: flex; flex-direction: column; gap: 4px; }
.ri-title { font-weight: 600; font-size: var(--font-size-sm); }
.ri-meta { color: var(--text-muted); font-size: var(--font-size-xs); }

.ri-right { display: flex; align-items: center; gap: var(--space-md); }
.ri-price { font-family: var(--font-display); font-weight: 700; color: var(--color-neon-green); }

/* Spinner */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1024px) {
  .profile-layout { grid-template-columns: 1fr; }
  .profile-sidebar { position: static; }
  .info-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 600px) {
  .info-grid { grid-template-columns: 1fr; }
  .form-row  { grid-template-columns: 1fr; }
}
</style>
