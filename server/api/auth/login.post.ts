import { isProduction as isProductionEnv } from '../../utils/env';
import type { AuthResponse } from '@/types/auth';

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    // Validação básica
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email e senha são obrigatórios',
      });
    }

    // Validação de email
    if (!isValidEmail(email)) {
      throw createError({
        statusCode: 400,
        message: 'Email inválido',
      });
    }

    const config = useRuntimeConfig();

    // Autenticar com Firebase diretamente
    // A senha vai protegida pelo HTTPS (TLS 1.3)
    const firebaseAuthResponse = await $fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.public.firebase.apiKey}`,
      {
        method: 'POST',
        body: {
          email,
          password,
          returnSecureToken: true,
        },
      },
    ).catch((error: any) => {
      const errorMessage = error?.data?.error?.message || error.message || 'Erro ao fazer login';
      throw createError({
        statusCode: 400,
        message: errorMessage,
      });
    });

    const {
      idToken,
      refreshToken,
      localId,
      email: userEmail,
    } = firebaseAuthResponse as {
      idToken: string;
      refreshToken: string;
      localId: string;
      email: string;
    };

    const isProduction = isProductionEnv();
    const maxAge = 60 * 60 * 24 * 7; // 7 dias

    // Armazenar tokens em cookies httpOnly (seguro!)
    setCookie(event, 'firebase_id_token', idToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    if (refreshToken) {
      setCookie(event, 'firebase_refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
      });
    }

    const response: AuthResponse = {
      user: {
        uid: localId,
        email: userEmail,
      },
    };
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao fazer login',
    });
  }
});

/**
 * Valida formato de email
 * Implementa RFC 5322 simplificado
 */
function isValidEmail(email: string): boolean {
  // Regex simples mas efetivo para emails
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

  // Validações adicionais
  if (!emailRegex.test(email)) return false;
  if (email.length > 254) return false; // RFC 5321
  if (email.length < 3) return false;

  return true;
}
