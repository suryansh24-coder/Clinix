/* ============================================================
   useBookings.js — Bookings Composable
   Manages booking state, seat selection, booking creation,
   cancellation, and booking history retrieval.
   ============================================================ */

import { ref, computed, readonly } from 'vue'
import { bookingsAPI, showsAPI, seatsAPI } from '@/services/api'
import authService from '@/services/auth'

/* ── useBookings Composable ──────────────────────────────── */
export function useBookings() {
  // ── Reactive State ──────────────────────────────────────
  const bookings = ref([])
  const currentBooking = ref(null)
  const selectedSeats = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const bookingSearch = ref('')

  // ── Computed: Total price based on selected seats ─────
  const totalPrice = computed(() => {
    return selectedSeats.value.length * (currentBooking.value?.pricePerSeat || 0)
  })

  // ── Computed: Filtered bookings by search query ───────
  const filteredBookings = computed(() => {
    if (!bookingSearch.value.trim()) return bookings.value
    const q = bookingSearch.value.toLowerCase()
    return bookings.value.filter(b =>
      (b.movieTitle && b.movieTitle.toLowerCase().includes(q)) ||
      (b.theatre && b.theatre.toLowerCase().includes(q)) ||
      (b.id && String(b.id).includes(q))
    )
  })

  // ── CRUD: Fetch bookings for current user ─────────────
  async function fetchUserBookings() {
    const user = authService.getCurrentUser()
    if (!user) return

    isLoading.value = true
    error.value = null
    try {
      const { data } = await bookingsAPI.getAll({ userId: user.id })
      // Sort by booking date, newest first
      bookings.value = data.sort((a, b) =>
        new Date(b.bookingDate) - new Date(a.bookingDate)
      )
    } catch (err) {
      error.value = err.message || 'Failed to fetch bookings'
    } finally {
      isLoading.value = false
    }
  }

  // ── CRUD: Create a new booking ────────────────────────
  async function createBooking(bookingData) {
    isLoading.value = true
    error.value = null
    try {
      const user = authService.getCurrentUser()
      if (!user) throw { message: 'You must be logged in to book tickets.' }

      // Construct the booking object
      const booking = {
        userId: user.id,
        movieId: bookingData.movieId,
        movieTitle: bookingData.movieTitle,
        moviePoster: bookingData.moviePoster,
        showId: bookingData.showId,
        theatre: bookingData.theatre,
        date: bookingData.date,
        time: bookingData.time,
        seatNumbers: bookingData.seatNumbers,
        totalPrice: bookingData.totalPrice,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      }

      // Save booking to JSON Server
      const { data: createdBooking } = await bookingsAPI.create(booking)

      // Update show's available seats count
      if (bookingData.showId) {
        const { data: show } = await showsAPI.getById(bookingData.showId)
        await showsAPI.patch(bookingData.showId, {
          availableSeats: show.availableSeats - bookingData.seatNumbers.length
        })

        // Record each booked seat in the seats collection
        for (const seatNumber of bookingData.seatNumbers) {
          await seatsAPI.create({
            showId: bookingData.showId,
            seatNumber,
            status: 'booked'
          })
        }
      }

      // Add to local bookings list
      bookings.value.unshift(createdBooking)

      // Clear booking draft from LocalStorage
      authService.clearBookingDraft()

      return createdBooking
    } catch (err) {
      error.value = err.message || 'Booking failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ── CRUD: Cancel a booking ────────────────────────────
  async function cancelBooking(bookingId) {
    isLoading.value = true
    error.value = null
    try {
      // Update booking status to cancelled
      const { data } = await bookingsAPI.patch(bookingId, { status: 'cancelled' })

      // Update local state
      const index = bookings.value.findIndex(b => b.id === bookingId)
      if (index !== -1) {
        bookings.value[index] = data
      }

      // Restore available seats in the show
      if (data.showId && data.seatNumbers) {
        try {
          const { data: show } = await showsAPI.getById(data.showId)
          await showsAPI.patch(data.showId, {
            availableSeats: show.availableSeats + data.seatNumbers.length
          })
        } catch {
          // Show may have been removed; ignore
        }
      }

      return data
    } catch (err) {
      error.value = err.message || 'Failed to cancel booking'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ── CRUD: Delete a booking record ─────────────────────
  async function deleteBooking(bookingId) {
    isLoading.value = true
    error.value = null
    try {
      await bookingsAPI.delete(bookingId)
      bookings.value = bookings.value.filter(b => b.id !== bookingId)
    } catch (err) {
      error.value = err.message || 'Failed to delete booking'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ── Seat Selection Logic ──────────────────────────────

  /**
   * Toggle a seat's selection status
   * @param {string} seatId - e.g., "A1", "B5"
   */
  function toggleSeat(seatId) {
    const index = selectedSeats.value.indexOf(seatId)
    if (index === -1) {
      // Add seat (max 10 seats per booking)
      if (selectedSeats.value.length < 10) {
        selectedSeats.value.push(seatId)
      }
    } else {
      // Remove seat
      selectedSeats.value.splice(index, 1)
    }

    // Save draft to LocalStorage for recovery
    authService.saveBookingDraft({
      selectedSeats: selectedSeats.value,
      ...currentBooking.value
    })
  }

  /**
   * Check if a seat is currently selected
   * @param {string} seatId
   * @returns {boolean}
   */
  function isSeatSelected(seatId) {
    return selectedSeats.value.includes(seatId)
  }

  /**
   * Clear all selected seats
   */
  function clearSeats() {
    selectedSeats.value = []
  }

  /**
   * Set the current booking context (movie, show, price info)
   */
  function setBookingContext(context) {
    currentBooking.value = context
  }

  /**
   * Get booked seats for a show from the server
   * @param {number} showId
   * @returns {Array} list of booked seat numbers
   */
  async function getBookedSeats(showId) {
    try {
      const { data } = await seatsAPI.getAll({ showId, status: 'booked' })
      return data.map(s => s.seatNumber)
    } catch {
      return []
    }
  }

  return {
    // State
    bookings: readonly(bookings),
    currentBooking: readonly(currentBooking),
    selectedSeats,
    isLoading: readonly(isLoading),
    error: readonly(error),
    bookingSearch,

    // Computed
    totalPrice,
    filteredBookings,

    // Methods
    fetchUserBookings,
    createBooking,
    cancelBooking,
    deleteBooking,
    toggleSeat,
    isSeatSelected,
    clearSeats,
    setBookingContext,
    getBookedSeats
  }
}
