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

    // Validação de força da senha
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw createError({
        statusCode: 400,
        message: `Senha inválida: ${passwordValidation.errors.join(', ')}`,
      });
    }

    const config = useRuntimeConfig();

    // Criar conta no Firebase diretamente
    // A senha vai protegida pelo HTTPS (TLS 1.3)
    const firebaseAuthResponse = await $fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.public.firebase.apiKey}`,
      {
        method: 'POST',
        body: {
          email,
          password,
          returnSecureToken: true,
        },
      },
    ).catch((error: any) => {
      const errorMessage = error?.data?.error?.message || error.message || 'Erro ao criar conta';
      throw createError({
        statusCode: 400,
        message: errorMessage,
      });
    });

    const {
      idToken,
      refreshToken,
      localId,
      email: firebaseEmail,
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
        email: firebaseEmail,
      },
    };
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao criar conta',
    });
  }
});

/**
 * Valida formato de email
 * Implementa RFC 5322 simplificado
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

  if (!emailRegex.test(email)) return false;
  if (email.length > 254) return false;
  if (email.length < 3) return false;

  return true;
}

/**
 * Valida força da senha no servidor
 * Mesmas regras do client-side para consistência
 */
function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }

  if (!/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial');
  }

  if (/\s/.test(password)) {
    errors.push('A senha não pode conter espaços');
  }

  // Lista de senhas comuns (básica)
  const commonPasswords = [
    'password',
    '12345678',
    '123456789',
    'qwerty',
    'abc123',
    'password123',
    'admin123',
    'senha123',
  ];

  const lowerPassword = password.toLowerCase();
  if (commonPasswords.some((common) => lowerPassword.includes(common))) {
    errors.push('A senha é muito comum');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
