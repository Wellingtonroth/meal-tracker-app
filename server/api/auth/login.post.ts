import { isProduction as isProductionEnv } from '../../utils/env';
import type { AuthResponse } from '@/types/auth';

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  try {
    const body = await readBody(event);
    const { email, encryptedPassword, iv } = body;

    if (!email || !encryptedPassword || !iv) {
      throw createError({
        statusCode: 400,
        message: 'Email, senha criptografada e IV são obrigatórios',
      });
    }

    const config = useRuntimeConfig();

    const decryptedPassword = await decryptPassword(encryptedPassword, iv, config);

    const firebaseAuthResponse = await $fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.public.firebase.apiKey}`,
      {
        method: 'POST',
        body: {
          email,
          password: decryptedPassword,
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
    const maxAge = 60 * 60 * 24 * 7;

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
        maxAge: 60 * 60 * 24 * 30,
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

async function decryptPassword(
  encryptedBase64: string,
  ivBase64: string,
  config: any,
): Promise<string> {
  const encryptionKey = `${config.public.firebase.apiKey}_${config.public.firebase.projectId}_encryption_key`;

  const encrypted = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));

  const encoder = new TextEncoder();
  const salt = encoder.encode(encryptionKey).slice(0, 16);

  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(encryptionKey),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey'],
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['decrypt'],
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encrypted,
  );

  return new TextDecoder().decode(decrypted);
}
