# CineVault — Premium Movie Ticket Booking App

## Overview
CineVault is a Vue 3 single-page application simulating a PVR-style cinema ticket booking platform for Indian audiences. It includes a full movie catalogue, theatre/show selection, interactive seat map, and booking management.

## Architecture

| Layer | Technology |
|---|---|
| Frontend | Vue 3 (Composition API) + Vite |
| Mock Backend | JSON Server (db.json) |
| Routing | Vue Router 4 |
| HTTP | Axios (via `/api` proxy) |
| Auth | LocalStorage-based session |
| Styling | CSS custom properties (design tokens) |

## Running the Project

Two workflows must both be running simultaneously:

1. **JSON Server** (`npm run server`) — mock REST API on port 3000, serves `db.json`
2. **Start application** (`npm run dev`) — Vite dev server on port 5000, proxies `/api` → `localhost:3000`

The Vite proxy is configured in `vite.config.js`. Never hardcode `localhost:3000` in app code — always use relative `/api` paths.

## Key Files

```
src/
  pages/
    Home.vue          — Hero carousel + genre filters
    Movies.vue        — Browse/filter all movies
    MovieDetails.vue  — Movie info + show selection
    Booking.vue       — PVR-style seat map + booking
    MyBookings.vue    — User booking history
    Profile.vue       — User profile
    FAQ.vue           — Searchable FAQ with categories
    Contact.vue       — Multi-channel contact form
    Terms.vue         — Terms of Service (legal)
    Privacy.vue       — Privacy Policy (legal)
  components/
    layout/
      Navbar.vue      — Top navigation
      Footer.vue      — Full footer with all working links
    movies/
      MovieCard.vue   — Movie card with poster + fallback
  composables/
    useMovies.js      — Movie/show fetching + filters
    useBookings.js    — Seat selection + booking CRUD
  services/
    api.js            — Axios service layer (all API calls)
    auth.js           — LocalStorage auth service
  router/index.js     — All routes + auth guards
db.json               — Mock database (movies, shows, theatres, bookings, seats)
```

## Data Model (db.json)

- **movies** — 58 movies (now_showing + coming_soon), cert: U/UA only
- **shows** — 103 shows, each with `movieId`, `theatreId`, `date`, `time`, `price`, `availableSeats`
- **theatres** — 6 theatres across Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Kolkata
- **bookings** — user booking records
- **seats** — per-show booked seat records (used to show red seats on seat map)

## Seat Map

- 14 rows (A–P, some skipped), 22 columns — PVR-style layout
- Tiers: **PRIME** (rows P,N,M,L) · **PICTURE PERFECT** (K,J,H) · **CLASSIC** (G–A)
- Green = available · Red = already booked · Cyan = your selection
- Booked seats loaded from `/api/seats?showId=X&status=booked`

## Movie Posters

All posters use TMDB CDN: `https://image.tmdb.org/t/p/w500/<path>`. Fallback to placehold.co on error. Adult-rated films (cert:A) have been removed from the catalogue.

## User Preferences
- Keep Indian movie posters correct — always use TMDB IDs verified by search, not guessed IDs
- Footer links must all be functional (no `href="#"` dead links)
- Seat map: booked = red, available = green, selected = cyan
