<!-- ============================================================
     Contact.vue — Professional Contact Us Page
     Multi-channel support with form + info cards
     ============================================================ -->
<template>
  <div class="contact-page">
    <!-- Hero -->
    <div class="contact-hero">
      <div class="container">
        <div class="hero-icon">💬</div>
        <h1 class="hero-title">Contact Us</h1>
        <p class="hero-subtitle">We're here to help — reach out through any channel</p>
      </div>
    </div>

    <div class="container contact-body">
      <!-- Support Channels -->
      <div class="channels-grid">
        <div class="channel-card glass-card">
          <div class="channel-icon" style="background: rgba(0,212,255,0.1); color: #00d4ff;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 0 0 1 1.18 2 2 0 013 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 7a16 16 0 006.29 6.29l1.36-1.16a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
          </div>
          <h3>Call Us</h3>
          <p class="channel-value">1800-123-CINE (2463)</p>
          <p class="channel-note">Mon–Sun · 8 AM – 11 PM</p>
          <a href="tel:18001232463" class="channel-link">Call Now →</a>
        </div>

        <div class="channel-card glass-card">
          <div class="channel-icon" style="background: rgba(168,85,247,0.1); color: #a855f7;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h3>Email Support</h3>
          <p class="channel-value">support@cinevault.in</p>
          <p class="channel-note">Response within 24 hours</p>
          <a href="mailto:support@cinevault.in" class="channel-link">Send Email →</a>
        </div>

        <div class="channel-card glass-card">
          <div class="channel-icon" style="background: rgba(34,197,94,0.1); color: #22c55e;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.5 2C6.262 2 2 6.262 2 11.5c0 1.832.516 3.538 1.407 4.988L2 22l5.668-1.383A9.463 9.463 0 0011.5 21C16.738 21 21 16.738 21 11.5S16.738 2 11.5 2z"/></svg>
          </div>
          <h3>WhatsApp</h3>
          <p class="channel-value">+91 98765 43210</p>
          <p class="channel-note">Quick replies · 9 AM – 10 PM</p>
          <a href="https://wa.me/919876543210" target="_blank" class="channel-link">Chat Now →</a>
        </div>

        <div class="channel-card glass-card">
          <div class="channel-icon" style="background: rgba(245,158,11,0.1); color: #f59e0b;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <h3>Live Chat</h3>
          <p class="channel-value">Available on site</p>
          <p class="channel-note">Average wait: under 2 min</p>
          <button class="channel-link" @click="showChat">Start Chat →</button>
        </div>
      </div>

      <!-- Main Layout: Form + Info -->
      <div class="contact-layout">
        <!-- Contact Form -->
        <div class="form-section">
          <h2 class="section-title">Send us a Message</h2>

          <div v-if="submitted" class="success-message glass-card">
            <div class="success-icon">✅</div>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. Our team will respond to <strong>{{ formData.email }}</strong> within 24 hours.</p>
            <button class="btn btn-outline" @click="resetForm">Send Another</button>
          </div>

          <form v-else class="contact-form glass-card" @submit.prevent="submitForm">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input v-model="formData.name" type="text" class="form-input" placeholder="Raj Kumar" required />
              </div>
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input v-model="formData.email" type="email" class="form-input" placeholder="raj@example.com" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input v-model="formData.phone" type="tel" class="form-input" placeholder="+91 98765 43210" />
              </div>
              <div class="form-group">
                <label class="form-label">Subject *</label>
                <select v-model="formData.subject" class="form-input" required>
                  <option value="">Select a topic…</option>
                  <option>Booking Issue</option>
                  <option>Payment Problem</option>
                  <option>Refund Request</option>
                  <option>Account Help</option>
                  <option>Technical Issue</option>
                  <option>Feedback / Suggestion</option>
                  <option>Partnership Enquiry</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div class="form-group" v-if="hasBookingIssue">
              <label class="form-label">Booking ID</label>
              <input v-model="formData.bookingId" type="text" class="form-input" placeholder="e.g. BK-20260722-0041" />
            </div>

            <div class="form-group">
              <label class="form-label">Message *</label>
              <textarea
                v-model="formData.message"
                class="form-input"
                rows="5"
                placeholder="Please describe your issue or query in detail…"
                required
              ></textarea>
            </div>

            <div class="form-footer">
              <p class="privacy-note">🔒 Your data is secure and never shared with third parties.</p>
              <button type="submit" class="btn btn-accent btn-lg" :disabled="submitting">
                <span v-if="submitting">Sending…</span>
                <span v-else>Send Message →</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Info Sidebar -->
        <aside class="info-sidebar">
          <div class="info-card glass-card">
            <h3 class="info-title">Office Address</h3>
            <div class="address-block">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div>
                <p>CineVault India Pvt. Ltd.</p>
                <p>Level 14, One BKC Tower</p>
                <p>Bandra Kurla Complex</p>
                <p>Mumbai – 400051, Maharashtra</p>
              </div>
            </div>
          </div>

          <div class="info-card glass-card">
            <h3 class="info-title">Support Hours</h3>
            <div class="hours-list">
              <div class="hours-row"><span>Mon – Fri</span><span class="hours-val">8 AM – 11 PM</span></div>
              <div class="hours-row"><span>Sat – Sun</span><span class="hours-val">9 AM – 10 PM</span></div>
              <div class="hours-row"><span>Public Holidays</span><span class="hours-val">10 AM – 8 PM</span></div>
            </div>
          </div>

          <div class="info-card glass-card">
            <h3 class="info-title">Follow Us</h3>
            <div class="social-row">
              <a href="#" class="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter / X
              </a>
              <a href="#" class="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
                Instagram
              </a>
              <a href="#" class="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YouTube
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const submitted  = ref(false)
const submitting = ref(false)

const formData = reactive({
  name: '', email: '', phone: '', subject: '', bookingId: '', message: ''
})

const hasBookingIssue = computed(() =>
  ['Booking Issue', 'Payment Problem', 'Refund Request'].includes(formData.subject)
)

async function submitForm() {
  submitting.value = true
  // Simulate API call
  await new Promise(r => setTimeout(r, 1200))
  submitting.value = false
  submitted.value  = true
}

function resetForm() {
  Object.assign(formData, { name: '', email: '', phone: '', subject: '', bookingId: '', message: '' })
  submitted.value = false
}

function showChat() {
  alert('Live chat feature coming soon! Please use email or phone support for now.')
}
</script>

<style scoped>
.contact-page { padding-bottom: var(--space-4xl); }

/* Hero */
.contact-hero {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border-bottom: 1px solid var(--border-color);
  padding: var(--space-3xl) 0;
  text-align: center;
}
.hero-icon { font-size: 3.5rem; margin-bottom: 1rem; }
.hero-title { font-family: var(--font-display); font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 900; margin-bottom: 0.5rem; }
.hero-subtitle { color: var(--text-muted); font-size: 1.0625rem; }

.contact-body { padding-top: var(--space-2xl); }

/* Channels */
.channels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: var(--space-2xl);
}
.channel-card {
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  transition: transform 0.2s;
}
.channel-card:hover { transform: translateY(-3px); }
.channel-icon {
  width: 56px; height: 56px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 0.25rem;
}
.channel-card h3 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; }
.channel-value { font-weight: 700; font-size: 0.9375rem; color: var(--text-primary); }
.channel-note { font-size: 0.8125rem; color: var(--text-muted); }
.channel-link {
  color: var(--color-accent);
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}
.channel-link:hover { color: var(--color-accent-light); }

/* Layout */
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-2xl);
  align-items: start;
}

/* Form */
.section-title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 800;
  margin-bottom: 1.25rem;
}
.contact-form { padding: 1.75rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
.form-label { font-size: 0.875rem; font-weight: 600; color: var(--text-secondary); }
.form-input {
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  font-family: inherit;
}
.form-input:focus { border-color: var(--color-accent); }
textarea.form-input { resize: vertical; min-height: 120px; }
.form-footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem; }
.privacy-note { font-size: 0.8125rem; color: var(--text-muted); }

/* Success */
.success-message {
  padding: 2.5rem;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
}
.success-icon { font-size: 3rem; }
.success-message h3 { font-family: var(--font-display); font-size: 1.375rem; font-weight: 700; }
.success-message p { color: var(--text-muted); }

/* Info Sidebar */
.info-sidebar { display: flex; flex-direction: column; gap: 1.25rem; }
.info-card { padding: 1.25rem; }
.info-title { font-family: var(--font-display); font-size: 0.9375rem; font-weight: 700; margin-bottom: 0.875rem; color: var(--color-accent); }
.address-block { display: flex; gap: 0.75rem; }
.address-block svg { flex-shrink: 0; margin-top: 2px; color: var(--color-accent); }
.address-block p { color: var(--text-muted); font-size: 0.875rem; line-height: 1.75; }
.hours-list { display: flex; flex-direction: column; gap: 0.5rem; }
.hours-row { display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--text-muted); }
.hours-val { font-weight: 600; color: var(--text-primary); }
.social-row { display: flex; flex-direction: column; gap: 0.625rem; }
.social-btn {
  display: flex; align-items: center; gap: 0.625rem;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
}
.social-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }

@media (max-width: 900px) {
  .contact-layout { grid-template-columns: 1fr; }
  .info-sidebar { order: -1; }
  .channels-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
  .channels-grid { grid-template-columns: 1fr; }
}
</style>
