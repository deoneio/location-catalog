<template>
  <section class="contact-hero">
    <div class="contact-hero-media">
      <img src="/images/contact-us.jpg" alt="A ShareLoc shoot location" />
      <div class="contact-hero-overlay" />
    </div>

    <div class="contact-hero-content" v-reveal>
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
  </section>
</template>

<script setup>
import { useContactPage } from '~/scripts/pages/contact.js'

const { contactEmail, contactPhone, contactAddress, whatsappLink } = useContactPage()
</script>

<style scoped>
.contact-hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.contact-hero-media {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.contact-hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--color-primary) 0%, transparent 65%);
}

.contact-hero-content {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem 3.5rem;
  color: hsla(30, 20%, 97%, 0.95);
}

.contact-hero-content h1 {
  font-family: var(--font-heading);
  font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl));
  color: hsla(30, 25%, 98%, 1);
}

.contact-hero-content p {
  color: hsla(30, 15%, 96%, 0.85);
  font-size: 1.1rem;
  margin: 1rem 0 0;
  max-width: 46ch;
}

.whatsapp-cta {
  margin: 1.75rem 0 2.25rem;
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
  background: hsla(36, 30%, 97%, 0.15);
  color: hsl(32, 70%, 70%);
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
  color: hsla(30, 15%, 96%, 0.6);
}

@media (max-width: 640px) {
  .contact-hero {
    min-height: auto;
  }

  .contact-hero-content {
    padding: 3rem 1.25rem 2.5rem;
  }

  .contact-hero-content h1 {
    font-size: var(--text-3xl);
  }

  .contact-hero-content p {
    font-size: 1rem;
  }

  .contact-details {
    gap: 1rem;
  }
}
</style>
