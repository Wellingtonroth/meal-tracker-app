<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Criar conta</h1>

      <form @submit.prevent="submit">
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <label>
          E-mail
          <input
            v-model="email"
            type="email"
            required
            :disabled="isSubmitting"
            autocomplete="email"
          />
        </label>

        <label>
          Senha
          <input
            v-model="password"
            type="password"
            required
            :disabled="isSubmitting"
            autocomplete="new-password"
          />
        </label>

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Registrando...' : 'Registrar' }}
        </button>
      </form>

      <p class="switch-link">
        Já tem conta?
        <NuxtLink to="/login">Entrar</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { register, error, clearError } = useAuth();
const router = useRouter();
const email = ref('');
const password = ref('');
const isSubmitting = ref(false);
const errorMessage = computed(() => error.value);

onMounted(() => {
  clearError();
});

async function submit() {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    clearError();
    await register(email.value, password.value);
    await router.push('/home');
  } catch (err) {
    console.error('Erro no registro:', err);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped lang="scss">
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--color-background);
}

.auth-card {
  background: var(--color-surface-elevated);
  box-shadow: var(--shadow-soft);
  border-radius: 10px;
  padding: 2rem;
  width: 100%;
  max-width: 380px;

  h1 {
    text-align: center;
    color: var(--color-primary);
    margin-bottom: 1.5rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
      padding: 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      text-align: center;
    }

    label {
      display: flex;
      flex-direction: column;
      font-size: 0.9rem;
      color: var(--color-text);

      input {
        margin-top: 0.4rem;
        padding: 0.6rem;
        border-radius: 6px;
        border: 1px solid var(--color-divider);
        background: var(--color-surface);
        color: var(--color-text);
        transition: border-color 0.2s;

        &:focus {
          border-color: var(--color-primary);
          outline: none;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }

    button {
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: 0.7rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition:
        background 0.2s,
        opacity 0.2s;

      &:hover:not(:disabled) {
        opacity: 0.9;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }

  .switch-link {
    margin-top: 1rem;
    text-align: center;
    color: var(--color-text-muted);

    a {
      color: var(--color-primary);
      text-decoration: none;
      margin-left: 0.2rem;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
