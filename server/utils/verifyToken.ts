/**
 * Verifica um Firebase ID token usando a API REST do Firebase
 * Retorna os dados do token decodificado ou null se inválido
 */
export async function verifyIdToken(idToken: string): Promise<{
  uid: string;
  email: string | null;
  email_verified?: boolean;
} | null> {
  const config = useRuntimeConfig();

  try {
    // Verifica o token usando a API REST do Firebase
    const response = (await $fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${config.public.firebase.apiKey}`,
      {
        method: 'POST',
        body: {
          idToken,
        },
      },
    ).catch(() => null)) as {
      users?: Array<{
        localId?: string;
        uid?: string;
        email?: string;
        emailVerified?: boolean;
      }>;
    } | null;

    if (!response || !response.users || response.users.length === 0) {
      return null;
    }

    const user = response.users[0];
    return {
      uid: user.localId || user.uid || '',
      email: user.email || null,
      email_verified: user.emailVerified || false,
    };
  } catch (error) {
    if (import.meta.dev) {
      console.error('[Verify Token] Erro ao verificar token:', error);
    }
    return null;
  }
}
