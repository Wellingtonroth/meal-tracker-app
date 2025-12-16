import type { Auth, User as FbUser } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEncryption } from '@/composables/useEncryption';
import type { AuthResponse, UserData } from '@/types/auth';

export class AuthService {
  private getAuthSafe(): Auth | null {
    const nuxtApp = useNuxtApp();
    const auth = nuxtApp.$firebaseAuth as Auth | undefined | null;
    if (!auth) {
      console.warn(
        '[Auth] Firebase Auth não está disponível. Verifique as configurações do Firebase.',
      );
      return null;
    }
    return auth;
  }

  initAuthListener(
    onUserChange: (user: UserData | null) => void,
    onError?: (error: Error) => void,
  ): (() => void) | void {
    if (!import.meta.client || typeof window === 'undefined') {
      return;
    }

    try {
      const auth = this.getAuthSafe();

      if (!auth) {
        // Se o Firebase não está disponível, apenas retorna null como usuário
        onUserChange(null);
        if (onError) {
          onError(new Error('Firebase não está configurado. Verifique as variáveis de ambiente.'));
        }
        return;
      }

      const unsubscribe = onAuthStateChanged(
        auth,
        (fbUser: FbUser | null) => {
          if (fbUser) {
            onUserChange({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName,
            });
          } else {
            onUserChange(null);
          }
        },
        (error) => {
          console.error('[Auth] Erro no listener:', error);
          if (onError) {
            onError(error);
          }
        },
      );

      return unsubscribe;
    } catch (error: any) {
      console.error('[Auth] Erro ao inicializar listener:', error);
      if (onError) {
        onError(error);
      }
    }
  }

  async register(email: string, password: string): Promise<AuthResponse> {
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
