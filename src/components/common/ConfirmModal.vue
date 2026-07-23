<!-- ============================================================
     ConfirmModal.vue — Reusable Confirmation Dialog
     Glassmorphism modal with customizable title, message,
     confirm/cancel actions, and backdrop click-to-close.
     ============================================================ -->
<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="show" class="modal-backdrop" @click.self="$emit('cancel')">
        <div class="modal-content glass-card" role="dialog" aria-modal="true">
          <!-- Modal Icon -->
          <div class="modal-icon" :class="`modal-icon-${type}`">
            <template v-if="type === 'danger'">⚠️</template>
            <template v-else-if="type === 'success'">✅</template>
            <template v-else>❓</template>
          </div>

          <!-- Modal Title -->
          <h3 class="modal-title">{{ title }}</h3>

          <!-- Modal Message -->
          <p class="modal-message" style="white-space: pre-line;">
            {{ message }}
          </p>

          <!-- Modal Actions -->
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="$emit('cancel')">
              {{ cancelText }}
            </button>
            <button
              class="btn"
              :class="type === 'danger' ? 'btn-primary' : 'btn-accent'"
              @click="$emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
/* ── Props & Emits ───────────────────────────────────────── */
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  type: { type: String, default: 'info' } // 'info', 'danger', 'success'
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-lg);
}

.modal-content {
  max-width: 420px;
  width: 100%;
  padding: var(--space-2xl);
  text-align: center;
  animation: scaleIn 0.3s ease;
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: var(--space-lg);
}

.modal-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.modal-message {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  margin-bottom: var(--space-xl);
}

.modal-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

.modal-actions .btn {
  min-width: 120px;
}

/* Transition */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
