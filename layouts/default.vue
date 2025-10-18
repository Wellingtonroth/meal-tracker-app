<template>
  <div class="app-shell">
    <DesktopSidebar />

    <main class="content">
      <button class="theme-toggle" @click="toggleTheme">
        {{ theme === 'dark' ? '🌙' : '☀️' }}
      </button>
      <slot />
    </main>

    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import BottomNavigation from '@/components/navigation/BottomNavigation.vue'
import DesktopSidebar from '@/components/navigation/DesktopSidebar.vue'

const { theme, toggleTheme } = useTheme()
</script>

<style scoped lang="scss">
.app-shell {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100dvh;
  background: var(--color-surface);

  @media (min-width: 1024px) {
    grid-template-columns: 250px 1fr;
  }
}

.content {
  min-height: 100%;
  padding: 16px;

  @media (min-width: 1024px) {
    padding: 24px;
  }

  @media (max-width: 1023px) {
    padding-bottom: calc(var(--bottom-nav-height, 72px) + env(safe-area-inset-bottom, 0px) + 16px);
  }
}

.theme-toggle {
  margin-bottom: 1rem;
  padding: 4px 6px;
  border: 1px solid var(--color-divider);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  font-size: 14px;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    background: var(--color-primary);
    color: var(--color-on-primary);
    border-color: var(--color-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}
</style>
