<template>
  <div class="contact-page">
    <div class="contact-layout">
      <div class="contact-panel glass-panel" v-reveal>
        <h1>Contact Us</h1>
        <p>Have a location in mind, or want to inquire? Reach out directly via WhatsApp, or use the details below.</p>

        <a :href="whatsappLink" target="_blank" rel="noopener" class="btn btn-whatsapp whatsapp-cta">
          Chat with us on WhatsApp
        </a>

        <ul class="contact-details">
          <li>
            <span class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M4 5h16v14H4z" stroke-linejoin="round" />
                <path d="m4 6 8 7 8-7" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="detail">
              <span class="label">Email</span>
              <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
            </span>
          </li>
          <li>
            <span class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path
                  d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1Z"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="detail">
              <span class="label">Phone</span>
              <a :href="`tel:${contactPhone}`">{{ contactPhone }}</a>
            </span>
          </li>
          <li>
            <span class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M12 21s7-6.1 7-11.2A7 7 0 0 0 5 9.8C5 14.9 12 21 12 21Z" stroke-linejoin="round" />
                <circle cx="12" cy="9.5" r="2.3" />
              </svg>
            </span>
            <span class="detail">
              <span class="label">Address</span>
              <span>{{ contactAddress }}</span>
            </span>
          </li>
        </ul>
      </div>

      <div class="contact-image" v-reveal>
        <img src="/images/contact-us.jpg" alt="A ShareLoc shoot location" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContactPage } from '~/scripts/pages/contact.js'

const { contactEmail, contactPhone, contactAddress, whatsappLink } = useContactPage()
</script>

<style scoped>
.contact-page {
  padding: 3rem 0;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 900px) {
  .contact-layout {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
  }
}

.contact-image {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  min-height: 260px;
}

.contact-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (min-width: 900px) {
  .contact-image {
    height: 100%;
    min-height: 420px;
  }
}

.contact-panel {
  padding: 2.5rem;
}

.contact-panel h1 {
  font-size: 2rem;
}

.whatsapp-cta {
  margin: 1.5rem 0 2rem;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contact-details li {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  background: hsla(32, 85%, 55%, 0.12);
  color: var(--color-accent);
}

.icon svg {
  width: 20px;
  height: 20px;
}

.detail {
  display: flex;
  flex-direction: column;
}

.detail .label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
