import type { UserData } from '@/types/auth';
import { verifyIdToken } from '../../utils/verifyToken';

/**
 * Endpoint para obter o usuário atual autenticado
 * Verifica o cookie firebase_id_token e retorna os dados do usuário
 */
export default defineEventHandler(async (event): Promise<{ user: UserData | null }> => {
  try {
    const token = getCookie(event, 'firebase_id_token');

    if (!token) {
      return { user: null };
    }

    const decodedToken = await verifyIdToken(token);

    if (!decodedToken) {
      // Token inválido ou expirado, limpar cookie
      deleteCookie(event, 'firebase_id_token', {
        httpOnly: true,
        secure: isProduction(),
        sameSite: 'lax',
        path: '/',
      });
      return { user: null };
    }

    return {
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: null,
      },
    };
  } catch (error: any) {
    if (import.meta.dev) {
      console.error('[Auth Me] Erro ao verificar autenticação:', error);
    }
    return { user: null };
  }
});

function isProduction(): boolean {
  return process.env.NUXT_PUBLIC_ENV === 'production';
}
