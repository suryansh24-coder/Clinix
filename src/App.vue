<!-- ============================================================
     App.vue — Root Application Component
     Provides main layout, session restore, theme initialization.
     ============================================================ -->
<template>
  <div class="app-wrapper">
    <Navbar />
    <ToastContainer />
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

const { restoreSession } = useAuth()
// Initialize theme (applies data-theme to <html> on load)
useTheme()

onMounted(() => {
  restoreSession()
})
</script>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 64px; /* Offset for fixed navbar */
}
</style>
