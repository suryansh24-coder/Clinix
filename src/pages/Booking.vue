<!-- ============================================================
     Booking.vue — PVR-Style Seat Selection & Booking Page
     Professional tiered seat layout with color-coded availability.
     Green = Available, Red = Reserved/Booked, Cyan = Your Selection.
     CRUD: creates booking record, updates show available seats.
     ============================================================ -->
<template>
  <div class="booking-page">
    <div class="container">

      <!-- ── Breadcrumb ── -->
      <nav class="breadcrumb animate-fade-in-up">
        <router-link to="/">Home</router-link>
        <span>›</span>
        <router-link to="/movies">Movies</router-link>
        <span>›</span>
        <router-link v-if="movie" :to="{ name: 'MovieDetails', params: { id: movieId } }">
          {{ movie.title }}
        </router-link>
        <span>›</span>
        <span class="breadcrumb-active">Book Tickets</span>
      </nav>

      <!-- ── Loading ── -->
      <div v-if="pageLoading" class="page-loading">
        <LoadingSpinner />
        <p>Loading seat map…</p>
      </div>

      <!-- ── Error ── -->
      <div v-else-if="pageError" class="page-error glass-card">
        <span>⚠️</span>
        <h3>{{ pageError }}</h3>
        <router-link to="/movies" class="btn btn-accent">Browse Movies</router-link>
      </div>

      <!-- ── Booking Layout ── -->
      <div v-else-if="movie && show" class="booking-layout">

        <!-- ── Left: Movie Info + Seat Map ── -->
        <main class="booking-main">

          <!-- Movie Summary Card -->
          <div class="movie-summary glass-card animate-fade-in-up">
            <img :src="movie.poster" :alt="movie.title" class="summary-poster" />
            <div class="summary-info">
              <h2 class="summary-title">{{ movie.title }}</h2>
              <p class="summary-meta">{{ movie.language }} • {{ movie.certificate }} • {{ movie.duration }}</p>
              <div class="summary-show">
                <span>🏛️ {{ theatreName }}</span>
                <span>📅 {{ formatDate(show.date) }}</span>
                <span>🕐 {{ show.time }}</span>
              </div>
            </div>
          </div>

          <!-- ── Show Time Selector (PVR-style) ── -->
          <div class="showtime-selector glass-card animate-fade-in-up">
            <div class="showtime-header">
              <div class="showtime-date-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ formatDateShort(show.date) }}
              </div>
              <div class="showtime-ticket-count" v-if="selectedSeats.length">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 10V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 110 4v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 110-4z"/></svg>
                {{ selectedSeats.length }} {{ selectedSeats.length === 1 ? 'Ticket' : 'Tickets' }}
              </div>
            </div>
            <div class="showtime-slots">
              <button
                v-for="s in sameTheatreShows"
                :key="s.id"
                class="showtime-slot"
                :class="{ active: s.id === show.id, 'low-availability': s.availableSeats < 20 && s.id !== show.id }"
                @click="switchShow(s)"
                :disabled="s.availableSeats === 0"
              >
                <span class="slot-time">{{ s.time }}</span>
                <span v-if="s.format" class="slot-format">{{ s.format }}</span>
                <span class="slot-avail" :class="getAvailClass(s.availableSeats)">
                  {{ s.availableSeats === 0 ? 'Housefull' : s.availableSeats < 20 ? 'Filling Fast' : 'Available' }}
                </span>
              </button>
            </div>
          </div>

          <!-- ── PVR-Style Seat Map ── -->
          <div class="seat-map-section glass-card">

            <!-- Screen Indicator -->
            <div class="screen-container">
              <div class="screen-curve">
                <span class="screen-text">SCREEN THIS WAY</span>
              </div>
            </div>

            <!-- Seat Legend -->
            <div class="seat-legend">
              <div class="legend-item">
                <div class="seat-demo legend-available"></div>
                <span>Available</span>
              </div>
              <div class="legend-item">
                <div class="seat-demo legend-selected"></div>
                <span>Selected</span>
              </div>
              <div class="legend-item">
                <div class="seat-demo legend-booked"></div>
                <span>Reserved</span>
              </div>
            </div>

            <!-- ── Tiered Seat Grid ── -->
            <div class="seat-tiers">

              <!-- PRIME Tier -->
              <div class="seat-tier">
                <div class="tier-header">
                  <span class="tier-price">₹{{ getTierPrice('PRIME') }} &nbsp;PRIME</span>
                </div>
                <div class="tier-rows">
                  <div v-for="row in primeRows" :key="row" class="seat-row">
                    <span class="row-label">{{ row }}</span>
                    <div class="row-seats">
                      <template v-for="col in COLS" :key="`${row}${col}`">
                        <div v-if="col === 16 || col === 6" class="aisle-gap"></div>
                        <button
                          class="seat"
                          :class="getSeatClass(`${row}${col}`)"
                          :disabled="isBooked(`${row}${col}`)"
                          @click="toggleSeat(`${row}${col}`)"
                          :title="`Seat ${row}${col}`"
                        >
                          {{ col }}
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

              <!-- PICTURE PERFECT Tier -->
              <div class="seat-tier">
                <div class="tier-header">
                  <span class="tier-price">₹{{ getTierPrice('PICTURE_PERFECT') }} &nbsp;PICTURE PERFECT</span>
                </div>
                <div class="tier-rows">
                  <div v-for="row in picturePerfectRows" :key="row" class="seat-row">
                    <span class="row-label">{{ row }}</span>
                    <div class="row-seats">
                      <template v-for="col in COLS" :key="`${row}${col}`">
                        <div v-if="col === 16 || col === 6" class="aisle-gap"></div>
                        <button
                          class="seat"
                          :class="getSeatClass(`${row}${col}`)"
                          :disabled="isBooked(`${row}${col}`)"
                          @click="toggleSeat(`${row}${col}`)"
                          :title="`Seat ${row}${col}`"
                        >
                          {{ col }}
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CLASSIC Tier -->
              <div class="seat-tier">
                <div class="tier-header">
                  <span class="tier-price">₹{{ getTierPrice('CLASSIC') }} &nbsp;CLASSIC</span>
                </div>
                <div class="tier-rows">
                  <div v-for="row in classicRows" :key="row" class="seat-row">
                    <span class="row-label">{{ row }}</span>
                    <div class="row-seats">
                      <template v-for="col in COLS" :key="`${row}${col}`">
                        <div v-if="col === 16 || col === 6" class="aisle-gap"></div>
                        <button
                          class="seat"
                          :class="getSeatClass(`${row}${col}`)"
                          :disabled="isBooked(`${row}${col}`)"
                          @click="toggleSeat(`${row}${col}`)"
                          :title="`Seat ${row}${col}`"
                        >
                          {{ col }}
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Max Seats Warning -->
            <p class="max-seats-note" v-if="selectedSeats.length >= 10">
              ⚠️ Maximum 10 seats per booking
            </p>
          </div>
        </main>

        <!-- ── Right: Booking Summary Sidebar ── -->
        <aside class="booking-sidebar">
          <div class="summary-card glass-card">
            <h3 class="summary-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 110 4v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 110-4z"/></svg>
              Booking Summary
            </h3>

            <!-- Movie Mini Info -->
            <div class="summary-movie-info">
              <img :src="movie.poster" :alt="movie.title" class="summary-mini-poster" />
              <div>
                <p class="summary-movie-name">{{ movie.title }}</p>
                <p class="summary-movie-meta">{{ movie.language }} • {{ movie.certificate }}</p>
              </div>
            </div>

            <!-- Show Info -->
            <div class="summary-show-info">
              <div class="show-info-item">
                <span class="show-info-icon">🏛️</span>
                <span>{{ theatreName }}</span>
              </div>
              <div class="show-info-item">
                <span class="show-info-icon">📅</span>
                <span>{{ formatDate(show.date) }}</span>
              </div>
              <div class="show-info-item">
                <span class="show-info-icon">🕐</span>
                <span>{{ show.time }}</span>
              </div>
            </div>

            <hr class="divider" />

            <!-- Selected Seats -->
            <div class="summary-row">
              <span class="sr-label">Selected Seats</span>
              <div class="selected-seats-display">
                <span
                  v-for="seat in selectedSeats"
                  :key="seat"
                  class="seat-pill"
                >{{ seat }}</span>
                <span v-if="!selectedSeats.length" class="no-seats">None selected</span>
              </div>
            </div>

            <hr class="divider" />

            <!-- Price Breakdown -->
            <div class="price-breakdown">
              <div class="summary-row" v-for="tier in selectedTierBreakdown" :key="tier.name">
                <span class="sr-label">{{ tier.name }} ({{ tier.count }} × ₹{{ tier.unitPrice }})</span>
                <span class="sr-value">₹{{ tier.total }}</span>
              </div>
            </div>

            <div class="summary-row" v-if="selectedSeats.length">
              <span class="sr-label">Convenience Fee</span>
              <span class="sr-value">₹{{ convenienceFee }}</span>
            </div>

            <hr class="divider" />

            <div class="summary-row total-row">
              <span class="total-label">Total Amount</span>
              <span class="total-value">₹{{ grandTotal }}</span>
            </div>

            <!-- Available Seat Count -->
            <div class="availability-bar">
              <span class="avail-label" :class="availClass">
                {{ show.availableSeats }} / {{ show.totalSeats }} seats available
              </span>
            </div>

            <!-- Pay Button (Opens Payment Modal) -->
            <button
              class="btn btn-primary btn-lg w-full confirm-btn"
              :disabled="!selectedSeats.length"
              @click="openPaymentModal"
            >
              {{ selectedSeats.length ? `Proceed to Pay ₹${grandTotal}` : 'Select Seats to Continue' }}
            </button>

            <p class="booking-note">
              🔒 Booking is secured with end-to-end encryption. Cancellation available from My Bookings.
            </p>
          </div>
        </aside>
      </div>

    </div>

    <!-- ── Payment Modal ── -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="showPaymentModal" class="success-overlay" @click.self="showPaymentModal = false">
          <div class="payment-modal glass-card animate-scale-in">
            <h2 class="payment-title">Payment Options</h2>
            <div class="payment-amount">Amount Payable: <span>₹{{ grandTotal }}</span></div>
            
            <div class="payment-methods">
              <label class="payment-option" :class="{ 'active': paymentMethod === 'upi' }">
                <input type="radio" v-model="paymentMethod" value="upi" />
                <span class="pay-icon">📱</span>
                <span class="pay-text">UPI / QR (GPay, PhonePe, Paytm)</span>
              </label>
              
              <label class="payment-option" :class="{ 'active': paymentMethod === 'card' }">
                <input type="radio" v-model="paymentMethod" value="card" />
                <span class="pay-icon">💳</span>
                <span class="pay-text">Credit / Debit Card</span>
              </label>
              
              <label class="payment-option" :class="{ 'active': paymentMethod === 'netbanking' }">
                <input type="radio" v-model="paymentMethod" value="netbanking" />
                <span class="pay-icon">🏦</span>
                <span class="pay-text">Net Banking</span>
              </label>
            </div>

            <!-- Card Input (Mock) if card is selected -->
            <div v-if="paymentMethod === 'card'" class="mock-card-input animate-fade-in-up">
              <input type="text" placeholder="Card Number (e.g. 4111...)" class="pay-input" />
              <div class="pay-input-row">
                <input type="text" placeholder="MM/YY" class="pay-input" />
                <input type="text" placeholder="CVV" class="pay-input" />
              </div>
            </div>

            <div class="payment-actions">
              <button class="btn btn-ghost" :disabled="bookingLoading" @click="showPaymentModal = false">Cancel</button>
              <button class="btn btn-primary" :disabled="!paymentMethod || bookingLoading" @click="confirmBooking">
                <span v-if="bookingLoading" class="spinner"></span>
                {{ bookingLoading ? 'Processing...' : `Pay ₹${grandTotal}` }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- ── Success Modal ── -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="bookingSuccess" class="success-overlay" @click.self="goToBookings">
          <div class="success-modal glass-card animate-scale-in">
            <div class="success-check">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#22c55e" stroke-width="3" fill="rgba(34,197,94,0.1)"/>
                <path d="M20 33L28 41L44 23" stroke="#22c55e" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="check-path"/>
              </svg>
            </div>
            <h2 class="success-title">Booking Confirmed!</h2>
            <p class="success-subtitle">Your tickets have been booked successfully. Enjoy your movie!</p>

            <div class="success-details">
              <div class="sd-row">
                <span>Movie</span>
                <span>{{ movie?.title }}</span>
              </div>
              <div class="sd-row">
                <span>Theatre</span>
                <span>{{ theatreName }}</span>
              </div>
              <div class="sd-row">
                <span>Showtime</span>
                <span>{{ show?.time }} • {{ formatDate(show?.date) }}</span>
              </div>
              <div class="sd-row">
                <span>Seats</span>
                <span>{{ confirmedBooking?.seatNumbers?.join(', ') }}</span>
              </div>
              <div class="sd-row sd-row-total">
                <span>Total Paid ({{ paymentMethod.toUpperCase() }})</span>
                <span>₹{{ confirmedBooking?.totalPrice }}</span>
              </div>
              <div class="sd-row">
                <span>Booking ID</span>
                <span class="booking-id-tag">#{{ confirmedBooking?.id }}</span>
              </div>
            </div>

            <div class="success-actions">
              <button class="btn btn-primary btn-lg" @click="goToBookings">View My Bookings</button>
              <router-link to="/movies" class="btn btn-ghost btn-lg">Browse More</router-link>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
/* ── Imports ─────────────────────────────────────────────── */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookings } from '@/composables/useBookings'
import { moviesAPI, showsAPI, theatresAPI } from '@/services/api'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useToast } from '@/composables/useToast'

/* ── Props from Router ───────────────────────────────────── */
const props    = defineProps({ movieId: { type: String, required: true }, showId: { type: String, required: true } })
const router   = useRouter()
const { showToast } = useToast()

// ── Bookings Composable ───────────────────────────────────
const { selectedSeats, isSeatSelected, toggleSeat, clearSeats, createBooking, getBookedSeats, setBookingContext } = useBookings()

// ── Local state ────────────────────────────────────────────
const movie             = ref(null)
const show              = ref(null)
const theatreName       = ref('')
const bookedSeatNums    = ref([])
const pageLoading       = ref(true)
const pageError         = ref('')
const bookingLoading    = ref(false)
const bookingSuccess    = ref(false)
const confirmedBooking  = ref(null)
const showPaymentModal  = ref(false)
const paymentMethod     = ref('upi')
const sameTheatreShows  = ref([])  // Other show times at same theatre

// ── Seat Layout Configuration ────────────────────────────
// PVR usually numbers from right to left.
const COLS = Array.from({length: 22}, (_, i) => 22 - i)

// PVR rows go from A to P (bottom up), let's render them P down to A
const primeRows          = ['P', 'N', 'M', 'L']
const picturePerfectRows = ['K', 'J', 'H']
const classicRows        = ['G', 'F', 'E', 'D', 'C', 'B', 'A']

// ── Tier Price Multipliers ────────────────────────────────
function getTierPrice(tier) {
  const base = show.value?.price || 0
  switch (tier) {
    case 'PRIME':           return Math.round(base * 1.5)
    case 'PICTURE_PERFECT': return Math.round(base * 1.2)
    case 'CLASSIC':         return base
    case 'VALUE':           return Math.round(base * 0.8)
    default: return base
  }
}

function getSeatTier(seatId) {
  const row = seatId.charAt(0)
  if (['P', 'N', 'M', 'L'].includes(row)) return 'PRIME'
  if (['K', 'J', 'H'].includes(row)) return 'PICTURE_PERFECT'
  return 'CLASSIC'
}

function getSeatPrice(seatId) {
  return getTierPrice(getSeatTier(seatId))
}

// ── Price Calculation ─────────────────────────────────────
const seatTotal = computed(() => {
  return selectedSeats.value.reduce((sum, seatId) => sum + getSeatPrice(seatId), 0)
})

const convenienceFee = computed(() => selectedSeats.value.length ? Math.round(seatTotal.value * 0.05) : 0)
const grandTotal     = computed(() => seatTotal.value + convenienceFee.value)

// ── Tier breakdown for sidebar ────────────────────────────
const selectedTierBreakdown = computed(() => {
  const tiers = {}
  selectedSeats.value.forEach(seatId => {
    const tier = getSeatTier(seatId)
    const price = getTierPrice(tier)
    const name = tier.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()).replace('Picture Perfect', 'Picture Perfect')
    if (!tiers[tier]) {
      tiers[tier] = { name: tier === 'PICTURE_PERFECT' ? 'Picture Perfect' : tier.charAt(0) + tier.slice(1).toLowerCase(), count: 0, unitPrice: price, total: 0 }
    }
    tiers[tier].count++
    tiers[tier].total += price
  })
  return Object.values(tiers)
})

// ── Seat Availability Color ───────────────────────────────
const availClass = computed(() => {
  const avail = show.value?.availableSeats ?? 0
  if (avail === 0)  return 'avail-none'
  if (avail < 20)   return 'avail-low'
  if (avail < 60)   return 'avail-medium'
  return 'avail-high'
})

// ── Seat state helpers ───────────────────────────────────
function isBooked(seatId) {
  return bookedSeatNums.value.includes(seatId)
}

function getSeatClass(seatId) {
  if (isBooked(seatId)) return 'seat-booked'
  if (isSeatSelected(seatId)) return 'seat-selected'
  return 'seat-available'
}

function getSeatStatus(seatId) {
  if (isBooked(seatId)) return 'reserved'
  if (isSeatSelected(seatId)) return 'selected'
  return 'available'
}

// ── Lifecycle: load all data ──────────────────────────────
onMounted(async () => {
  clearSeats()
  try {
    const [movieRes, showRes] = await Promise.all([
      moviesAPI.getById(props.movieId),
      showsAPI.getById(props.showId)
    ])
    movie.value = movieRes.data
    show.value  = showRes.data

    // Fetch theatre info
    const theatreRes = await theatresAPI.getById(show.value.theatreId)
    theatreName.value = theatreRes.data.name

    // Fetch all shows for same movie + theatre + date (for time selector)
    const allShowsRes = await showsAPI.getAll({ movieId: Number(props.movieId) })
    sameTheatreShows.value = allShowsRes.data
      .filter(s => s.theatreId === show.value.theatreId && s.date === show.value.date)
      .sort((a, b) => {
        // Sort by time (convert 12h to comparable 24h)
        const toMinutes = t => {
          const [time, period] = t.split(' ')
          let [h, m] = time.split(':').map(Number)
          if (period === 'PM' && h !== 12) h += 12
          if (period === 'AM' && h === 12) h = 0
          return h * 60 + m
        }
        return toMinutes(a.time) - toMinutes(b.time)
      })

    // Fetch already-booked seats for this show
    bookedSeatNums.value = await getBookedSeats(Number(props.showId))

    // Set context in composable for price calculation
    setBookingContext({ pricePerSeat: show.value.price })
  } catch (err) {
    pageError.value = 'Could not load booking details. Please try again.'
  } finally {
    pageLoading.value = false
  }
})

// ── Switch to a different show time ──────────────────────
async function switchShow(newShow) {
  if (newShow.id === show.value.id) return
  clearSeats()
  show.value = newShow
  setBookingContext({ pricePerSeat: newShow.price })
  bookedSeatNums.value = await getBookedSeats(newShow.id)
}

// ── Seat availability class for time slot ─────────────────
function getAvailClass(avail) {
  if (avail === 0) return 'avail-none'
  if (avail < 20)  return 'avail-low'
  return 'avail-ok'
}

// ── Confirm and Create Booking ────────────────────────────
function openPaymentModal() {
  if (!selectedSeats.value.length) return
  showPaymentModal.value = true
}

async function confirmBooking() {
  if (!selectedSeats.value.length) return
  bookingLoading.value = true

  try {
    const bookingData = {
      movieId:      Number(props.movieId),
      movieTitle:   movie.value.title,
      moviePoster:  movie.value.poster,
      showId:       Number(props.showId),
      theatre:      theatreName.value,
      date:         show.value.date,
      time:         show.value.time,
      seatNumbers:  [...selectedSeats.value],
      totalPrice:   grandTotal.value
    }

    const created = await createBooking(bookingData)
    confirmedBooking.value = created

    // Update local show data to reflect new seat count
    show.value = { ...show.value, availableSeats: show.value.availableSeats - selectedSeats.value.length }
    bookedSeatNums.value = [...bookedSeatNums.value, ...selectedSeats.value]
    clearSeats()

    showPaymentModal.value = false
    bookingSuccess.value = true
    showToast?.({ type: 'success', title: 'Booking Confirmed!', message: 'Enjoy your movie! 🎬' })
  } catch (err) {
    showToast?.({ type: 'error', title: 'Booking Failed', message: err.message || 'Please try again.' })
  } finally {
    bookingLoading.value = false
  }
}

// ── Navigate to My Bookings ───────────────────────────────
function goToBookings() {
  bookingSuccess.value = false
  router.push({ name: 'MyBookings' })
}

// ── Format date helpers ───────────────────────────────────
function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateShort(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.booking-page { padding: var(--space-xl) 0 var(--space-4xl); }

/* ── Show Time Selector ──────────────────────────────────── */
.showtime-selector {
  padding: var(--space-lg);
}

.showtime-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.showtime-date-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--text-primary);
}

.showtime-ticket-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-accent);
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.25);
  padding: 4px 12px;
  border-radius: var(--radius-full);
}

.showtime-slots {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.showtime-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color);
  background: var(--bg-glass);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.showtime-slot:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: rgba(0, 212, 255, 0.06);
}

.showtime-slot.active {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.showtime-slot:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.showtime-slot.low-availability {
  border-color: rgba(251, 191, 36, 0.5);
}

.slot-time {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  font-family: var(--font-display);
}
.showtime-slot.active .slot-time { color: #22c55e; }

.slot-format {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  padding: 2px 8px;
  background: rgba(0, 212, 255, 0.15);
  color: var(--color-accent);
  border-radius: var(--radius-full);
  border: 1px solid rgba(0, 212, 255, 0.3);
}

.slot-avail {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.03em;
}
.slot-avail.avail-ok   { color: #22c55e; }
.slot-avail.avail-low  { color: #f59e0b; }
.slot-avail.avail-none { color: #ef4444; }

/* ── Breadcrumb ──────────────────────────────────────────── */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}
.breadcrumb a { color: var(--color-accent); }
.breadcrumb a:hover { text-decoration: underline; }
.breadcrumb-active { color: var(--text-primary); }

/* ── Loading / Error ─────────────────────────────────────── */
.page-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-4xl) 0;
  color: var(--text-muted);
}
.page-error {
  padding: var(--space-3xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}
.page-error span { font-size: 2.5rem; }

/* ── Layout ──────────────────────────────────────────────── */
.booking-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--space-xl);
  align-items: start;
}

.booking-main { display: flex; flex-direction: column; gap: var(--space-xl); }

/* ── Movie Summary ───────────────────────────────────────── */
.movie-summary {
  display: flex;
  gap: var(--space-xl);
  padding: var(--space-lg);
  align-items: center;
}

.summary-poster {
  width: 72px;
  height: 100px;
  border-radius: var(--radius-md);
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
}

.summary-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: 4px;
}

.summary-meta {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-sm);
}

.summary-show {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* ── Seat Map Styling ────────────────────────────────────── */
.seat-map-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-2xl) 0;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow-x: auto;
}

/* Screen */
.screen-container { width: 80%; margin: 0 auto 3rem; text-align: center; }
.screen-curve {
  height: 40px;
  border-top: 3px solid var(--color-accent);
  border-radius: 0 0 50% 50% / 0 0 20px 20px;
  position: relative;
}

.screen-text {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--color-accent);
  text-transform: uppercase;
}

/* Legend */
.seat-legend {
  display: flex;
  gap: var(--space-xl);
  justify-content: center;
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.seat-demo {
  width: 22px;
  height: 22px;
  border-radius: 5px 5px 2px 2px;
}

.legend-available {
  background: #fff;
  border: 1px solid #4ade80;
}
.legend-selected {
  background: #4ade80;
  border: 1px solid #4ade80;
}
.legend-booked {
  background: #dc2626;
  border: 1px solid #dc2626;
}

/* ── Seat Tiers ──────────────────────────────────────────── */
.seat-tiers {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.seat-tier {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.tier-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--bg-glass);
  border-bottom: 1px solid var(--border-color);
}

.tier-label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: var(--radius-full);
}

.tier-prime {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.05));
  color: var(--color-neon-purple);
  border: 1px solid rgba(168, 85, 247, 0.3);
}
.tier-picture-perfect {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05));
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}
.tier-classic {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05));
  color: var(--color-neon-green);
  border: 1px solid rgba(34, 197, 94, 0.3);
}
.tier-value {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05));
  color: var(--color-gold);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.tier-price {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--text-primary);
}

.tier-rows {
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Seat Row */
.seat-row {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.row-label {
  width: 22px;
  text-align: center;
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 700;
  flex-shrink: 0;
}

.row-seats {
  display: flex;
  align-items: center;
  gap: 4px;
}

.aisle-gap {
  width: 18px;
  flex-shrink: 0;
}

/* ── Individual Seat Button ──────────────────────────────── */
.seat {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #4ade80;
  background: #fff;
  color: #4ade80;
  font-size: 0.6rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

/* Available — GREEN OUTLINE */
.seat.seat-available {
  border: 1px solid #4ade80;
  background: #fff;
  color: #4ade80;
}
.seat.seat-available:hover {
  background: #dcfce7;
  border-color: #22c55e;
}

/* Selected — SOLID GREEN */
.seat.seat-selected {
  background: #4ade80 !important;
  color: #fff !important;
  border: 1px solid #4ade80 !important;
  transform: scale(1.08);
}

/* Booked/Reserved — SOLID RED */
.seat.seat-booked {
  border: 1px solid #dc2626;
  background: #dc2626;
  color: #fff;
  cursor: not-allowed;
  opacity: 0.85;
}

.max-seats-note {
  text-align: center;
  color: var(--color-gold);
  font-size: var(--font-size-xs);
  margin-top: var(--space-md);
  font-weight: 600;
}

/* ── Booking Sidebar ─────────────────────────────────────── */
.booking-sidebar { position: sticky; top: 88px; }

.summary-card { padding: var(--space-lg); }

.summary-card-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-primary);
}

/* Movie mini info in sidebar */
.summary-movie-info {
  display: flex;
  gap: var(--space-md);
  align-items: center;
  margin-bottom: var(--space-md);
}

.summary-mini-poster {
  width: 48px;
  height: 68px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.summary-movie-name {
  font-weight: 700;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  line-height: 1.3;
  margin: 0;
}

.summary-movie-meta {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin: 2px 0 0 0;
}

/* Show info */
.summary-show-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-glass);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.show-info-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.show-info-icon { font-size: 0.85rem; }

/* Summary rows */
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-sm);
}

.sr-label { color: var(--text-muted); font-size: var(--font-size-xs); }
.sr-value { font-weight: 600; font-size: var(--font-size-xs); }

.divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: var(--space-sm) 0;
}

/* Selected Seats Display */
.selected-seats-display {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
  max-width: 60%;
}

.seat-pill {
  padding: 2px 7px;
  background: rgba(0,212,255,0.12);
  border: 1px solid rgba(0,212,255,0.3);
  border-radius: var(--radius-full);
  font-size: 0.65rem;
  color: var(--color-accent);
  font-weight: 700;
}

.no-seats { color: var(--text-muted); font-style: italic; font-size: var(--font-size-xs); }

.price-breakdown {
  margin-bottom: var(--space-xs);
}

.total-row { margin-top: var(--space-xs); }
.total-label { font-family: var(--font-display); font-size: var(--font-size-base); font-weight: 800; }
.total-value {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--color-neon-green);
}

.availability-bar { margin: var(--space-sm) 0; font-size: var(--font-size-xs); }
.avail-label { font-weight: 600; }
.avail-high   { color: var(--color-neon-green); }
.avail-medium { color: var(--color-gold); }
.avail-low    { color: #ff8800; }
.avail-none   { color: var(--color-primary); }

.confirm-btn {
  margin-top: var(--space-md);
  font-weight: 700;
  letter-spacing: 0.02em;
  font-size: var(--font-size-sm);
}

.booking-note {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: var(--space-sm);
  line-height: 1.5;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  margin-right: 6px;
}

/* ── Payment Modal ───────────────────────────────────────── */
.payment-modal {
  max-width: 400px;
  width: 100%;
  padding: var(--space-xl);
}
.payment-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-md);
  color: var(--text-primary);
  text-align: center;
}
.payment-amount {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}
.payment-amount span {
  font-weight: 800;
  font-size: var(--font-size-xl);
  color: var(--color-neon-green);
  display: block;
  margin-top: 4px;
}
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}
.payment-option {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  background: var(--bg-glass);
  transition: all 0.2s;
}
.payment-option:hover {
  background: rgba(0, 153, 187, 0.05);
  border-color: rgba(0, 153, 187, 0.3);
}
.payment-option.active {
  border-color: var(--color-accent);
  background: rgba(0, 153, 187, 0.1);
}
.payment-option input { display: none; }
.pay-icon { font-size: 1.25rem; }
.pay-text { font-size: var(--font-size-sm); font-weight: 600; color: var(--text-primary); }

.mock-card-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}
.pay-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}
.pay-input:focus { outline: none; border-color: var(--color-accent); }
.pay-input-row { display: flex; gap: var(--space-sm); }

.payment-actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}

/* ── Success Modal ───────────────────────────────────────── */
.success-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-lg);
}

.success-modal {
  max-width: 480px;
  width: 100%;
  padding: var(--space-2xl);
  text-align: center;
}

.success-check {
  margin-bottom: var(--space-lg);
}

.check-path {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: drawCheck 0.6s ease 0.3s forwards;
}

@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}

.success-title {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: 800;
  margin-bottom: var(--space-sm);
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.success-subtitle {
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
  font-size: var(--font-size-sm);
}

.success-details {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  margin-bottom: var(--space-xl);
  text-align: left;
}

.sd-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  padding: 6px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.sd-row:last-child { border-bottom: none; }
.sd-row span:first-child { color: var(--text-muted); }
.sd-row span:last-child  { font-weight: 600; }

.sd-row-total {
  font-size: var(--font-size-sm);
  font-weight: 700;
  padding-top: 8px;
}
.sd-row-total span:last-child { color: var(--color-neon-green); }

.booking-id-tag {
  background: var(--bg-glass);
  padding: 1px 8px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  font-family: monospace;
}

.success-actions { display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap; }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1200px) {
  .booking-layout { grid-template-columns: 1fr 300px; }
  .seat { width: 28px; height: 25px; font-size: 0.55rem; }
  .aisle-gap { width: 14px; }
}

@media (max-width: 1024px) {
  .booking-layout {
    grid-template-columns: 1fr;
  }
  .booking-sidebar {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .seat { width: 26px; height: 23px; font-size: 0.5rem; }
  .aisle-gap { width: 10px; }
  .row-label { width: 18px; font-size: 0.6rem; }
  .tier-rows { padding: 8px 4px; }
}

@media (max-width: 480px) {
  .seat { width: 22px; height: 20px; font-size: 0.45rem; }
  .aisle-gap { width: 8px; }
  .row-label { width: 14px; font-size: 0.55rem; }
  .booking-page { padding: var(--space-md) 0 var(--space-xl); }
  .seat-map-section { padding: var(--space-md); }
}
</style>
