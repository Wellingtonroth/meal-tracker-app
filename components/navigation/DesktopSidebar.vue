<template>
  <aside class="sidebar" aria-label="Primary">
    <strong class="brand">{{ $t('app.name') }}</strong>

    <nav class="menu">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="localePath(item.to)"
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
import { getNavItems } from '@/constants/navigation';

const navItems = getNavItems();

const route = useRoute();
const localePath = useLocalePath();

const isActive = (rawTo: string) => {
  const loc = localePath(rawTo);
  const root = localePath('/');

  if (loc === root) return route.path === root;

  return route.path === loc || route.path.startsWith(`${loc}/`);
};
</script>

<style scoped lang="scss">
.sidebar {
  position: sticky;
  top: 0;
  height: 100dvh;
  width: 250px;
  padding: 20px 14px;
  border-right: 1px solid var(--color-divider);
  background: var(--color-surface);
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
}

.brand {
  font-size: 18px;
  color: var(--color-text);
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
  border-radius: 8px;
  transition:
    background 0.18s ease,
    color 0.18s ease;

  color: var(--color-text);
  font-weight: 500;

  .icon {
    width: 22px;
    height: 22px;
  }

  &:hover {
    background: var(--color-ghost);
    color: var(--color-primary);
  }

  &.active {
    background: var(--color-ghost-strong);
    color: var(--color-primary);
  }
}
</style>
