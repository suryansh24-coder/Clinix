<!-- ============================================================
     ToastContainer.vue — Global Toast Notification System
     Provides success, error, warning, and info toast messages
     with auto-dismiss and smooth animations.
     Uses provide/inject pattern for global access.
     ============================================================ -->
<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="[`toast-${toast.type}`]"
      >
        <!-- Toast Icon -->
        <span class="toast-icon">
          <template v-if="toast.type === 'success'">✓</template>
          <template v-else-if="toast.type === 'error'">✕</template>
          <template v-else-if="toast.type === 'warning'">⚠</template>
          <template v-else>ℹ</template>
        </span>

        <!-- Toast Content -->
        <div class="toast-body">
          <p class="toast-title">{{ toast.title }}</p>
          <p v-if="toast.message" class="toast-message">{{ toast.message }}</p>
        </div>

        <!-- Dismiss Button -->
        <button class="toast-close" @click="removeToast(toast.id)">✕</button>

        <!-- Auto-dismiss Progress Bar -->
        <div class="toast-progress" :style="{ animationDuration: toast.duration + 'ms' }"></div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

const toasts = ref([])
let toastIdCounter = 0

/**
 * Show a toast notification
 * @param {Object} options - { type, title, message, duration }
 * type: 'success' | 'error' | 'warning' | 'info'
 */
function showToast({ type = 'info', title = '', message = '', duration = 4000 }) {
  const id = ++toastIdCounter
  toasts.value.push({ id, type, title, message, duration })

  // Auto-remove after duration
  setTimeout(() => removeToast(id), duration)
}

/**
 * Remove a toast by ID
 */
function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// Provide the showToast function globally via Vue's provide/inject
// Any child component can inject 'showToast' to display notifications
provide('showToast', showToast)
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 88px;
  right: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  z-index: var(--z-toast);
  max-width: 400px;
  width: 100%;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  animation: fadeInRight 0.35s ease;
  pointer-events: auto;
}

.toast-success {
  background: rgba(57, 255, 20, 0.1);
  border-color: rgba(57, 255, 20, 0.25);
}
.toast-error {
  background: rgba(229, 9, 20, 0.12);
  border-color: rgba(229, 9, 20, 0.3);
}
.toast-warning {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.25);
}
.toast-info {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.2);
}

.toast-icon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
  margin-top: 2px;
}
.toast-success .toast-icon { color: var(--color-neon-green); }
.toast-error .toast-icon { color: var(--color-primary); }
.toast-warning .toast-icon { color: var(--color-gold); }
.toast-info .toast-icon { color: var(--color-accent); }

.toast-body { flex: 1; min-width: 0; }

.toast-title {
  font-weight: 600;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.toast-message {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-top: 2px;
}

.toast-close {
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}
.toast-close:hover {
  color: var(--text-primary);
  background: var(--bg-glass);
}

/* Auto-dismiss progress bar */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: currentColor;
  opacity: 0.3;
  animation: progressShrink linear forwards;
}
.toast-success .toast-progress { color: var(--color-neon-green); }
.toast-error .toast-progress { color: var(--color-primary); }
.toast-warning .toast-progress { color: var(--color-gold); }
.toast-info .toast-progress { color: var(--color-accent); }

@keyframes progressShrink {
  from { width: 100%; }
  to { width: 0%; }
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Transition group animations */
.toast-enter-active { transition: all 0.35s ease; }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to { opacity: 0; transform: translateX(40px) scale(0.95); }
.toast-move { transition: transform 0.3s ease; }

@media (max-width: 480px) {
  .toast-container {
    left: var(--space-md);
    right: var(--space-md);
    max-width: none;
  }
}
</style>
