<!-- ============================================================
     Booking.vue — Seat Selection & Booking Page (Protected)
     Interactive seat map, live price calculation, booking
     summary, and confirmation. Uses JSON Server + LocalStorage.
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

          <!-- ── Seat Map ── -->
          <div class="seat-map-section glass-card">
            <div class="screen-label">
              <div class="screen-line"></div>
              <span>SCREEN</span>
              <div class="screen-line"></div>
            </div>

            <!-- Seat Legend -->
            <div class="seat-legend">
              <div class="legend-item">
                <div class="seat-demo seat-available"></div>
                <span>Available</span>
              </div>
              <div class="legend-item">
                <div class="seat-demo seat-selected-demo"></div>
                <span>Selected</span>
              </div>
              <div class="legend-item">
                <div class="seat-demo seat-booked-demo"></div>
                <span>Booked</span>
              </div>
            </div>

            <!-- Seat Grid -->
            <div class="seat-grid">
              <div v-for="row in seatRows" :key="row" class="seat-row">
                <!-- Row Label -->
                <span class="row-label">{{ row }}</span>

                <!-- Seats in Row -->
                <button
                  v-for="col in COLS"
                  :key="`${row}${col}`"
                  class="seat"
                  :class="{
                    'seat-booked':   isBooked(`${row}${col}`),
                    'seat-selected': isSeatSelected(`${row}${col}`) && !isBooked(`${row}${col}`)
                  }"
                  :disabled="isBooked(`${row}${col}`)"
                  @click="toggleSeat(`${row}${col}`)"
                  :title="`Seat ${row}${col}`"
                  :aria-label="`Seat ${row}${col} ${isBooked(`${row}${col}`) ? 'booked' : isSeatSelected(`${row}${col}`) ? 'selected' : 'available'}`"
                >
                  {{ col }}
                </button>

                <!-- Row Label (right) -->
                <span class="row-label">{{ row }}</span>
              </div>
            </div>

            <!-- Max Seats Warning -->
            <p class="max-seats-note" v-if="selectedSeats.length >= 10">
              ⚠️ Maximum 10 seats per booking
            </p>
          </div>
        </main>

        <!-- ── Right: Booking Summary ── -->
        <aside class="booking-sidebar">
          <div class="summary-card glass-card">
            <h3 class="summary-card-title">Booking Summary</h3>

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
            <div class="summary-row">
              <span class="sr-label">Price per seat</span>
              <span class="sr-value">₹{{ show.price }}</span>
            </div>

            <div class="summary-row">
              <span class="sr-label">Seats</span>
              <span class="sr-value">× {{ selectedSeats.length }}</span>
            </div>

            <div class="summary-row">
              <span class="sr-label">Convenience Fee</span>
              <span class="sr-value">₹{{ convenienceFee }}</span>
            </div>

            <hr class="divider" />

            <div class="summary-row total-row">
              <span class="total-label">Total</span>
              <span class="total-value">₹{{ grandTotal }}</span>
            </div>

            <!-- Available Seat Count -->
            <div class="availability-bar">
              <span class="avail-label" :class="availClass">
                {{ show.availableSeats }} seats available
              </span>
            </div>

            <!-- Confirm Booking Button -->
            <button
              class="btn btn-primary btn-lg w-full confirm-btn"
              :disabled="!selectedSeats.length || bookingLoading"
              @click="confirmBooking"
            >
              <span v-if="bookingLoading" class="spinner"></span>
              {{ bookingLoading ? 'Confirming...' : `Confirm Booking (₹${grandTotal})` }}
            </button>

            <p class="booking-note">
              🔒 Your booking is secured. Cancellation available from My Bookings.
            </p>
          </div>
        </aside>
      </div>

    </div>

    <!-- ── Success Modal ── -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="bookingSuccess" class="success-overlay" @click.self="goToBookings">
          <div class="success-modal glass-card animate-scale-in">
            <div class="success-icon">🎉</div>
            <h2 class="success-title">Booking Confirmed!</h2>
            <p class="success-subtitle">Your tickets are booked. Have a great time!</p>

            <div class="success-details">
              <div class="sd-row">
                <span>Movie</span>
                <span>{{ movie?.title }}</span>
              </div>
              <div class="sd-row">
                <span>Seats</span>
                <span>{{ confirmedBooking?.seatNumbers?.join(', ') }}</span>
              </div>
              <div class="sd-row">
                <span>Total</span>
                <span>₹{{ confirmedBooking?.totalPrice }}</span>
              </div>
              <div class="sd-row">
                <span>Booking ID</span>
                <span>#{{ confirmedBooking?.id }}</span>
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
const movie           = ref(null)
const show            = ref(null)
const theatreName     = ref('')
const bookedSeatNums  = ref([])
const pageLoading     = ref(true)
const pageError       = ref('')
const bookingLoading  = ref(false)
const bookingSuccess  = ref(false)
const confirmedBooking = ref(null)

// ── Seat Layout Configuration ────────────────────────────
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const seatRows = computed(() => ROWS)

// ── Price Calculation ─────────────────────────────────────
const seatTotal      = computed(() => selectedSeats.value.length * (show.value?.price || 0))
const convenienceFee = computed(() => selectedSeats.value.length ? Math.round(seatTotal.value * 0.05) : 0)
const grandTotal     = computed(() => seatTotal.value + convenienceFee.value)

// ── Seat Availability Color ───────────────────────────────
const availClass = computed(() => {
  const avail = show.value?.availableSeats ?? 0
  if (avail === 0)  return 'avail-none'
  if (avail < 20)   return 'avail-low'
  if (avail < 60)   return 'avail-medium'
  return 'avail-high'
})

// ── Check if a seat is already booked (from server) ──────
function isBooked(seatId) {
  return bookedSeatNums.value.includes(seatId)
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

// ── Confirm and Create Booking ────────────────────────────
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

// ── Format date helper ────────────────────────────────────
function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.booking-page { padding: var(--space-xl) 0 var(--space-4xl); }

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
  grid-template-columns: 1fr 320px;
  gap: var(--space-xl);
  align-items: start;
}

.booking-main { display: flex; flex-direction: column; gap: var(--space-xl); }

/* ── Movie Summary ───────────────────────────────────────── */
.movie-summary {
  display: flex;
  gap: var(--space-xl);
  padding: var(--space-xl);
  align-items: center;
}

.summary-poster {
  width: 80px;
  border-radius: var(--radius-md);
  object-fit: cover;
  flex-shrink: 0;
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

/* ── Seat Map ────────────────────────────────────────────── */
.seat-map-section {
  padding: var(--space-xl);
}

/* Screen */
.screen-label {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.screen-line {
  flex: 1;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  border-radius: 2px;
}

.screen-label span {
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-accent);
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
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid;
}

.seat-available       { background: var(--bg-glass); border-color: var(--border-color); }
.seat-selected-demo   { background: rgba(0,212,255,0.3); border-color: var(--color-accent); }
.seat-booked-demo     { background: rgba(229,9,20,0.15); border-color: rgba(229,9,20,0.3); }

/* Seat Grid */
.seat-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: var(--space-md);
}

.seat-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.row-label {
  width: 24px;
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  font-weight: 600;
  flex-shrink: 0;
}

/* Individual Seat Button */
.seat {
  width: 34px;
  height: 30px;
  border-radius: 4px 4px 0 0;
  border: 1px solid var(--border-color);
  background: var(--bg-glass);
  color: var(--text-secondary);
  font-size: 0.6rem;
  font-weight: 600;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  position: relative;
}

.seat::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 2px;
  right: 2px;
  height: 3px;
  background: inherit;
  border-radius: 0 0 3px 3px;
  border: 1px solid var(--border-color);
  border-top: none;
}

.seat:hover:not(:disabled) {
  background: rgba(0,212,255,0.15);
  border-color: var(--color-accent);
  color: var(--color-accent);
  transform: scale(1.1);
}

.seat.seat-selected {
  background: rgba(0,212,255,0.25);
  border-color: var(--color-accent);
  color: var(--color-accent);
  box-shadow: 0 0 8px rgba(0,212,255,0.3);
}

.seat.seat-booked {
  background: rgba(229,9,20,0.1);
  border-color: rgba(229,9,20,0.25);
  color: rgba(229,9,20,0.4);
  cursor: not-allowed;
}

.max-seats-note {
  text-align: center;
  color: var(--color-gold);
  font-size: var(--font-size-xs);
  margin-top: var(--space-md);
}

/* ── Booking Sidebar ─────────────────────────────────────── */
.booking-sidebar { position: sticky; top: 88px; }

.summary-card { padding: var(--space-xl); }

.summary-card-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-md);
}

.sr-label { color: var(--text-muted); }
.sr-value { font-weight: 600; }

/* Selected Seats Display */
.selected-seats-display {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
  max-width: 60%;
}

.seat-pill {
  padding: 2px 8px;
  background: rgba(0,212,255,0.1);
  border: 1px solid rgba(0,212,255,0.25);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--color-accent);
  font-weight: 600;
}

.no-seats { color: var(--text-muted); font-style: italic; }

.total-row { margin-top: var(--space-md); }
.total-label { font-family: var(--font-display); font-size: var(--font-size-lg); font-weight: 700; }
.total-value {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-neon-green);
}

.availability-bar { margin: var(--space-md) 0; font-size: var(--font-size-xs); }
.avail-label { font-weight: 600; }
.avail-high   { color: var(--color-neon-green); }
.avail-medium { color: var(--color-gold); }
.avail-low    { color: #ff8800; }
.avail-none   { color: var(--color-primary); }

.confirm-btn { margin-top: var(--space-md); }

.booking-note {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  text-align: center;
  margin-top: var(--space-md);
  line-height: 1.6;
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

/* ── Success Modal ───────────────────────────────────────── */
.success-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-lg);
}

.success-modal {
  max-width: 500px;
  width: 100%;
  padding: var(--space-2xl);
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: var(--space-lg);
  animation: float 2s ease-in-out infinite;
}

.success-title {
  font-family: var(--font-display);
  font-size: var(--font-size-3xl);
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
}

.success-details {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.sd-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  padding: var(--space-sm) 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.sd-row:last-child { border-bottom: none; }
.sd-row span:first-child { color: var(--text-muted); }
.sd-row span:last-child  { font-weight: 600; }

.success-actions { display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap; }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1024px) {
  .booking-layout { grid-template-columns: 1fr; }
  .booking-sidebar { position: static; }
}

@media (max-width: 600px) {
  .seat { width: 28px; height: 24px; font-size: 0.5rem; }
}
</style>
