import type { Auth, User as FbUser } from 'firebase/auth';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { defineStore } from 'pinia';

import { useEncryption } from '@/composables/useEncryption';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export const useAppStore = defineStore('auth', {
  state: () => ({
    user: null as UserData | null,
    isLoading: true as boolean,
    error: null as string | null,
    _listenerInitialized: false as boolean,
    _authStatePromise: null as Promise<void> | null,
  }),

  actions: {
    /** Pega o Auth do plugin com segurança */
    _getAuthSafe(): Auth {
      const nuxtApp = useNuxtApp();
      const auth = nuxtApp.$firebaseAuth as Auth | undefined;
      if (!auth) throw new Error('[Auth] Firebase Auth não está disponível');
      return auth;
    },

    /** Inicia o listener de auth (client-only) - retorna Promise que resolve quando estado inicial é determinado */
    initAuthListener(): Promise<void> | void {
      if (!import.meta.client || typeof window === 'undefined') {
        this.isLoading = false;
        return;
      }
      if (this._listenerInitialized) {
        return this._authStatePromise || Promise.resolve();
      }
      this._listenerInitialized = true;

      try {
        const auth = this._getAuthSafe();

        // Retorna Promise que resolve quando o estado inicial é determinado
        this._authStatePromise = new Promise<void>((resolve) => {
          const unsubscribe = onAuthStateChanged(
            auth,
            (fbUser: FbUser | null) => {
              if (fbUser) {
                this.user = {
                  uid: fbUser.uid,
                  email: fbUser.email,
                  displayName: fbUser.displayName,
                };
              } else {
                this.user = null;
              }
              this.isLoading = false;
              resolve();
            },
            (error) => {
              console.error('[Auth] Erro no listener:', error);
              this.error = error.message;
              this.isLoading = false;
              resolve();
            },
          );

          // Armazena unsubscribe para limpeza futura se necessário
          if (import.meta.client) {
            (this as any)._unsubscribe = unsubscribe;
          }
        });

        return this._authStatePromise;
      } catch (error: any) {
        console.error('[Auth] Erro ao inicializar listener:', error);
        this.error = error?.message || 'Erro ao inicializar autenticação';
        this.isLoading = false;
        return Promise.resolve();
      }
    },

    clearError() {
      this.error = null;
    },

    /** Registro via backend (com criptografia local) */
    async register(email: string, password: string): Promise<void> {
      try {
        this.clearError();
        this.isLoading = true;

        const { encryptPassword, getEncryptionKey } = useEncryption();
        const encryptionKey = getEncryptionKey();
        const { encrypted, iv } = await encryptPassword(password, encryptionKey);

        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            email,
            encryptedPassword: encrypted,
            iv,
          },
        });

        const authResponse = response as unknown as {
          idToken: string;
          refreshToken?: string;
          user: { uid: string; email: string };
        };

        if (authResponse.idToken) {
          // Salva tokens no sessionStorage primeiro
          if (import.meta.client && typeof window !== 'undefined') {
            sessionStorage.setItem('firebase_id_token', authResponse.idToken);
            if (authResponse.refreshToken) {
              sessionStorage.setItem('firebase_refresh_token', authResponse.refreshToken);
            }
          }

          // Sincroniza com Firebase Auth do cliente para que onAuthStateChanged funcione
          if (import.meta.client && typeof window !== 'undefined') {
            try {
              const auth = this._getAuthSafe();
              // Usa a mesma senha para autenticar no cliente (já validada no backend)
              // O onAuthStateChanged vai atualizar this.user e this.isLoading automaticamente
              await signInWithEmailAndPassword(auth, email, password);
            } catch (syncError: any) {
              // Se falhar a sincronização, mantém o estado manual
              console.warn('[Auth] Falha ao sincronizar com Firebase Auth:', syncError);
              this.user = {
                uid: authResponse.user.uid,
                email: authResponse.user.email,
                displayName: null,
              };
              this.isLoading = false;
            }
          } else {
            // Fallback para SSR
            this.user = {
              uid: authResponse.user.uid,
              email: authResponse.user.email,
              displayName: null,
            };
            this.isLoading = false;
          }
        }
      } catch (err: any) {
        const errorMessage = err?.data?.message || err?.message || 'Erro ao criar conta';
        this.error = errorMessage;
        this.isLoading = false;
        throw err;
      }
    },

    /** Login via backend (com criptografia local) */
    async login(email: string, password: string): Promise<void> {
      try {
        this.clearError();
        this.isLoading = true;

        const { encryptPassword, getEncryptionKey } = useEncryption();
        const encryptionKey = getEncryptionKey();
        const { encrypted, iv } = await encryptPassword(password, encryptionKey);

        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            email,
            encryptedPassword: encrypted,
            iv,
          },
        });

        const authResponse = response as unknown as {
          idToken: string;
          refreshToken?: string;
          user: { uid: string; email: string };
        };

        if (authResponse.idToken) {
          // Salva tokens no sessionStorage primeiro
          if (import.meta.client && typeof window !== 'undefined') {
            sessionStorage.setItem('firebase_id_token', authResponse.idToken);
            if (authResponse.refreshToken) {
              sessionStorage.setItem('firebase_refresh_token', authResponse.refreshToken);
            }
          }

          // Sincroniza com Firebase Auth do cliente para que onAuthStateChanged funcione
          if (import.meta.client && typeof window !== 'undefined') {
            try {
              const auth = this._getAuthSafe();
              // Usa a mesma senha para autenticar no cliente (já validada no backend)
              // O onAuthStateChanged vai atualizar this.user e this.isLoading automaticamente
              await signInWithEmailAndPassword(auth, email, password);
            } catch (syncError: any) {
              // Se falhar a sincronização, mantém o estado manual
              console.warn('[Auth] Falha ao sincronizar com Firebase Auth:', syncError);
              this.user = {
                uid: authResponse.user.uid,
                email: authResponse.user.email,
                displayName: null,
              };
              this.isLoading = false;
            }
          } else {
            // Fallback para SSR
            this.user = {
              uid: authResponse.user.uid,
              email: authResponse.user.email,
              displayName: null,
            };
            this.isLoading = false;
          }
        }
      } catch (err: any) {
        const errorMessage = err?.data?.message || err?.message || 'Erro ao fazer login';
        this.error = errorMessage;
        this.isLoading = false;
        throw err;
      }
    },

    /** Logout (limpa tokens + signOut) */
    async logout(): Promise<void> {
      try {
        this.clearError();

        if (import.meta.client && typeof window !== 'undefined') {
          sessionStorage.removeItem('firebase_id_token');
          sessionStorage.removeItem('firebase_refresh_token');
        }

        await signOut(this._getAuthSafe());
        this.user = null;
      } catch (err: any) {
        this.error = err?.message || 'Erro ao fazer logout';
        throw err;
      }
    },
  },
});
