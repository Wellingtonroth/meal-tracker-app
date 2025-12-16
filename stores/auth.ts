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
        authService.initAuthListener(
          (user) => {
            this.user = user;
            this.isLoading = false;
            resolve();
          },
          (error) => {
            this.error = error.message;
            this.isLoading = false;
            resolve();
          },
        );
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
      } catch (err: any) {
        this.error = err?.message || 'Erro ao fazer logout';
        throw err;
      }
    },
  },
});
