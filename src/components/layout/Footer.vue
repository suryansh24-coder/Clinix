<!-- ============================================================
     Footer.vue — Professional Footer
     Full-featured footer with working navigation links.
     ============================================================ -->
<template>
  <footer class="footer">
    <div class="container">

      <!-- Top strip: newsletter / tagline -->
      <div class="footer-top">
        <div class="footer-top-left">
          <h3 class="footer-tagline">Never miss a blockbuster.</h3>
          <p class="footer-tagline-sub">Subscribe for exclusive deals, new releases, and city-specific offers.</p>
        </div>
        <form class="newsletter-form" @submit.prevent="subscribe">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email…"
            class="newsletter-input"
            :disabled="subscribed"
          />
          <button type="submit" class="btn btn-accent newsletter-btn" :disabled="subscribed">
            <span v-if="subscribed">✓ Subscribed</span>
            <span v-else>Subscribe</span>
          </button>
        </form>
      </div>

      <div class="footer-divider"></div>

      <!-- Main grid -->
      <div class="footer-grid">

        <!-- Brand Column -->
        <div class="footer-brand">
          <router-link to="/" class="footer-logo">
            <span class="brand-icon">🎬</span>
            <span class="brand-text">Cine<span class="brand-accent">Vault</span></span>
          </router-link>
          <p class="footer-desc">
            India's premium movie ticket booking platform. Book seats at PVR, INOX, Cinépolis and more — instantly, securely, and at the best prices.
          </p>

          <!-- App download badges -->
          <div class="app-badges">
            <a href="#" class="app-badge" aria-label="Download on App Store">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.22 1.3-2.2 3.88.04 3.03 2.66 4.04 2.69 4.04-.03.07-.42 1.44-1.38 2.59M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div><span class="badge-store">Download on the</span><br><strong>App Store</strong></div>
            </a>
            <a href="#" class="app-badge" aria-label="Get on Google Play">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.37.21.8.22 1.18.04L15.94 12 4.36.2c-.38-.18-.81-.17-1.18.04A1.34 1.34 0 002.5 1.4v21.2c0 .5.26.94.68 1.16zM17.35 13.41l2.7-1.56-2.7-1.56L5.32 3.24 16.08 12l-10.76 8.76zM20.82 10.7L18.54 9.4l-2.46 1.42L18.54 12l2.28-1.3c.69-.4.69-1.4 0-1.79l.01-.01-.01.01z"/></svg>
              <div><span class="badge-store">Get it on</span><br><strong>Google Play</strong></div>
            </a>
          </div>

          <!-- Social links -->
          <div class="social-links">
            <a href="https://twitter.com" target="_blank" class="social-icon" aria-label="Twitter / X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" class="social-icon" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" class="social-icon" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" class="social-icon" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
        </div>

        <!-- Explore -->
        <div class="footer-col">
          <h4 class="footer-heading">Explore</h4>
          <ul class="footer-list">
            <li>
              <router-link to="/movies">
                <span class="link-dot"></span>Browse All Movies
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: '/movies', query: { status: 'now_showing' } }">
                <span class="link-dot"></span>Now Showing
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: '/movies', query: { status: 'coming_soon' } }">
                <span class="link-dot"></span>Coming Soon
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: '/movies', query: { genre: 'Action' } }">
                <span class="link-dot"></span>Action Movies
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: '/movies', query: { genre: 'Drama' } }">
                <span class="link-dot"></span>Drama
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: '/movies', query: { language: 'Hindi' } }">
                <span class="link-dot"></span>Hindi Films
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Account -->
        <div class="footer-col">
          <h4 class="footer-heading">Account</h4>
          <ul class="footer-list">
            <li>
              <router-link to="/login">
                <span class="link-dot"></span>Sign In
              </router-link>
            </li>
            <li>
              <router-link to="/register">
                <span class="link-dot"></span>Create Account
              </router-link>
            </li>
            <li>
              <router-link to="/my-bookings">
                <span class="link-dot"></span>My Bookings
              </router-link>
            </li>
            <li>
              <router-link to="/profile">
                <span class="link-dot"></span>My Profile
              </router-link>
            </li>
          </ul>

          <h4 class="footer-heading" style="margin-top: 1.5rem;">Cities</h4>
          <ul class="footer-list">
            <li>
              <router-link :to="{ path: '/movies', query: { city: 'Mumbai' } }">
                <span class="link-dot"></span>Mumbai
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: '/movies', query: { city: 'Delhi' } }">
                <span class="link-dot"></span>Delhi
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: '/movies', query: { city: 'Bengaluru' } }">
                <span class="link-dot"></span>Bengaluru
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: '/movies', query: { city: 'Chennai' } }">
                <span class="link-dot"></span>Chennai
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Help -->
        <div class="footer-col">
          <h4 class="footer-heading">Help & Support</h4>
          <ul class="footer-list">
            <li>
              <router-link to="/faq">
                <span class="link-dot"></span>FAQs
              </router-link>
            </li>
            <li>
              <router-link to="/contact">
                <span class="link-dot"></span>Contact Us
              </router-link>
            </li>
            <li>
              <a href="tel:18001232463">
                <span class="link-dot"></span>1800-123-CINE
              </a>
            </li>
            <li>
              <a href="mailto:support@cinevault.in">
                <span class="link-dot"></span>support@cinevault.in
              </a>
            </li>
          </ul>

          <h4 class="footer-heading" style="margin-top: 1.5rem;">Legal</h4>
          <ul class="footer-list">
            <li>
              <router-link to="/terms">
                <span class="link-dot"></span>Terms of Service
              </router-link>
            </li>
            <li>
              <router-link to="/privacy">
                <span class="link-dot"></span>Privacy Policy
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Trust badges -->
      <div class="trust-strip">
        <div class="trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Secure Payments</span>
        </div>
        <div class="trust-sep">·</div>
        <div class="trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Instant Confirmation</span>
        </div>
        <div class="trust-sep">·</div>
        <div class="trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <span>UPI · Cards · Wallets</span>
        </div>
        <div class="trust-sep">·</div>
        <div class="trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          <span>24/7 Support</span>
        </div>
        <div class="trust-sep">·</div>
        <div class="trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          <span>Best Price Guarantee</span>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p class="copyright">© {{ currentYear }} CineVault India Pvt. Ltd. All rights reserved.</p>
        <div class="bottom-links">
          <router-link to="/terms">Terms</router-link>
          <span>·</span>
          <router-link to="/privacy">Privacy</router-link>
          <span>·</span>
          <router-link to="/contact">Contact</router-link>
        </div>
        <div class="pci-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          PCI-DSS Compliant
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
const email       = ref('')
const subscribed  = ref(false)

function subscribe() {
  if (!email.value.trim()) return
  subscribed.value = true
}
</script>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: var(--space-2xl) 0 var(--space-lg);
  margin-top: var(--space-4xl);
}

/* ── Top Strip ───────────────────────────────────────────── */
.footer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  padding: var(--space-xl) 0;
}
.footer-tagline {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.3rem;
}
.footer-tagline-sub { color: var(--text-muted); font-size: 0.875rem; }

.newsletter-form { display: flex; gap: 0.5rem; flex-shrink: 0; }
.newsletter-input {
  padding: 10px 16px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
  width: 220px;
  transition: border-color 0.2s;
}
.newsletter-input:focus { border-color: var(--color-accent); }
.newsletter-btn { border-radius: var(--radius-full) !important; padding: 10px 20px !important; font-size: 0.875rem !important; }

.footer-divider { height: 1px; background: var(--border-color); margin: 0; }

/* ── Main Grid ───────────────────────────────────────────── */
.footer-grid {
  display: grid;
  grid-template-columns: 2.2fr 1.1fr 1.1fr 1.1fr;
  gap: 2.5rem;
  padding: var(--space-2xl) 0;
}

/* Brand */
.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}
.footer-logo .brand-icon { font-size: 1.5rem; }
.footer-logo .brand-text { font-family: var(--font-display); font-size: var(--font-size-xl); font-weight: 800; }
.footer-logo .brand-accent {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-desc {
  color: var(--text-muted);
  font-size: 0.8375rem;
  line-height: 1.7;
  margin-bottom: 1.25rem;
  max-width: 300px;
}

/* App badges */
.app-badges {
  display: flex;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}
.app-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.75rem;
  transition: all 0.2s;
  line-height: 1.3;
}
.app-badge:hover { border-color: var(--color-accent); color: var(--color-accent); }
.badge-store { font-size: 0.6875rem; opacity: 0.7; }
.app-badge strong { font-size: 0.8125rem; }

/* Social */
.social-links { display: flex; gap: 0.5rem; }
.social-icon {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-full);
  background: var(--bg-glass);
  color: var(--text-muted);
  transition: all 0.2s;
  border: 1px solid var(--border-color);
  text-decoration: none;
}
.social-icon:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

/* Footer columns */
.footer-heading {
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.footer-list { list-style: none; display: flex; flex-direction: column; gap: 0.625rem; }
.footer-list a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s;
}
.footer-list a:hover { color: var(--color-accent); padding-left: 3px; }

.link-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--border-color);
  flex-shrink: 0;
  transition: background 0.2s;
}
.footer-list a:hover .link-dot { background: var(--color-accent); }

/* ── Trust Strip ─────────────────────────────────────────── */
.trust-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1.25rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
}
.trust-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-weight: 600;
}
.trust-item svg { color: var(--color-accent); flex-shrink: 0; }
.trust-sep { color: var(--border-color); font-size: 1rem; }

/* ── Footer Bottom ───────────────────────────────────────── */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.copyright { color: var(--text-muted); font-size: 0.8125rem; }

.bottom-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
}
.bottom-links a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
.bottom-links a:hover { color: var(--color-accent); }

.pci-badge {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  opacity: 0.7;
}
.pci-badge svg { color: #22c55e; }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .footer-brand { grid-column: 1 / -1; }
  .footer-top { flex-direction: column; align-items: flex-start; }
  .newsletter-input { width: 200px; }
}

@media (max-width: 600px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .footer-bottom { flex-direction: column; text-align: center; }
  .trust-strip { gap: 0.625rem; }
  .trust-sep { display: none; }
}

@media (max-width: 400px) {
  .footer-grid { grid-template-columns: 1fr; }
  .newsletter-form { flex-direction: column; width: 100%; }
  .newsletter-input { width: 100%; }
}
</style>
