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
            :class="{ error: passwordErrors.length > 0 }"
          />
          <div v-if="password.length > 0" class="password-strength">
            <div class="strength-bar">
              <div
                class="strength-fill"
                :class="`strength-${passwordStrength}`"
                :style="{
                  width:
                    passwordStrength === 'weak'
                      ? '33%'
                      : passwordStrength === 'medium'
                        ? '66%'
                        : '100%',
                }"
              />
            </div>
            <span class="strength-text" :class="`strength-${passwordStrength}`">
              Força:
              {{
                passwordStrength === 'weak'
                  ? 'Fraca'
                  : passwordStrength === 'medium'
                    ? 'Média'
                    : 'Forte'
              }}
            </span>
          </div>
          <div v-if="passwordErrors.length > 0" class="password-errors">
            <ul>
              <li v-for="(error, index) in passwordErrors" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
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
import type { PasswordValidationResult } from '@/types/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const isSubmitting = ref(false);
const passwordErrors = ref<string[]>([]);
const passwordStrength = ref<'weak' | 'medium' | 'strong'>('weak');

const { register, error, clearError } = useAuth();
const { validatePassword } = usePasswordValidation();

const errorMessage = computed(() => error.value);

onMounted(() => {
  clearError();
});

watch(password, (newPassword) => {
  if (newPassword.length > 0) {
    const validation: PasswordValidationResult = validatePassword(newPassword);
    passwordErrors.value = validation.errors;
    passwordStrength.value = validation.strength;
  } else {
    passwordErrors.value = [];
    passwordStrength.value = 'weak';
  }
});

async function submit() {
  if (isSubmitting.value) return;

  const validation = validatePassword(password.value);
  if (!validation.isValid) {
    passwordErrors.value = validation.errors;
    return;
  }

  try {
    isSubmitting.value = true;
    clearError();
    passwordErrors.value = [];
    const passwordValue = password.value;
    await register(email.value, passwordValue);

    password.value = '';

    await router.push('/home');
  } catch (err) {
    password.value = '';
    const statusCode = (err as any)?.statusCode || (err as any)?.status;
    if (import.meta.dev && statusCode && statusCode !== 400) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('[Register] Erro inesperado:', errorMessage);
    }
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

        &.error {
          border-color: #ef4444;
        }
      }

      .password-strength {
        margin-top: 0.5rem;
        font-size: 0.75rem;

        .strength-bar {
          width: 100%;
          height: 4px;
          background: var(--color-divider);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.3rem;
        }

        .strength-fill {
          height: 100%;
          transition:
            width 0.3s,
            background-color 0.3s;
          border-radius: 2px;

          &.strength-weak {
            background: var(--color-error);
          }

          &.strength-medium {
            background: var(--color-warning);
          }

          &.strength-strong {
            background: var(--color-success);
          }
        }

        .strength-text {
          font-weight: 500;

          &.strength-weak {
            color: var(--color-error);
          }

          &.strength-medium {
            color: var(--color-warning);
          }

          &.strength-strong {
            color: var(--color-success);
          }
        }
      }

      .password-errors {
        margin-top: 0.5rem;
        font-size: 0.8rem;
        color: #ef4444;

        ul {
          margin: 0;
          padding-left: 1.2rem;
          list-style-type: disc;
        }

        li {
          margin-top: 0.2rem;
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
