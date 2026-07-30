<template>
  <div ref="rootEl" class="multi-select-filter">
    <button
      ref="triggerEl"
      type="button"
      class="msf-trigger"
      :class="{ 'msf-trigger--active': open || selected.length }"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="toggleOpen"
    >
      <span>{{ label }}</span>
      <span v-if="selected.length" class="msf-count">{{ selected.length }}</span>
      <svg class="msf-chevron" :class="{ 'msf-chevron--open': open }" viewBox="0 0 12 8" aria-hidden="true">
        <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Teleport to="body">
      <Transition name="msf-fade">
        <div
          v-if="open"
          ref="panelEl"
          :id="panelId"
          class="msf-panel"
          :style="panelStyle"
          role="listbox"
          aria-multiselectable="true"
          :aria-label="label"
          @wheel="handlePanelWheel"
        >
          <div class="msf-panel-header">
            <span class="msf-panel-title">{{ label }}</span>
            <button type="button" class="msf-clear" :disabled="!selected.length" @click="$emit('clear')">
              Clear
            </button>
          </div>

          <ul ref="optionsListEl" class="msf-options">
            <li v-for="option in options" :key="option">
              <label class="msf-option">
                <input
                  type="checkbox"
                  :checked="selected.includes(option)"
                  @change="$emit('toggle', option)"
                />
                <span>{{ option }}</span>
              </label>
            </li>
            <li v-if="!options.length" class="msf-empty">No options available</li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, useId, onBeforeUnmount, watch, nextTick } from 'vue'

defineProps({
  label: { type: String, required: true },
  options: { type: Array, default: () => [] },
  selected: { type: Array, default: () => [] }
})

defineEmits(['toggle', 'clear'])

const PANEL_FALLBACK_WIDTH = 280
const VIEWPORT_MARGIN = 8
const PANEL_GAP = 8

const open = ref(false)
const rootEl = ref(null)
const triggerEl = ref(null)
const panelEl = ref(null)
const optionsListEl = ref(null)
const panelId = `msf-panel-${useId()}`
const panelPosition = ref({ top: 0, left: 0 })

const panelStyle = computed(() => ({
  top: `${panelPosition.value.top}px`,
  left: `${panelPosition.value.left}px`
}))

function updatePosition() {
  const trigger = triggerEl.value
  if (!trigger) return

  const rect = trigger.getBoundingClientRect()
  const panelWidth = panelEl.value?.offsetWidth ?? PANEL_FALLBACK_WIDTH
  const maxLeft = window.innerWidth - panelWidth - VIEWPORT_MARGIN

  panelPosition.value = {
    top: rect.bottom + PANEL_GAP,
    left: Math.max(VIEWPORT_MARGIN, Math.min(rect.left, maxLeft))
  }
}

async function toggleOpen() {
  open.value = !open.value
  if (open.value) {
    updatePosition()
    await nextTick()
    updatePosition()
  }
}

function handlePanelWheel(event) {
  const el = optionsListEl.value
  if (!el) return
  el.scrollTop += event.deltaY
  event.preventDefault()
}

function handleClickOutside(event) {
  const clickedTrigger = rootEl.value && rootEl.value.contains(event.target)
  const clickedPanel = panelEl.value && panelEl.value.contains(event.target)
  if (!clickedTrigger && !clickedPanel) {
    open.value = false
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    open.value = false
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
  } else {
    document.removeEventListener('mousedown', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})
</script>

<style scoped>
.multi-select-filter {
  display: inline-flex;
}

.msf-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.9rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font: inherit;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: border-color var(--transition-fast), color var(--transition-fast), background-color var(--transition-fast);
}

.msf-trigger:hover {
  color: var(--color-text);
  border-color: var(--color-text-muted);
}

.msf-trigger--active {
  border-color: var(--color-accent);
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.msf-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.1rem;
  height: 1.1rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  font-size: 0.7rem;
  line-height: 1;
}

.msf-chevron {
  width: 0.6rem;
  height: 0.6rem;
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

.msf-chevron--open {
  transform: rotate(180deg);
}

.msf-panel {
  position: fixed;
  z-index: 45;
  width: max-content;
  min-width: 200px;
  max-width: min(280px, calc(100vw - 1rem));
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 0.75rem;
}

.msf-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.msf-panel-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text);
}

.msf-clear {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  font-size: 0.75rem;
  color: var(--color-accent);
  cursor: pointer;
}

.msf-clear:disabled {
  color: var(--color-text-muted);
  opacity: 0.5;
  cursor: default;
}

.msf-clear:not(:disabled):hover {
  text-decoration: underline;
}

.msf-options {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 240px;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.msf-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.4rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.msf-option:hover {
  background: color-mix(in srgb, var(--color-accent) 8%, transparent);
}

.msf-option input {
  accent-color: var(--color-accent);
}

.msf-empty {
  padding: 0.4rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.msf-fade-enter-active,
.msf-fade-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.msf-fade-enter-from,
.msf-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
