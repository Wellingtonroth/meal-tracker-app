<template>
  <div class="auth-debug">
    <h1>Auth Test</h1>
    <p v-if="user">
      Logado: <strong>{{ user.email }}</strong> (uid: {{ user.uid }})
    </p>
    <p v-else>Não logado</p>

    <div class="actions">
      <NuxtLink to="/register">/register</NuxtLink>
      <NuxtLink to="/login">/login</NuxtLink>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth();
</script>

<style scoped lang="scss">
.auth-debug {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--color-background);
  color: var(--color-text);
  text-align: center;

  h1 {
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }
  .actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    a,
    button {
      padding: 0.5rem 0.9rem;
      border-radius: 6px;
      border: 1px solid var(--color-divider);
      background: var(--color-surface-elevated);
      color: var(--color-text);
      cursor: pointer;
    }
    button {
      background: var(--color-primary);
      color: var(--color-on-primary);
      border: none;
    }
  }
}
</style>
