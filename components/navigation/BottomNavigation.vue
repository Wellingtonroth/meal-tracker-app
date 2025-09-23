<template>
  <nav class="bottom-nav" role="navigation" aria-label="Primary">
    <NuxtLink
      v-for="item in navItems"
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
import { navItems } from '@/constants/navigation'

const { isActive } = useActiveLink()
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
  padding: 10px;
  background: var(--color-surface-elevated);
  backdrop-filter: blur(6px);
  border-top: 1px solid var(--color-divider);
  box-shadow: var(--shadow-soft);

  @media (min-width: 1024px) {
    display: none;
  }
}

.nav-item {
  display: grid;
  place-items: center;
  gap: 2px;
  text-decoration: none;
  padding: 8px 6px;
  border-radius: 12px;
  transition:
    background 0.18s ease,
    color 0.18s ease;

  /* define cor-base */
  color: var(--color-icon-muted);

  .icon {
    width: 22px;
    height: 22px;
    color: currentColor;
  }
  .label {
    font-size: 12px;
    line-height: 1;
    color: currentColor;
  }

  &:hover {
    background: var(--color-ghost);
    color: var(--color-primary);
  }

  &.router-link-active,
  &[aria-current='page'] {
    background: var(--color-ghost-strong);
    color: var(--color-primary);
  }
}

.nav-item.router-link-active,
.nav-item[aria-current='page'] {
  background: var(--color-ghost-strong);

  .icon {
    color: var(--color-primary);
  }
  .label {
    color: var(--color-primary);
  }
}

.nav-item.router-link-active,
.nav-item[aria-current='page'] {
  background: var(--color-ghost-strong);
  color: var(--color-primary);

  .label {
    color: var(--color-primary);
  }
}

.safe-area {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  pointer-events: none;
}
</style>
