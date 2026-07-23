<!-- ============================================================
     Terms.vue — Terms of Service Page
     Comprehensive legal terms for CineVault
     ============================================================ -->
<template>
  <div class="legal-page">
    <div class="legal-hero">
      <div class="container">
        <div class="hero-icon">📄</div>
        <h1 class="hero-title">Terms of Service</h1>
        <p class="hero-subtitle">Last updated: <strong>{{ lastUpdated }}</strong></p>
      </div>
    </div>

    <div class="container legal-body">
      <div class="legal-layout">
        <!-- Table of Contents -->
        <nav class="toc glass-card">
          <h3 class="toc-title">Contents</h3>
          <ul class="toc-list">
            <li v-for="section in sections" :key="section.id">
              <a :href="'#' + section.id">{{ section.title }}</a>
            </li>
          </ul>
        </nav>

        <!-- Legal Content -->
        <article class="legal-content">
          <div class="intro-box glass-card">
            <p>Welcome to <strong>CineVault</strong>. By accessing or using our platform, website, or mobile application, you agree to be bound by these Terms of Service. Please read them carefully before making any booking.</p>
          </div>

          <section :id="sections[0].id" class="legal-section">
            <h2>1. Definitions</h2>
            <p>"CineVault", "we", "us", or "our" refers to CineVault India Pvt. Ltd. "User", "you", or "your" refers to any person accessing or using our platform. "Services" means the movie ticket booking and related services offered on our platform.</p>
          </section>

          <section :id="sections[1].id" class="legal-section">
            <h2>2. Eligibility & Account Registration</h2>
            <p>You must be at least 18 years old to create an account and make bookings. By registering, you warrant that all information provided is accurate, current, and complete. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            <ul>
              <li>One account per individual.</li>
              <li>Account sharing is prohibited.</li>
              <li>You must notify us immediately of any unauthorised access.</li>
            </ul>
          </section>

          <section :id="sections[2].id" class="legal-section">
            <h2>3. Ticket Booking & Pricing</h2>
            <p>All ticket prices are displayed inclusive of applicable taxes. A convenience fee is applied per booking to cover payment processing costs. Prices are subject to change without prior notice, but your booking is locked at the price confirmed at checkout.</p>
            <div class="highlight-box">
              <strong>💡 Note:</strong> Ticket prices may vary based on show format (IMAX, 4DX, Dolby), seat tier (Prime, Picture Perfect, Classic), and theatre location.
            </div>
          </section>

          <section :id="sections[3].id" class="legal-section">
            <h2>4. Cancellations & Refunds</h2>
            <p>Cancellation requests are subject to the following policy:</p>
            <table class="policy-table">
              <thead><tr><th>Cancellation Time</th><th>Refund Amount</th></tr></thead>
              <tbody>
                <tr><td>More than 24 hours before show</td><td>Ticket price minus ₹30/ticket</td></tr>
                <tr><td>2–24 hours before show</td><td>Ticket price minus ₹50/ticket</td></tr>
                <tr><td>Less than 2 hours before show</td><td>No refund</td></tr>
                <tr><td>Show cancelled by theatre</td><td>Full refund including convenience fee</td></tr>
              </tbody>
            </table>
            <p>Refunds are processed to the original payment method. Processing time: 5–7 business days for cards, 24 hours for UPI.</p>
          </section>

          <section :id="sections[4].id" class="legal-section">
            <h2>5. User Conduct</h2>
            <p>You agree not to use our platform for any unlawful purpose or in any way that could harm CineVault or other users. Prohibited activities include:</p>
            <ul>
              <li>Attempting to circumvent our booking system or security measures.</li>
              <li>Reselling tickets at inflated prices (ticket touting).</li>
              <li>Creating false bookings or fraudulent accounts.</li>
              <li>Scraping, crawling, or harvesting data without permission.</li>
              <li>Interfering with the proper working of the platform.</li>
            </ul>
          </section>

          <section :id="sections[5].id" class="legal-section">
            <h2>6. Intellectual Property</h2>
            <p>All content on CineVault — including but not limited to logos, movie data, design elements, and software — is the intellectual property of CineVault India Pvt. Ltd. or licensed from third parties. You may not reproduce, distribute, or create derivative works without our written consent.</p>
          </section>

          <section :id="sections[6].id" class="legal-section">
            <h2>7. Limitation of Liability</h2>
            <p>CineVault acts as an intermediary between users and theatre partners. We are not liable for show cancellations, quality of experience at the theatre, or any force majeure events. Our maximum liability to you for any claim is limited to the total amount paid for the relevant booking.</p>
          </section>

          <section :id="sections[7].id" class="legal-section">
            <h2>8. Governing Law</h2>
            <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra. We encourage you to first contact our support team to resolve any issues amicably.</p>
          </section>

          <section :id="sections[8].id" class="legal-section">
            <h2>9. Changes to Terms</h2>
            <p>We reserve the right to update these Terms at any time. Material changes will be notified via email or a prominent notice on our website. Continued use of CineVault after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section :id="sections[9].id" class="legal-section">
            <h2>10. Contact</h2>
            <p>For questions about these Terms, please contact our Legal team:</p>
            <div class="contact-block">
              <p>📧 <a href="mailto:legal@cinevault.in">legal@cinevault.in</a></p>
              <p>📮 CineVault India Pvt. Ltd., Level 14, One BKC Tower, Mumbai – 400051</p>
            </div>
          </section>
        </article>
      </div>

      <!-- Related Links -->
      <div class="related-links">
        <router-link to="/privacy" class="related-card glass-card">
          <span>🔒</span>
          <div>
            <h4>Privacy Policy</h4>
            <p>How we collect, use, and protect your data</p>
          </div>
          <span class="arrow">→</span>
        </router-link>
        <router-link to="/faq" class="related-card glass-card">
          <span>❓</span>
          <div>
            <h4>FAQ</h4>
            <p>Answers to common questions</p>
          </div>
          <span class="arrow">→</span>
        </router-link>
        <router-link to="/contact" class="related-card glass-card">
          <span>💬</span>
          <div>
            <h4>Contact Us</h4>
            <p>Reach out to our support team</p>
          </div>
          <span class="arrow">→</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const lastUpdated = '22 July 2026'

const sections = [
  { id: 'definitions',   title: '1. Definitions' },
  { id: 'eligibility',   title: '2. Eligibility & Account Registration' },
  { id: 'booking',       title: '3. Ticket Booking & Pricing' },
  { id: 'cancellations', title: '4. Cancellations & Refunds' },
  { id: 'conduct',       title: '5. User Conduct' },
  { id: 'ip',            title: '6. Intellectual Property' },
  { id: 'liability',     title: '7. Limitation of Liability' },
  { id: 'law',           title: '8. Governing Law' },
  { id: 'changes',       title: '9. Changes to Terms' },
  { id: 'contact-legal', title: '10. Contact' },
]
</script>

<style scoped>
.legal-page { padding-bottom: var(--space-4xl); }

.legal-hero {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border-bottom: 1px solid var(--border-color);
  padding: var(--space-2xl) 0;
  text-align: center;
}
.hero-icon { font-size: 3rem; margin-bottom: 0.75rem; }
.hero-title { font-family: var(--font-display); font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 900; margin-bottom: 0.4rem; }
.hero-subtitle { color: var(--text-muted); font-size: 0.9375rem; }

.legal-body { padding-top: var(--space-2xl); }
.legal-layout { display: grid; grid-template-columns: 240px 1fr; gap: var(--space-2xl); align-items: start; }

/* TOC */
.toc { padding: 1.25rem; position: sticky; top: 88px; }
.toc-title { font-family: var(--font-display); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1rem; color: var(--color-accent); }
.toc-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
.toc-list a { color: var(--text-muted); font-size: 0.8125rem; text-decoration: none; transition: color 0.2s; line-height: 1.4; display: block; }
.toc-list a:hover { color: var(--color-accent); }

/* Content */
.intro-box { padding: 1.25rem 1.5rem; margin-bottom: 2rem; }
.intro-box p { color: var(--text-secondary); line-height: 1.75; }

.legal-section { margin-bottom: 2.5rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color); }
.legal-section:last-child { border-bottom: none; }
.legal-section h2 { font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem; }
.legal-section p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.875rem; font-size: 0.9375rem; }
.legal-section ul { color: var(--text-secondary); padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9375rem; line-height: 1.75; }

.highlight-box {
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  background: rgba(0,212,255,0.07);
  border-left: 3px solid var(--color-accent);
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.7;
  margin-top: 1rem;
}

.policy-table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
.policy-table th { background: var(--bg-glass); padding: 10px 14px; text-align: left; font-weight: 700; font-size: 0.8125rem; border: 1px solid var(--border-color); }
.policy-table td { padding: 10px 14px; border: 1px solid var(--border-color); color: var(--text-secondary); }
.policy-table tr:nth-child(even) td { background: rgba(255,255,255,0.02); }

.contact-block { margin-top: 0.875rem; display: flex; flex-direction: column; gap: 0.4rem; }
.contact-block a { color: var(--color-accent); text-decoration: none; }

/* Related */
.related-links {
  margin-top: var(--space-2xl);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}
.related-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  text-decoration: none;
  color: var(--text-primary);
  transition: transform 0.2s, border-color 0.2s;
  font-size: 1.5rem;
}
.related-card:hover { transform: translateY(-2px); border-color: var(--color-accent); }
.related-card h4 { font-family: var(--font-display); font-weight: 700; font-size: 0.9375rem; }
.related-card p { color: var(--text-muted); font-size: 0.8125rem; margin-top: 0.15rem; }
.arrow { margin-left: auto; color: var(--color-accent); font-size: 1.125rem; }

@media (max-width: 900px) {
  .legal-layout { grid-template-columns: 1fr; }
  .toc { position: static; }
  .related-links { grid-template-columns: 1fr; }
}
</style>
