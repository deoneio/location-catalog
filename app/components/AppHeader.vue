<template>
  <header class="site-header glass-panel">
    <NuxtLink to="/" class="brand" @click="closeMenu">{{ siteName }}</NuxtLink>

    <nav class="nav" :class="{ 'nav--open': isMenuOpen }">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="nav-link"
        @click="closeMenu"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>

    <button
      type="button"
      class="menu-toggle"
      :class="{ 'menu-toggle--open': isMenuOpen }"
      :aria-expanded="isMenuOpen"
      aria-label="Toggle menu"
      @click="toggleMenu"
    >
      <span class="menu-icon" />
    </button>
  </header>
</template>

<script setup>
import { useAppHeader } from '~/scripts/components/AppHeader.js'

const { siteName, navLinks, isMenuOpen, toggleMenu, closeMenu } = useAppHeader()
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 0;
  border-width: 0 0 1px;
  /* Override the shared .glass-panel background: it's a neutral white tint,
     but the header needs to read warm even over non-cream backdrops (hero images, etc). */
  background: hsla(36, 30%, 97%, 0.72);
}

.brand {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 0.06em;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  position: relative;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 100%;
  bottom: -4px;
  height: 2px;
  background: var(--color-accent);
  transition: right var(--transition-base);
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link:hover::after {
  right: 0;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
}

.menu-icon,
.menu-icon::before,
.menu-icon::after {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text);
  transition: transform var(--transition-fast), opacity var(--transition-fast);
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: relative;
}

.menu-icon::before {
  top: 6px;
}

.menu-icon::after {
  top: 4px;
}

.menu-toggle--open .menu-icon {
  background: transparent;
}

.menu-toggle--open .menu-icon::before {
  top: 0;
  transform: rotate(45deg);
}

.menu-toggle--open .menu-icon::after {
  top: -2px;
  transform: rotate(-45deg);
}

@media (max-width: 640px) {
  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    box-shadow: var(--shadow-md);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity var(--transition-fast), transform var(--transition-fast), visibility var(--transition-fast);
  }

  .nav--open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .nav-link {
    padding: 0.85rem 1.5rem;
    border-top: 1px solid var(--color-border);
  }

  .nav-link::after {
    display: none;
  }

  .menu-toggle {
    display: block;
  }
}
</style>
