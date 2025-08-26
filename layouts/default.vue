<template>
  <div>
    <header class="app-container header">
      <strong class="logo">Meal Tracker</strong>

      <nav class="nav">
        <NuxtLink to="/">Início</NuxtLink>
        <NuxtLink to="/plans">Planos</NuxtLink>
        <NuxtLink to="/meals">Refeições</NuxtLink>
        <NuxtLink to="/stats">Estatísticas</NuxtLink>
        <NuxtLink to="/settings">Configurações</NuxtLink>
      </nav>

      <button class="theme-btn" @click="app.toggleTheme()">
        {{ app.theme === 'dark' ? '🌙' : '☀️' }}
      </button>
    </header>

    <main class="app-container main">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const app = useAppStore()
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 0;
}

.logo {
  font-weight: 700;
}

.nav {
  display: flex;
  gap: 0.75rem;

  a {
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    transition: background 0.2s;

    &.router-link-exact-active {
      background: var(--primary);
      color: var(--primary-contrast);

      &:hover {
        background: var(--primary);
      }
    }

    &:hover {
      background: rgba(0, 0, 0, 0.06);
    }
  }
}

.theme-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.main {
  padding: 1rem 0;
}
</style>
