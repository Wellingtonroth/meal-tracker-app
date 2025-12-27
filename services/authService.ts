import type { Auth, User as FbUser } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { AuthResponse, UserData } from '@/types/auth';

export class AuthService {
  private getAuthSafe(): Auth | null {
    try {
      const nuxtApp = useNuxtApp();
      const auth = nuxtApp.$firebaseAuth as Auth | undefined | null;
      if (!auth) {
        if (import.meta.dev) {
          console.warn(
            '[Auth] Firebase Auth não está disponível. Verifique as configurações do Firebase.',
          );
        }
        return null;
      }
      return auth;
    } catch (error) {
      if (import.meta.dev) {
        console.error('[Auth] Erro ao acessar Firebase Auth:', error);
      }
      return null;
    }
  }

  initAuthListener(
    onUserChange: (user: UserData | null) => void,
    onError?: (error: Error) => void,
  ): (() => void) | void {
    if (!import.meta.client || typeof window === 'undefined') {
      return;
    }

    // Verificar autenticação via endpoint do servidor (fonte de verdade)
    // Isso funciona porque a autenticação é feita via API REST no backend
    this.checkAuthFromServer(onUserChange, onError);

    // Manter listener do Firebase SDK como fallback (para casos especiais)
    // mas a fonte principal é o endpoint do servidor
    try {
      const auth = this.getAuthSafe();
      if (auth) {
        const unsubscribe = onAuthStateChanged(
          auth,
          (fbUser: FbUser | null) => {
            // O Firebase SDK pode detectar mudanças locais (logout, etc)
            // Mas não detecta login feito via API REST, então confiamos no servidor
            if (!fbUser) {
              // Se o Firebase SDK detecta logout, verificar novamente no servidor
              this.checkAuthFromServer(onUserChange, onError);
            }
          },
          (error) => {
            console.error('[Auth] Erro no listener do Firebase:', error);
            // Em caso de erro, verificar no servidor
            this.checkAuthFromServer(onUserChange, onError);
          },
        );

        return unsubscribe;
      }
    } catch (error: any) {
      console.error('[Auth] Erro ao inicializar listener do Firebase:', error);
      // Se o Firebase SDK falhar, ainda verificamos no servidor
      this.checkAuthFromServer(onUserChange, onError);
    }
  }

  /**
   * Verifica autenticação consultando o endpoint do servidor
   * Esta é a fonte de verdade, pois a autenticação é feita via API REST
   */
  private async checkAuthFromServer(
    onUserChange: (user: UserData | null) => void,
    onError?: (error: Error) => void,
  ): Promise<void> {
    try {
      const response = await $fetch<{ user: UserData | null }>('/api/auth/me', {
        method: 'GET',
      }).catch((error: any) => {
        if (import.meta.dev) {
          console.error('[Auth] Erro ao verificar autenticação no servidor:', error);
        }
        return { user: null };
      });

      onUserChange(response.user);
    } catch (error: any) {
      if (import.meta.dev) {
        console.error('[Auth] Erro ao verificar autenticação:', error);
      }
      onUserChange(null);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Erro ao verificar autenticação'));
      }
    }
  }

  async register(email: string, password: string): Promise<AuthResponse> {
    // Envia senha diretamente ao servidor (protegida pelo HTTPS)
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email,
        password,
      },
    }).catch((error: any) => {
      const statusCode = error?.statusCode || error?.status || error?.response?.status;
      if (import.meta.dev && statusCode && statusCode !== 400) {
        console.error('[Auth Service] Erro inesperado no registro:', {
          status: statusCode,
          message: error?.message || 'Erro desconhecido',
        });
      }
      throw error;
    });

    const authResponse = response as unknown as AuthResponse;
    return authResponse;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Envia senha diretamente ao servidor (protegida pelo HTTPS)
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email,
        password,
      },
    }).catch((error: any) => {
      const statusCode = error?.statusCode || error?.status || error?.response?.status;
      if (import.meta.dev && statusCode && statusCode !== 400) {
        console.error('[Auth Service] Erro inesperado no login:', {
          status: statusCode,
          message: error?.message || 'Erro desconhecido',
        });
      }
      throw error;
    });

    const authResponse = response as unknown as AuthResponse;
    return authResponse;
  }

  async logout(): Promise<void> {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error: any) {
      console.warn('[Auth] Erro ao limpar cookies no backend:', error);
    }

    const auth = this.getAuthSafe();
    if (auth) {
      await signOut(auth);
    }
  }
}

export const authService = new AuthService();
