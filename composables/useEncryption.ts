export function useEncryption() {
  async function deriveKey(password: string, salt: ArrayBuffer): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey'],
    );

    return crypto.subtle.deriveKey(
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
      ['encrypt'],
    );
  }

  async function encryptPassword(
    password: string,
    encryptionKey: string,
  ): Promise<{ encrypted: string; iv: string }> {
    if (!password) throw new Error('Senha não pode ser vazia');

    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const saltEncoder = new TextEncoder();
    const saltBytes = saltEncoder.encode(encryptionKey).slice(0, 16);
    const salt = saltBytes.buffer.slice(
      saltBytes.byteOffset,
      saltBytes.byteOffset + saltBytes.byteLength,
    );

    const key = await deriveKey(encryptionKey, salt);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data,
    );

    const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    const ivBase64 = btoa(String.fromCharCode(...iv));

    return {
      encrypted: encryptedBase64,
      iv: ivBase64,
    };
  }

  function getEncryptionKey(): string {
    const config = useRuntimeConfig();
    // ⚠️ SEGURANÇA: A chave de criptografia é derivada de valores públicos
    // Isso significa que a criptografia client-side não adiciona segurança real
    // É apenas uma camada de ofuscação durante a transmissão
    //
    // RECOMENDAÇÃO: Em produção, use uma chave privada via variável de ambiente:
    // const encryptionKey = config.private.encryptionKey || config.public.firebase.apiKey;
    //
    // NOTA: A segurança real vem do HTTPS e da validação no backend
    return `${config.public.firebase.apiKey}_${config.public.firebase.projectId}_encryption_key`;
  }

  return {
    encryptPassword,
    getEncryptionKey,
  };
}
