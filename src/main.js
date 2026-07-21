/* ============================================================
   main.js — Application Entry Point
   Sets up Vue app instance, registers router, and mounts app.
   ============================================================ */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import global styles
import './styles/global.css'

// Create and mount the Vue application
const app = createApp(App)

// Register Vue Router for client-side navigation
app.use(router)

// Mount the application to the DOM
app.mount('#app')
