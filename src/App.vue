<!-- ============================================================
     App.vue — Root Application Component
     Provides the main layout structure with Navbar, Footer,
     Toast notifications, and animated page transitions.
     Restores auth session on mount using lifecycle hook.
     ============================================================ -->
<template>
  <div class="app-wrapper">
    <!-- Global Navigation Bar -->
    <Navbar />

    <!-- Toast Notification System -->
    <ToastContainer />

    <!-- Main Content with Page Transitions -->
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- Global Footer -->
    <Footer />
  </div>
</template>

<script setup>
/* ── Imports ─────────────────────────────────────────────── */
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

// ── Restore Session ─────────────────────────────────────
// onMounted lifecycle hook: restores user session from
// LocalStorage when the app first loads / page refreshes
const { restoreSession } = useAuth()

onMounted(() => {
  restoreSession()
})
</script>

<style scoped>
/* Main content area — ensures footer sticks to bottom */
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 72px; /* Offset for fixed navbar height */
}
</style>
