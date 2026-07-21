<!-- ============================================================
     MyBookings.vue — Booking History Page (Protected)
     Lists all bookings for the current user. Supports search,
     cancel booking with confirmation modal, and delete.
     CRUD: PATCH (cancel) + DELETE operations via bookingsAPI.
     ============================================================ -->
<template>
  <div class="my-bookings-page">
    <div class="container">

      <!-- ── Page Header ── -->
      <div class="page-header animate-fade-in-up">
        <div>
          <h1 class="page-title heading-display">My <span class="text-gradient">Bookings</span></h1>
          <p class="page-subtitle">Your complete booking history</p>
        </div>
        <router-link to="/movies" class="btn btn-accent btn-sm">Book More Tickets</router-link>
      </div>

      <!-- ── Search & Filter ── -->
      <div class="bookings-toolbar glass-card">
        <div class="search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="bookingSearch"
            type="text"
            placeholder="Search by movie, theatre or booking ID..."
            class="form-input search-field"
          />
        </div>
        <div class="filter-tabs">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            class="tab-btn"
            :class="{ active: activeTab === tab.value }"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- ── Loading ── -->
      <div v-if="isLoading" class="bookings-grid">
        <div v-for="n in 3" :key="n" class="skeleton" style="height: 200px; border-radius: 16px;"></div>
      </div>

      <!-- ── Empty State ── -->
      <div v-else-if="displayBookings.length === 0" class="empty-state glass-card">
        <span class="empty-icon">🎟️</span>
        <h3>No bookings found</h3>
        <p v-if="hasFilters">Try changing your search or filter.</p>
        <p v-else>You haven't booked any tickets yet. Start exploring movies!</p>
        <router-link to="/movies" class="btn btn-primary">Browse Movies</router-link>
      </div>

      <!-- ── Bookings List ── -->
      <div v-else class="bookings-grid">
        <div
          v-for="booking in displayBookings"
          :key="booking.id"
          class="booking-card glass-card animate-fade-in-up"
          :class="{ 'booking-cancelled': booking.status === 'cancelled' }"
        >
          <!-- Poster -->
          <div class="booking-poster">
            <img
              :src="booking.moviePoster"
              :alt="booking.movieTitle"
              @error="handlePosterError"
            />
          </div>

          <!-- Info -->
          <div class="booking-info">
            <div class="booking-top">
              <div>
                <h3 class="booking-movie">{{ booking.movieTitle }}</h3>
                <p class="booking-id">Booking #{{ booking.id }}</p>
              </div>
              <span
                class="booking-status badge"
                :class="statusBadge(booking.status)"
              >
                {{ booking.status === 'confirmed' ? '✓ Confirmed' : '✗ Cancelled' }}
              </span>
            </div>

            <div class="booking-details">
              <div class="bd-item">
                <span class="bd-icon">🏛️</span>
                <span>{{ booking.theatre }}</span>
              </div>
              <div class="bd-item">
                <span class="bd-icon">📅</span>
                <span>{{ formatDate(booking.date) }}</span>
              </div>
              <div class="bd-item">
                <span class="bd-icon">🕐</span>
                <span>{{ booking.time }}</span>
              </div>
              <div class="bd-item">
                <span class="bd-icon">💺</span>
                <span>{{ booking.seatNumbers?.join(', ') }}</span>
              </div>
            </div>

            <div class="booking-footer">
              <div class="booking-price">
                <span class="bp-label">Total Paid</span>
                <span class="bp-amount">₹{{ booking.totalPrice }}</span>
              </div>

              <div class="booking-actions">
                <span class="booked-on">Booked {{ formatDateTime(booking.bookingDate) }}</span>
                <button
                  v-if="booking.status === 'confirmed'"
                  class="btn btn-outline btn-sm cancel-btn"
                  @click="promptCancel(booking)"
                >
                  Cancel
                </button>
                <button
                  class="btn btn-ghost btn-sm"
                  @click="promptDelete(booking)"
                  title="Remove from history"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ── Cancel Confirmation Modal ── -->
    <ConfirmModal
      :show="showCancelModal"
      title="Cancel Booking?"
      :message="`Cancel your booking for '${selectedBooking?.movieTitle}'? Your seats will be released.`"
      confirm-text="Yes, Cancel"
      cancel-text="Keep Booking"
      type="danger"
      @confirm="handleCancel"
      @cancel="showCancelModal = false"
    />

    <!-- ── Delete Confirmation Modal ── -->
    <ConfirmModal
      :show="showDeleteModal"
      title="Remove Booking?"
      :message="`Remove this booking record for '${selectedBooking?.movieTitle}' from your history?`"
      confirm-text="Remove"
      cancel-text="Keep"
      type="danger"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
/* ── Imports ─────────────────────────────────────────────── */
import { ref, computed, onMounted } from 'vue'
import { useBookings } from '@/composables/useBookings'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

// ── Composable ────────────────────────────────────────────
const { bookings, isLoading, bookingSearch, filteredBookings, fetchUserBookings, cancelBooking, deleteBooking } = useBookings()

// ── Local State ────────────────────────────────────────────
const activeTab         = ref('all')
const showCancelModal   = ref(false)
const showDeleteModal   = ref(false)
const selectedBooking   = ref(null)

const statusTabs = [
  { label: 'All',       value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled' }
]

// ── Computed: apply status tab on top of search filter ───
const displayBookings = computed(() => {
  const searched = filteredBookings.value
  if (activeTab.value === 'all') return searched
  return searched.filter(b => b.status === activeTab.value)
})

const hasFilters = computed(() => !!(bookingSearch.value || activeTab.value !== 'all'))

// ── Lifecycle: fetch user bookings on mount ───────────────
onMounted(() => {
  fetchUserBookings()
})

// ── Modal Triggers ────────────────────────────────────────
function promptCancel(booking) {
  selectedBooking.value = booking
  showCancelModal.value = true
}

function promptDelete(booking) {
  selectedBooking.value = booking
  showDeleteModal.value = true
}

// ── CRUD: Cancel Booking ──────────────────────────────────
async function handleCancel() {
  showCancelModal.value = false
  try {
    await cancelBooking(selectedBooking.value.id)
    showToast?.({ type: 'success', title: 'Booking Cancelled', message: 'Your seats have been released.' })
  } catch {
    showToast?.({ type: 'error', title: 'Cancel Failed', message: 'Could not cancel. Please try again.' })
  }
}

// ── CRUD: Delete Booking ──────────────────────────────────
async function handleDelete() {
  showDeleteModal.value = false
  try {
    await deleteBooking(selectedBooking.value.id)
    showToast?.({ type: 'info', title: 'Removed', message: 'Booking removed from your history.' })
  } catch {
    showToast?.({ type: 'error', title: 'Error', message: 'Could not remove booking.' })
  }
}

// ── Helper: Badge Class ───────────────────────────────────
function statusBadge(status) {
  return status === 'confirmed' ? 'badge-green' : 'badge-primary'
}

// ── Helper: format dates ──────────────────────────────────
function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateTime(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Image fallback ────────────────────────────────────────
function handlePosterError(e) {
  e.target.src = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="120" fill="%2312122a"><rect width="80" height="120"/><text x="40" y="65" text-anchor="middle" fill="%236b6b8d" font-size="20">🎬</text></svg>'
  )
}
</script>

<style scoped>
.my-bookings-page { padding: var(--space-2xl) 0 var(--space-4xl); }

/* ── Page Header ─────────────────────────────────────────── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}
.page-title { font-size: var(--font-size-4xl); }
.page-subtitle { color: var(--text-muted); font-size: var(--font-size-sm); margin-top: 4px; }

/* ── Toolbar ─────────────────────────────────────────────── */
.bookings-toolbar {
  padding: var(--space-lg);
  display: flex;
  gap: var(--space-lg);
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-xl);
}

.search-wrap {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  min-width: 220px;
}

.search-wrap svg {
  position: absolute;
  left: 0.875rem;
  color: var(--text-muted);
  pointer-events: none;
}

.search-field { padding-left: 2.5rem; }

.filter-tabs { display: flex; gap: 6px; }

.tab-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background: var(--bg-glass);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.tab-btn.active,
.tab-btn:hover {
  background: rgba(0,212,255,0.1);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* ── Bookings Grid ───────────────────────────────────────── */
.bookings-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ── Booking Card ────────────────────────────────────────── */
.booking-card {
  display: flex;
  gap: var(--space-xl);
  padding: var(--space-xl);
  transition: all var(--transition-base);
}

.booking-cancelled {
  opacity: 0.6;
  border-style: dashed;
}

.booking-poster {
  flex-shrink: 0;
  width: 80px;
}

.booking-poster img {
  width: 100%;
  border-radius: var(--radius-md);
  object-fit: cover;
  aspect-ratio: 2/3;
}

.booking-info { flex: 1; display: flex; flex-direction: column; gap: var(--space-md); }

/* Booking top row */
.booking-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.booking-movie {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: 4px;
}

.booking-id {
  color: var(--text-muted);
  font-size: var(--font-size-xs);
}

/* Booking details */
.booking-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-sm) var(--space-xl);
}

.bd-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.bd-icon { font-size: 1rem; }

/* Booking footer */
.booking-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-color);
}

.booking-price { display: flex; flex-direction: column; gap: 2px; }
.bp-label { font-size: var(--font-size-xs); color: var(--text-muted); }
.bp-amount {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-neon-green);
}

.booking-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.booked-on { font-size: var(--font-size-xs); color: var(--text-muted); }

.cancel-btn {
  border-color: rgba(229,9,20,0.3);
  color: var(--color-primary-light);
}
.cancel-btn:hover {
  background: rgba(229,9,20,0.1);
  border-color: var(--color-primary);
}

/* ── Empty State ─────────────────────────────────────────── */
.empty-state {
  padding: var(--space-4xl) var(--space-xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.empty-icon { font-size: 4rem; }
.empty-state h3 { font-family: var(--font-display); font-size: var(--font-size-2xl); }
.empty-state p { color: var(--text-muted); max-width: 360px; }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 600px) {
  .booking-card { flex-direction: column; }
  .booking-poster { width: 60px; }
  .bookings-toolbar { flex-direction: column; align-items: stretch; }
  .filter-tabs { flex-wrap: wrap; }
}
</style>
