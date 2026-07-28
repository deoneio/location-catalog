<template>
  <header class="site-header glass-panel" :class="{ 'site-header--scrolled': isScrolled }">
    <NuxtLink to="/" class="brand" @click="closeMenu">
      <img src="/images/logo.png" :alt="siteName" class="brand-logo" />
    </NuxtLink>

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

    <div class="header-actions" aria-hidden="true" />

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

const { siteName, navLinks, isMenuOpen, isScrolled, toggleMenu, closeMenu } = useAppHeader()
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  column-gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 0;
  border-width: 0 0 1px;
  /* Override the shared .glass-panel background: it's a neutral white tint,
     but the header needs to read warm even over non-cream backdrops (hero images, etc). */
  background: hsla(36, 30%, 97%, 0.45);
  transition: background-color var(--transition-fast);
}

.site-header--scrolled {
  background: hsla(36, 30%, 97%, 0.94);
}

.brand {
  grid-column: 1;
  justify-self: start;
  display: flex;
  align-items: center;
}

.brand-logo {
  display: block;
  height: 2rem;
  width: auto;
}

.nav {
  grid-column: 2;
  justify-self: center;
  display: flex;
  gap: 2rem;
}

/* Empty for now — reserves the right-hand column so the centered nav
   doesn't drift when a button/icon lands here later. Width approximates
   the logo's rendered width so both outer grid columns stay balanced. */
.header-actions {
  grid-column: 3;
  justify-self: end;
  min-width: 7.5rem;
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
  .site-header {
    grid-template-columns: auto 1fr auto;
  }

  .header-actions {
    display: none;
  }

  .menu-toggle {
    grid-column: 3;
  }

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
