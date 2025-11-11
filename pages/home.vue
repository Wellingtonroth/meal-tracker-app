<template>
  <div class="home">
    <h1>Bem-vindo!</h1>
    <p v-if="user">Você está logado como {{ user.email }} ✅</p>
    <p v-else>Carregando...</p>
    <button @click="logout">Sair</button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { logout, user } = useAuth();
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--color-background);
  color: var(--color-text);

  h1 {
    color: var(--color-primary);
    margin-bottom: 1rem;
  }

  button {
    background: var(--color-primary);
    color: var(--color-on-primary);
    border: none;
    border-radius: 6px;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s;

    &:hover {
      background: var(--color-primary);
    }
  }
}
</style>
