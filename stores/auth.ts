import { defineStore } from 'pinia';
import { authService } from '@/services/authService';
import type { UserData } from '@/types/auth';

let listenerInitialized = false;
let authStatePromise: Promise<void> | null = null;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserData | null,
    isLoading: true as boolean,
    error: null as string | null,
  }),

  actions: {
    async initAuthListener(): Promise<void> {
      if (!import.meta.client || typeof window === 'undefined') {
        this.isLoading = false;
        return;
      }
      if (listenerInitialized) {
        return authStatePromise || Promise.resolve();
      }
      listenerInitialized = true;

      authStatePromise = new Promise<void>((resolve) => {
        let resolved = false;

        // Timeout de segurança: se o listener não responder em 5 segundos, considerar como não autenticado
        const timeoutId = setTimeout(() => {
          if (!resolved) {
            if (import.meta.dev) {
              console.warn(
                '[Auth Store] Timeout ao aguardar estado de autenticação. Considerando como não autenticado.',
              );
            }
            this.isLoading = false;
            resolved = true;
            resolve();
          }
        }, 5000);

        const unsubscribe = authService.initAuthListener(
          (user) => {
            if (import.meta.dev) {
              console.warn(
                '[Auth Store] Estado do usuário atualizado:',
                user ? user.email : 'null',
              );
            }
            if (!resolved) {
              clearTimeout(timeoutId);
              this.user = user;
              this.isLoading = false;
              resolved = true;
              resolve();
            }
          },
          (error) => {
            console.error('[Auth Store] Erro no listener:', error);
            if (!resolved) {
              clearTimeout(timeoutId);
              this.error = error.message;
              this.isLoading = false;
              resolved = true;
              resolve();
            }
          },
        );

        // Se o listener não retornou uma função de unsubscribe, significa que houve um problema
        if (!unsubscribe && import.meta.dev) {
          console.warn(
            '[Auth Store] Listener não retornou função de unsubscribe. Verifique a configuração do Firebase.',
          );
          clearTimeout(timeoutId);
          if (!resolved) {
            this.isLoading = false;
            resolved = true;
            resolve();
          }
        }
      });

      return authStatePromise;
    },

    clearError() {
      this.error = null;
    },

    async register(email: string, password: string): Promise<void> {
      try {
        this.clearError();
        this.isLoading = true;

        const authResponse = await authService.register(email, password);

        this.user = {
          uid: authResponse.user.uid,
          email: authResponse.user.email,
          displayName: null,
        };
        this.isLoading = false;
      } catch (err: any) {
        const errorMessage = err?.data?.message || err?.message || 'Erro ao criar conta';
        this.error = errorMessage;
        this.isLoading = false;
        throw err;
      }
    },

    async login(email: string, password: string): Promise<void> {
      try {
        this.clearError();
        this.isLoading = true;

        const authResponse = await authService.login(email, password);

        this.user = {
          uid: authResponse.user.uid,
          email: authResponse.user.email,
          displayName: null,
        };
        this.isLoading = false;
      } catch (err: any) {
        const errorMessage = err?.data?.message || err?.message || 'Erro ao fazer login';
        this.error = errorMessage;
        this.isLoading = false;
        throw err;
      }
    },

    async logout(): Promise<void> {
      try {
        this.clearError();
        await authService.logout();
        this.user = null;

        // Redirecionar para login após logout bem-sucedido
        // Usar window.location para garantir redirecionamento mesmo se navigateTo falhar
        if (import.meta.client && typeof window !== 'undefined') {
          try {
            await navigateTo('/login');
          } catch {
            // Fallback: usar window.location se navigateTo falhar
            window.location.href = '/login';
          }
        }
      } catch (err: any) {
        this.error = err?.message || 'Erro ao fazer logout';
        throw err;
      }
    },
  },
});
