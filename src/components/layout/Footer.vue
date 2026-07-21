<!-- ============================================================
     Footer.vue — Premium Footer Component
     Contains links, branding, social icons, and responsive layout.
     ============================================================ -->
<template>
  <footer class="footer">
    <div class="container">
      <!-- Footer Top Section -->
      <div class="footer-grid">
        <!-- Brand Column -->
        <div class="footer-brand">
          <router-link to="/" class="footer-logo">
            <span class="brand-icon">🎬</span>
            <span class="brand-text">Cine<span class="brand-accent">Vault</span></span>
          </router-link>
          <p class="footer-desc">
            Your premium destination for movie ticket booking. Experience cinema like never before with CineVault.
          </p>
          <div class="social-links">
            <a href="#" class="social-icon" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" class="social-icon" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="#" class="social-icon" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4 class="footer-heading">Explore</h4>
          <ul class="footer-list">
            <li><router-link to="/movies">Now Showing</router-link></li>
            <li><router-link to="/movies?status=coming_soon">Coming Soon</router-link></li>
            <li><router-link to="/movies">Browse Movies</router-link></li>
          </ul>
        </div>

        <!-- Account -->
        <div class="footer-col">
          <h4 class="footer-heading">Account</h4>
          <ul class="footer-list">
            <li><router-link to="/my-bookings">My Bookings</router-link></li>
            <li><router-link to="/profile">Profile</router-link></li>
            <li><router-link to="/login">Sign In</router-link></li>
          </ul>
        </div>

        <!-- Help -->
        <div class="footer-col">
          <h4 class="footer-heading">Help</h4>
          <ul class="footer-list">
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p class="copyright">© {{ currentYear }} CineVault. All rights reserved. Built with Vue.js</p>
        <p class="footer-note">Academic Project — Movie Ticket Booking Application</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: var(--space-3xl) 0 var(--space-xl);
  margin-top: var(--space-4xl);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--space-2xl);
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.footer-logo .brand-icon { font-size: 1.5rem; }
.footer-logo .brand-text {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 800;
}
.footer-logo .brand-accent {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-desc {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  line-height: 1.7;
  margin-bottom: var(--space-lg);
  max-width: 280px;
}

.social-links {
  display: flex;
  gap: var(--space-sm);
}

.social-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--bg-glass);
  color: var(--text-secondary);
  transition: all var(--transition-base);
  border: 1px solid var(--border-color);
}

.social-icon:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.footer-heading {
  font-family: var(--font-display);
  font-size: var(--font-size-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
}

.footer-list li {
  margin-bottom: var(--space-sm);
}

.footer-list a {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.footer-list a:hover {
  color: var(--color-accent);
  padding-left: 4px;
}

.footer-bottom {
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.copyright {
  color: var(--text-muted);
  font-size: var(--font-size-xs);
}

.footer-note {
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  opacity: 0.6;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
  }
  .footer-brand { grid-column: 1 / -1; }
  .footer-bottom { flex-direction: column; text-align: center; }
}

@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
