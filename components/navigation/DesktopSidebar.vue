<template>
  <aside class="sidebar" aria-label="Primary">
    <strong class="brand">Meal Tracker</strong>

    <nav class="menu">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="row"
        :class="{ active: isActive(item.to) }"
      >
        <component :is="isActive(item.to) ? item.iconSolid : item.icon" class="icon" />
        <span class="label" :class="{ active: isActive(item.to) }">
          {{ item.label }}
        </span>
      </NuxtLink>
    </nav>
  </aside>
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
.sidebar {
  position: sticky;
  top: 0;
  height: 100dvh;
  width: 250px;
  padding: 20px 14px;
  border-right: 1px solid rgba(0,0,0,.06);
  background: #fff;
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
}

.brand {
  font-size: 18px;
  letter-spacing: .2px;
}

.menu {
  display: grid;
  gap: 6px;
}

.row {
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  text-decoration: none;
  border-radius: 12px;
  transition: background .18s ease;

  .icon { 
    width: 22px; 
    height: 22px;
  }

  &:hover { 
    background: rgba(0,0,0,.04); 
  }

  &.active {
    background: rgba(0,0,0,.04); 
  }
}
</style>
