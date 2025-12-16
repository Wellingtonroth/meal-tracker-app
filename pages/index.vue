<template>
  <div class="landing-page">
    <h1>Landing Page</h1>
    <p>Bem-vindo ao Meal Tracker!</p>
    <div class="actions">
      <NuxtLink to="/login" class="btn btn-primary">Entrar</NuxtLink>
      <NuxtLink to="/register" class="btn btn-secondary">Criar Conta</NuxtLink>
      <NuxtLink to="/paywall" class="btn btn-outline">Ver Planos</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'empty',
});
</script>

<style scoped lang="scss">
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--color-background);
  color: var(--color-text);
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--color-primary);
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: var(--color-text-muted);
  }

  .actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s;

    &.btn-primary {
      background: var(--color-primary);
      color: var(--color-on-primary);

      &:hover {
        opacity: 0.9;
      }
    }

    &.btn-secondary {
      background: var(--color-surface-elevated);
      color: var(--color-text);
      border: 1px solid var(--color-divider);

      &:hover {
        background: var(--color-ghost);
      }
    }

    &.btn-outline {
      background: transparent;
      color: var(--color-primary);
      border: 2px solid var(--color-primary);

      &:hover {
        background: var(--color-primary);
        color: var(--color-on-primary);
      }
    }
  }
}
</style>
