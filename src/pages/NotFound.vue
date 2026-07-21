<!-- ============================================================
     NotFound.vue — 404 Page
     Animated illustration with navigation options.
     ============================================================ -->
<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content animate-fade-in-up">

        <!-- Illustration -->
        <div class="nf-illustration">
          <div class="nf-screen">
            <div class="nf-scanline"></div>
            <span class="nf-code">404</span>
            <span class="nf-sub-code">PAGE_NOT_FOUND</span>
          </div>
          <!-- Floating particles -->
          <div class="particle p1">🎬</div>
          <div class="particle p2">🎟️</div>
          <div class="particle p3">⭐</div>
          <div class="particle p4">🍿</div>
        </div>

        <!-- Content -->
        <h1 class="nf-title heading-display">
          Oops! This page doesn't exist.
        </h1>

        <p class="nf-desc">
          The page you're looking for has vanished like a movie plot twist.
          Don't worry — there are plenty of great films waiting for you.
        </p>

        <!-- Action Buttons -->
        <div class="nf-actions">
          <router-link to="/" class="btn btn-primary btn-lg">🏠 Go Home</router-link>
          <router-link to="/movies" class="btn btn-accent btn-lg">🎬 Browse Movies</router-link>
          <button class="btn btn-ghost btn-lg" @click="$router.back()">← Go Back</button>
        </div>

        <!-- Suggestions -->
        <div class="nf-suggestions glass-card">
          <p class="suggestions-title">You might be looking for:</p>
          <div class="suggestions-links">
            <router-link to="/movies" class="suggestion-link">🎭 All Movies</router-link>
            <router-link to="/my-bookings" class="suggestion-link">🎟️ My Bookings</router-link>
            <router-link to="/profile" class="suggestion-link">👤 My Profile</router-link>
            <router-link to="/login" class="suggestion-link">🔑 Sign In</router-link>
          </div>
        </div>

      </div>
    </div>

    <!-- Background Decoration -->
    <div class="nf-bg-deco">
      <div class="nf-circle c1"></div>
      <div class="nf-circle c2"></div>
    </div>
  </div>
</template>

<script setup>
/* 404 page — no data fetching needed */
</script>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4xl) 0;
  position: relative;
  overflow: hidden;
}

.not-found-content {
  text-align: center;
  max-width: 640px;
  position: relative;
  z-index: 2;
}

/* ── Illustration ─────────────────────────────────────────── */
.nf-illustration {
  position: relative;
  width: 240px;
  height: 180px;
  margin: 0 auto var(--space-2xl);
}

.nf-screen {
  width: 100%;
  height: 100%;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-lg), 0 0 40px rgba(0,212,255,0.08);
}

/* CRT scanline effect */
.nf-scanline {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.03) 0px,
    rgba(0,0,0,0.03) 1px,
    transparent 1px,
    transparent 3px
  );
  pointer-events: none;
}

.nf-code {
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 900;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.nf-sub-code {
  font-family: monospace;
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  letter-spacing: 0.1em;
  margin-top: 4px;
  animation: pulse 2s ease-in-out infinite;
}

/* Floating Particles */
.particle {
  position: absolute;
  font-size: 1.5rem;
  animation: float 3s ease-in-out infinite;
}
.p1 { top: -10px; left: -20px; animation-delay: 0s; }
.p2 { top: 50%; right: -20px; animation-delay: 0.8s; }
.p3 { bottom: -10px; left: 30%; animation-delay: 1.5s; }
.p4 { bottom: 20px; right: -10px; animation-delay: 0.4s; }

/* ── Text ────────────────────────────────────────────────── */
.nf-title {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-lg);
  line-height: 1.2;
}

.nf-desc {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  line-height: 1.7;
  margin-bottom: var(--space-2xl);
}

/* ── Actions ─────────────────────────────────────────────── */
.nf-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-2xl);
}

/* ── Suggestions ─────────────────────────────────────────── */
.nf-suggestions {
  padding: var(--space-xl);
}

.suggestions-title {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-md);
}

.suggestions-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  justify-content: center;
}

.suggestion-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background: var(--bg-glass);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.suggestion-link:hover {
  background: var(--bg-glass-hover);
  color: var(--color-accent);
  border-color: var(--border-glow);
}

/* ── BG Decoration ───────────────────────────────────────── */
.nf-bg-deco { position: fixed; inset: 0; pointer-events: none; }
.nf-circle { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.1; }
.c1 { width: 400px; height: 400px; background: var(--color-accent); top: -150px; right: -100px; }
.c2 { width: 300px; height: 300px; background: var(--color-primary); bottom: -100px; left: -80px; }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 480px) {
  .nf-title { font-size: var(--font-size-2xl); }
  .nf-actions { flex-direction: column; align-items: center; }
}
</style>
