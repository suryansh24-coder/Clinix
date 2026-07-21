<!-- ============================================================
     LoadingSpinner.vue — Animated Loading Indicator
     Reusable spinner with optional message text.
     ============================================================ -->
<template>
  <div class="loader-wrapper" :class="{ 'loader-fullpage': fullPage }">
    <div class="loader-spinner">
      <div class="spinner-ring"></div>
      <span class="spinner-icon">🎬</span>
    </div>
    <p v-if="message" class="loader-text">{{ message }}</p>
  </div>
</template>

<script setup>
/* ── Props ───────────────────────────────────────────────── */
defineProps({
  message: { type: String, default: 'Loading...' },
  fullPage: { type: Boolean, default: false }
})
</script>

<style scoped>
.loader-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  padding: var(--space-3xl) 0;
}

.loader-fullpage {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 26, 0.9);
  backdrop-filter: blur(10px);
  z-index: var(--z-modal);
}

.loader-spinner {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-icon {
  font-size: 1.5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.loader-text {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  letter-spacing: 0.03em;
}
</style>
