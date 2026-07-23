<!-- ============================================================
     FAQ.vue — Frequently Asked Questions Page
     Professional accordion-style FAQ with categories
     ============================================================ -->
<template>
  <div class="faq-page">
    <!-- Hero -->
    <div class="faq-hero">
      <div class="container">
        <div class="hero-icon">❓</div>
        <h1 class="hero-title">Frequently Asked Questions</h1>
        <p class="hero-subtitle">Everything you need to know about CineVault</p>
        <div class="search-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Search your question…" class="faq-search" />
        </div>
      </div>
    </div>

    <div class="container faq-body">
      <!-- Category Tabs -->
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-tab"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <span>{{ cat.icon }}</span> {{ cat.label }}
        </button>
      </div>

      <!-- FAQ Items -->
      <div class="faq-list">
        <div
          v-for="(faq, i) in filteredFaqs"
          :key="i"
          class="faq-item glass-card"
          :class="{ open: openIndex === i }"
        >
          <button class="faq-question" @click="toggle(i)">
            <span>{{ faq.q }}</span>
            <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-answer" v-show="openIndex === i">
            <p>{{ faq.a }}</p>
          </div>
        </div>

        <div v-if="filteredFaqs.length === 0" class="no-results glass-card">
          <span>🔍</span>
          <p>No results found for "<strong>{{ searchQuery }}</strong>"</p>
          <p class="hint">Try different keywords or <router-link to="/contact">contact us</router-link> directly.</p>
        </div>
      </div>

      <!-- Still Need Help -->
      <div class="help-cta glass-card">
        <div class="help-icon">💬</div>
        <div>
          <h3>Still have questions?</h3>
          <p>Our support team is available 24/7 to help you with any queries.</p>
        </div>
        <router-link to="/contact" class="btn btn-accent">Contact Support</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery   = ref('')
const openIndex     = ref(null)
const activeCategory = ref('all')

const categories = [
  { id: 'all',      icon: '📋', label: 'All' },
  { id: 'booking',  icon: '🎟️', label: 'Booking' },
  { id: 'payment',  icon: '💳', label: 'Payments' },
  { id: 'account',  icon: '👤', label: 'Account' },
  { id: 'refund',   icon: '↩️', label: 'Refunds' },
  { id: 'theatre',  icon: '🏛️', label: 'Theatres' },
]

const faqs = [
  // Booking
  { cat: 'booking', q: 'How do I book movie tickets on CineVault?', a: 'Browse to Movies, select a film you want to watch, choose a show time, pick your seats on the interactive seat map, and complete payment. You will receive a confirmation email with your e-ticket.' },
  { cat: 'booking', q: 'Can I choose my own seats?', a: 'Yes! CineVault offers a fully interactive PVR-style seat map. Green seats are available, red seats are already booked. Simply click any green seat to select it, then proceed to checkout.' },
  { cat: 'booking', q: 'How many tickets can I book at once?', a: 'You can book up to 10 tickets per transaction. For group bookings above 10, please contact our corporate desk.' },
  { cat: 'booking', q: 'Can I book tickets for a future date?', a: 'Yes, shows are listed up to 7 days in advance. Simply select the show date from the available slots on the movie details page.' },
  { cat: 'booking', q: 'What is the booking confirmation process?', a: 'Once payment is confirmed, you will see a booking confirmation screen with your booking ID and seat numbers. An e-ticket is also saved under "My Bookings" in your account.' },
  // Payment
  { cat: 'payment', q: 'What payment methods are accepted?', a: 'We accept UPI (Google Pay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking, and digital wallets. All transactions are secured with 256-bit SSL encryption.' },
  { cat: 'payment', q: 'Is it safe to enter my card details on CineVault?', a: 'Absolutely. CineVault uses industry-standard PCI-DSS compliant payment gateways. We never store your card details on our servers.' },
  { cat: 'payment', q: 'What is the convenience fee?', a: 'A small convenience fee of 5% is charged per booking to cover payment processing and platform maintenance costs. This is displayed clearly before you confirm payment.' },
  { cat: 'payment', q: 'Can I use multiple payment methods?', a: 'Currently each booking supports a single payment method. We are working on split-payment support for a future release.' },
  // Account
  { cat: 'account', q: 'How do I create an account?', a: 'Click "Sign Up" in the top navigation. Enter your name, email, phone number, and password. You will be logged in immediately after registration.' },
  { cat: 'account', q: 'I forgot my password. How do I reset it?', a: 'On the Sign In page, click "Forgot Password". Enter your registered email and follow the link sent to your inbox to set a new password.' },
  { cat: 'account', q: 'Where can I see my booking history?', a: 'Go to My Bookings from the navigation or your profile page. All past and upcoming bookings are listed there with full details.' },
  { cat: 'account', q: 'Can I update my profile information?', a: 'Yes. Visit your Profile page from the top-right menu. You can update your name, phone number, and city preference at any time.' },
  // Refund
  { cat: 'refund', q: 'Can I cancel my booking?', a: 'Cancellations are allowed up to 2 hours before the show start time. Go to My Bookings, select the booking, and click Cancel. Refunds are processed within 5–7 business days.' },
  { cat: 'refund', q: 'How long does the refund take?', a: 'Refunds are credited to the original payment method within 5–7 business days for cards, and within 24 hours for UPI transactions.' },
  { cat: 'refund', q: 'What is the cancellation fee?', a: 'Cancellations made more than 24 hours in advance: ₹30 per ticket. Within 24 hours: ₹50 per ticket. Within 2 hours: no refund.' },
  { cat: 'refund', q: 'What happens if a show is cancelled by the theatre?', a: 'If a show is cancelled by the theatre, you receive a full refund including the convenience fee, credited within 3–5 business days.' },
  // Theatre
  { cat: 'theatre', q: 'Which cities is CineVault available in?', a: 'CineVault is currently available in Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Kolkata, Pune, and Ahmedabad — with more cities being added soon.' },
  { cat: 'theatre', q: 'Which theatre chains are on CineVault?', a: 'We partner with PVR Cinemas, INOX, Cinépolis, SPI Sathyam, and select independent premium screens. New partners are added regularly.' },
  { cat: 'theatre', q: 'What formats are available?', a: 'Depending on the theatre, shows are available in 2D, 3D, IMAX, 4DX, Dolby Atmos, and LUXE formats. Available formats are shown on each show listing.' },
]

function toggle(i) {
  openIndex.value = openIndex.value === i ? null : i
}

const filteredFaqs = computed(() => {
  let list = faqs
  if (activeCategory.value !== 'all') {
    list = list.filter(f => f.cat === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
  }
  return list
})
</script>

<style scoped>
.faq-page { padding-bottom: var(--space-4xl); }

/* Hero */
.faq-hero {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border-bottom: 1px solid var(--border-color);
  padding: var(--space-3xl) 0;
  text-align: center;
}
.hero-icon { font-size: 3.5rem; margin-bottom: 1rem; }
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 900;
  margin-bottom: 0.5rem;
}
.hero-subtitle { color: var(--text-muted); margin-bottom: 2rem; font-size: 1.0625rem; }

.search-wrap {
  position: relative;
  max-width: 480px;
  margin: 0 auto;
}
.search-wrap svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}
.faq-search {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.2s;
}
.faq-search:focus { border-color: var(--color-accent); }

/* Body */
.faq-body { padding-top: var(--space-2xl); max-width: 800px; margin: 0 auto; }

/* Tabs */
.category-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}
.cat-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.cat-tab:hover { border-color: var(--color-accent); color: var(--color-accent); }
.cat-tab.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #000;
}

/* FAQ Items */
.faq-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2.5rem; }

.faq-item { overflow: hidden; transition: box-shadow 0.2s; }
.faq-item.open { border-color: var(--color-accent); box-shadow: 0 0 0 1px var(--color-accent); }

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.125rem 1.25rem;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s;
}
.faq-question:hover { color: var(--color-accent); }
.faq-item.open .faq-question { color: var(--color-accent); }

.chevron {
  flex-shrink: 0;
  transition: transform 0.3s ease;
  color: var(--text-muted);
}
.faq-item.open .chevron { transform: rotate(180deg); color: var(--color-accent); }

.faq-answer {
  padding: 0 1.25rem 1.25rem;
  border-top: 1px solid var(--border-color);
}
.faq-answer p {
  color: var(--text-secondary);
  line-height: 1.75;
  margin-top: 1rem;
  font-size: 0.9375rem;
}

/* No results */
.no-results {
  text-align: center;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.no-results span { font-size: 2.5rem; }
.no-results p { color: var(--text-muted); }
.no-results .hint { font-size: 0.875rem; }
.no-results a { color: var(--color-accent); text-decoration: none; }

/* Help CTA */
.help-cta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  flex-wrap: wrap;
}
.help-icon { font-size: 2.5rem; flex-shrink: 0; }
.help-cta h3 { font-family: var(--font-display); font-size: 1.125rem; font-weight: 700; margin-bottom: 0.25rem; }
.help-cta p { color: var(--text-muted); font-size: 0.875rem; }
.help-cta .btn { margin-left: auto; flex-shrink: 0; }

@media (max-width: 600px) {
  .help-cta .btn { margin-left: 0; width: 100%; text-align: center; }
}
</style>
