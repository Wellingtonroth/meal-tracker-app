<template>
  <nav class="bottom-nav" role="navigation" aria-label="Primary">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="nav-item"
      :aria-label="item.label"
    >
      <component :is="isActive(item.to) ? item.iconSolid : item.icon" class="icon" />
      <span class="label" :class="{ active: isActive(item.to) }">
        {{ item.label }}
      </span>
    </NuxtLink>

    <div class="safe-area" aria-hidden="true" />
  </nav>
</template>

<script setup lang="ts">
import {
  ChartBarIcon as ChartOutline,
  Cog6ToothIcon as CogOutline,
  DocumentTextIcon as DocOutline,
  HomeIcon as HomeOutline,
} from '@heroicons/vue/24/outline'
import {
  ChartBarIcon as ChartSolid,
  Cog6ToothIcon as CogSolid,
  DocumentTextIcon as DocSolid,
  HomeIcon as HomeSolid,
} from '@heroicons/vue/24/solid'
import { useActiveLink } from '@/composables/useActiveLink'

const { isActive } = useActiveLink()

const items = [
  { to: '/', label: 'Dashboard', icon: HomeOutline, iconSolid: HomeSolid },
  { to: '/plans', label: 'Plans', icon: DocOutline, iconSolid: DocSolid },
  { to: '/reports', label: 'Reports', icon: ChartOutline, iconSolid: ChartSolid },
  { to: '/settings', label: 'Settings', icon: CogOutline, iconSolid: CogSolid },
]
</script>

<style scoped lang="scss">
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  gap: 4px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 -6px 18px rgba(0, 0, 0, 0.06);

  @media (min-width: 1024px) {
    display: none;
  }
}

.nav-item {
  display: grid;
  place-items: center;
  gap: 2px;
  text-decoration: none;
  padding: 6px 4px;
  border-radius: 12px;
  transition: background 0.18s ease;

  .icon {
    width: 22px;
    height: 22px;
    color: var(--color-text);
  }

  .label {
    font-size: 12px;
    line-height: 1;
    color: var(--color-text);
  }
}

.safe-area {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  pointer-events: none;
}
</style>
