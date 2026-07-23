/* ============================================================
   router/index.js — Vue Router Configuration
   Defines all application routes, nested routes, navigation
   guards for protected routes, and 404 handling.
   ============================================================ */

import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/auth'


// ── Lazy-loaded Route Components ────────────────────────
// Using dynamic imports for code splitting & performance
const Home = () => import('@/pages/Home.vue')
const Movies = () => import('@/pages/Movies.vue')
const MovieDetails = () => import('@/pages/MovieDetails.vue')
const Booking = () => import('@/pages/Booking.vue')
const MyBookings = () => import('@/pages/MyBookings.vue')
const MyRentals = () => import('@/pages/MyRentals.vue')
const Profile = () => import('@/pages/Profile.vue')
const Login = () => import('@/pages/Login.vue')
const Register = () => import('@/pages/Register.vue')
const FAQ = () => import('@/pages/FAQ.vue')
const Contact = () => import('@/pages/Contact.vue')
const Terms = () => import('@/pages/Terms.vue')
const Privacy = () => import('@/pages/Privacy.vue')
const NotFound = () => import('@/pages/NotFound.vue')
const RentMovie = () => import('@/pages/RentMovie.vue')
const RentPayment = () => import('@/pages/RentPayment.vue')

// ── Route Definitions ───────────────────────────────────
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'CineVault — Premium Movie Ticket Booking' }
  },
  {
  path: '/rent-payment',
  name: 'RentPayment',
  component: RentPayment,
  meta: {
    title: 'Rent Payment — CineVault',
    requiresAuth: true
   }
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies,
    meta: { title: 'Browse Movies — CineVault' }
  },
  {
    path: '/movies/:id',
    name: 'MovieDetails',
    component: MovieDetails,
    props: true, // Pass route params as props
    meta: { title: 'Movie Details — CineVault' }
  },
  {
    // Protected route — requires authentication
    path: '/booking/:movieId/:showId',
    name: 'Booking',
    component: Booking,
    props: true,
    meta: {
      title: 'Book Tickets — CineVault',
      requiresAuth: true // Navigation guard will check this
    }
  },
  {
  path: '/rent/:id',
  name: 'RentMovie',
  component: RentMovie,
  props: true,
  meta: {
     title: 'Rent Movie — CineVault',
     requiresAuth: true
     }
  },
  {
    // Protected route — requires authentication
    path: '/my-bookings',
    name: 'MyBookings',
    component: MyBookings,
    meta: {
      title: 'My Bookings — CineVault',
      requiresAuth: true
    }
  },
  {
  path: '/my-rentals',
  name: 'MyRentals',
  component: MyRentals,
  meta: {
    title: 'My Rentals — CineVault',
    requiresAuth: true
   }
  },
  {
    // Protected route — requires authentication
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'My Profile — CineVault',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Sign In — CineVault',
      guestOnly: true // Redirect if already logged in
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Create Account — CineVault',
      guestOnly: true
    }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQ,
    meta: { title: 'FAQs — CineVault' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: { title: 'Contact Us — CineVault' }
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms,
    meta: { title: 'Terms of Service — CineVault' }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
    meta: { title: 'Privacy Policy — CineVault' }
  },
  {
    // Catch-all 404 route
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Page Not Found — CineVault' }
  }
]

// ── Create Router Instance ──────────────────────────────
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Scroll to top on route change
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

// ── Global Navigation Guard ─────────────────────────────
// Runs before every route navigation to enforce auth rules
router.beforeEach((to, from, next) => {
  // Update page title from route meta
  document.title = to.meta.title || 'CineVault'

  const isAuthenticated = authService.isAuthenticated()

  // Protected routes: redirect to login if not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath } // Save intended destination
    })
    return
  }

  // Guest-only routes: redirect to home if already logged in
  if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'Home' })
    return
  }

  // Allow navigation
  next()
})

export default router
