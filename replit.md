# CineVault — Premium Movie Ticket Booking App

A full-featured, industry-grade movie ticket booking web application built as a Vue.js academic assignment.

## Technology Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Frontend    | Vue 3 (Composition API)   |
| Router      | Vue Router 4              |
| HTTP Client | Axios                     |
| Mock Backend| JSON Server (port 3000)   |
| Auth        | LocalStorage              |
| Build Tool  | Vite                      |
| Styling     | Custom CSS (glassmorphism)|

## Project Structure

```
src/
  pages/         # Route-level page components (9 pages)
  components/
    layout/      # Navbar, Footer
    movies/      # HeroCarousel, MovieCard
    common/      # ToastContainer, ConfirmModal, LoadingSpinner
  composables/   # useAuth, useMovies, useBookings
  services/      # api.js (Axios), auth.js (LocalStorage)
  router/        # index.js (route definitions + guards)
  styles/        # global.css (design system)
db.json          # JSON Server database (12 movies, shows, theatres)
```

## Running the App

Two processes must run together:

**1. Start JSON Server (mock backend):**
```bash
npm run server
# Runs on http://localhost:3000
```

**2. Start Vite dev server (frontend):**
```bash
npm run dev
# Runs on http://localhost:5173
```

On Replit, use the two configured workflows:
- **JSON Server** — starts the mock backend
- **Vite Dev** — starts the frontend (preview pane)

## Authentication

- Uses **LocalStorage only** — no JWT, no external auth
- Demo account: `demo@cinevault.com` / `demo1234`
- Register creates a new user in db.json via JSON Server

## Features

- 🎬 Hero carousel with auto-play
- 🔍 Search + filter by genre, language, rating
- 💺 Interactive seat map (10×10 grid)
- 🎟️ Full booking flow with price calculation
- 📱 Responsive (mobile / tablet / desktop)
- 🌙 Dark theme with glassmorphism
- 🔔 Toast notifications
- 🛡️ Protected routes with navigation guards

## User Preferences

- Dark theme is the only theme (as per assignment)
- Prices are in Indian Rupees (₹)
- Max 10 seats per booking
