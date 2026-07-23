<!-- ============================================================
     Privacy.vue — Privacy Policy Page
     GDPR/Indian IT Act compliant privacy policy
     ============================================================ -->
<template>
  <div class="legal-page">
    <div class="legal-hero">
      <div class="container">
        <div class="hero-icon">🔒</div>
        <h1 class="hero-title">Privacy Policy</h1>
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

        <!-- Privacy Content -->
        <article class="legal-content">
          <div class="intro-box glass-card">
            <p>At <strong>CineVault</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our platform. We comply with the Information Technology Act, 2000 and applicable data protection regulations.</p>
          </div>

          <section id="collection" class="legal-section">
            <h2>1. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <div class="data-grid">
              <div class="data-card">
                <h4>📝 Account Data</h4>
                <p>Name, email address, phone number, and password (hashed) when you register.</p>
              </div>
              <div class="data-card">
                <h4>🎟️ Booking Data</h4>
                <p>Movies booked, show dates/times, theatre details, seat numbers, and transaction amounts.</p>
              </div>
              <div class="data-card">
                <h4>💳 Payment Data</h4>
                <p>Transaction IDs and payment method types. We never store full card numbers — handled by PCI-DSS certified gateways.</p>
              </div>
              <div class="data-card">
                <h4>📱 Device & Usage Data</h4>
                <p>IP address, browser type, operating system, pages viewed, and session duration for analytics and security.</p>
              </div>
            </div>
          </section>

          <section id="use" class="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Process and confirm ticket bookings.</li>
              <li>Send booking confirmations and e-tickets via email.</li>
              <li>Provide customer support and resolve disputes.</li>
              <li>Prevent fraud and ensure platform security.</li>
              <li>Personalise your experience (e.g., city preferences, recently viewed movies).</li>
              <li>Send promotional offers and updates — only with your consent.</li>
              <li>Analyse usage patterns to improve our services.</li>
            </ul>
          </section>

          <section id="sharing" class="legal-section">
            <h2>3. Sharing Your Information</h2>
            <p>We do <strong>not</strong> sell your personal data. We may share information in the following limited circumstances:</p>
            <ul>
              <li><strong>Theatre Partners:</strong> Booking details shared with the theatre to fulfil your ticket order.</li>
              <li><strong>Payment Processors:</strong> Transaction data shared with payment gateway providers for processing.</li>
              <li><strong>Legal Requirements:</strong> Information disclosed if required by law, court order, or government authority.</li>
              <li><strong>Service Providers:</strong> Trusted vendors (email, analytics, cloud hosting) under strict confidentiality agreements.</li>
            </ul>
          </section>

          <section id="cookies" class="legal-section">
            <h2>4. Cookies & Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Keep you logged in across sessions.</li>
              <li>Remember your preferences (city, language, dark mode).</li>
              <li>Understand how you navigate our platform (analytics).</li>
              <li>Prevent cross-site request forgery (security).</li>
            </ul>
            <p>You can manage or disable cookies in your browser settings. Note that disabling cookies may affect some features.</p>
          </section>

          <section id="security" class="legal-section">
            <h2>5. Data Security</h2>
            <p>We implement industry-standard security measures including:</p>
            <div class="security-badges">
              <div class="badge-item">🔐 256-bit SSL Encryption</div>
              <div class="badge-item">🛡️ PCI-DSS Compliance</div>
              <div class="badge-item">🔑 Hashed Passwords (bcrypt)</div>
              <div class="badge-item">🧱 DDoS Protection</div>
              <div class="badge-item">📊 Regular Security Audits</div>
              <div class="badge-item">🔒 Two-Factor Authentication (2FA)</div>
            </div>
            <p>While we take every precaution, no internet transmission is 100% secure. We encourage you to use a strong, unique password.</p>
          </section>

          <section id="retention" class="legal-section">
            <h2>6. Data Retention</h2>
            <p>We retain your data for as long as your account is active or as needed to provide services. Booking records are retained for 3 years for legal and compliance purposes. You may request deletion of your account data at any time (subject to legal retention obligations).</p>
          </section>

          <section id="rights" class="legal-section">
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data we hold.</li>
              <li><strong>Correction:</strong> Update inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> Request erasure of your data ("Right to be Forgotten").</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format.</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time.</li>
            </ul>
            <p>To exercise these rights, contact us at <a href="mailto:privacy@cinevault.in">privacy@cinevault.in</a>.</p>
          </section>

          <section id="children" class="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>CineVault is not intended for children under 18. We do not knowingly collect personal information from minors. If you believe a child has provided us with information, please contact us immediately and we will delete it.</p>
          </section>

          <section id="changes" class="legal-section">
            <h2>9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. Significant changes will be communicated via email or a prominent website notice. Your continued use of CineVault after changes indicates acceptance of the updated policy.</p>
          </section>

          <section id="contact-privacy" class="legal-section">
            <h2>10. Contact Our Privacy Team</h2>
            <p>For privacy-related queries or to exercise your rights:</p>
            <div class="contact-block">
              <p>📧 <a href="mailto:privacy@cinevault.in">privacy@cinevault.in</a></p>
              <p>📮 Data Protection Officer, CineVault India Pvt. Ltd., Level 14, One BKC Tower, Mumbai – 400051</p>
              <p>⏱️ We respond to all privacy requests within 30 days.</p>
            </div>
          </section>
        </article>
      </div>

      <!-- Related Links -->
      <div class="related-links">
        <router-link to="/terms" class="related-card glass-card">
          <span>📄</span>
          <div><h4>Terms of Service</h4><p>Our platform usage terms and conditions</p></div>
          <span class="arrow">→</span>
        </router-link>
        <router-link to="/faq" class="related-card glass-card">
          <span>❓</span>
          <div><h4>FAQ</h4><p>Common questions answered</p></div>
          <span class="arrow">→</span>
        </router-link>
        <router-link to="/contact" class="related-card glass-card">
          <span>💬</span>
          <div><h4>Contact Us</h4><p>Reach out for privacy concerns</p></div>
          <span class="arrow">→</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const lastUpdated = '22 July 2026'

const sections = [
  { id: 'collection',      title: '1. Information We Collect' },
  { id: 'use',             title: '2. How We Use Your Information' },
  { id: 'sharing',         title: '3. Sharing Your Information' },
  { id: 'cookies',         title: '4. Cookies & Tracking' },
  { id: 'security',        title: '5. Data Security' },
  { id: 'retention',       title: '6. Data Retention' },
  { id: 'rights',          title: '7. Your Rights' },
  { id: 'children',        title: '8. Children\'s Privacy' },
  { id: 'changes',         title: '9. Changes to This Policy' },
  { id: 'contact-privacy', title: '10. Contact Our Privacy Team' },
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

.toc { padding: 1.25rem; position: sticky; top: 88px; }
.toc-title { font-family: var(--font-display); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1rem; color: var(--color-accent); }
.toc-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
.toc-list a { color: var(--text-muted); font-size: 0.8125rem; text-decoration: none; transition: color 0.2s; line-height: 1.4; display: block; }
.toc-list a:hover { color: var(--color-accent); }

.intro-box { padding: 1.25rem 1.5rem; margin-bottom: 2rem; }
.intro-box p { color: var(--text-secondary); line-height: 1.75; }

.legal-section { margin-bottom: 2.5rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color); }
.legal-section:last-child { border-bottom: none; }
.legal-section h2 { font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem; }
.legal-section p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.875rem; font-size: 0.9375rem; }
.legal-section ul { color: var(--text-secondary); padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9375rem; line-height: 1.75; }
.legal-section a { color: var(--color-accent); text-decoration: none; }

/* Data Cards */
.data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
.data-card {
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-glass);
}
.data-card h4 { font-size: 0.875rem; font-weight: 700; margin-bottom: 0.4rem; }
.data-card p { color: var(--text-muted); font-size: 0.8125rem; line-height: 1.65; margin: 0; }

/* Security Badges */
.security-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin: 1rem 0;
}
.badge-item {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.2);
  color: var(--color-accent);
  font-size: 0.8125rem;
  font-weight: 600;
}

.contact-block { margin-top: 0.875rem; display: flex; flex-direction: column; gap: 0.4rem; }
.contact-block a { color: var(--color-accent); text-decoration: none; }
.contact-block p { color: var(--text-muted); font-size: 0.9375rem; }

/* Related */
.related-links { margin-top: var(--space-2xl); display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
.related-card {
  display: flex; align-items: center; gap: 1rem; padding: 1.25rem;
  text-decoration: none; color: var(--text-primary); transition: transform 0.2s, border-color 0.2s;
  font-size: 1.5rem;
}
.related-card:hover { transform: translateY(-2px); border-color: var(--color-accent); }
.related-card h4 { font-family: var(--font-display); font-weight: 700; font-size: 0.9375rem; }
.related-card p { color: var(--text-muted); font-size: 0.8125rem; margin-top: 0.15rem; }
.arrow { margin-left: auto; color: var(--color-accent); font-size: 1.125rem; }

@media (max-width: 900px) {
  .legal-layout { grid-template-columns: 1fr; }
  .toc { position: static; }
  .data-grid { grid-template-columns: 1fr; }
  .related-links { grid-template-columns: 1fr; }
}
</style>
