import type { PasswordValidationResult } from '@/types/auth';

/** Lista de senhas comuns (expandida) */
const COMMON_PASSWORDS = [
  'password',
  '12345678',
  '123456789',
  '1234567890',
  'qwerty123',
  'abc123456',
  'password123',
  'admin123',
  'letmein',
  'welcome123',
  'senha123',
  '123456',
  '12345',
  '1234',
  'qwerty',
  'abc123',
  'monkey',
  'dragon',
  'master',
  'sunshine',
  'princess',
  'football',
  'welcome',
  'admin',
  'root',
] as const;

/** Verifica se a senha contém sequências comuns */
function hasSequentialChars(password: string): boolean {
  const sequences = ['123456', 'abcdef', 'qwerty', 'asdfgh', 'zxcvbn'];
  const lowerPassword = password.toLowerCase();
  return sequences.some((seq) => lowerPassword.includes(seq));
}

/** Verifica se a senha tem muitos caracteres repetidos */
function hasRepeatedChars(password: string): boolean {
  // Verifica se tem 3+ caracteres iguais consecutivos
  return /(.)\1{2,}/.test(password);
}

/** Verifica se a senha contém espaços */
function hasSpaces(password: string): boolean {
  return /\s/.test(password);
}

export function usePasswordValidation() {
  const validatePassword = (password: string): PasswordValidationResult => {
    const errors: string[] = [];
    let strengthScore = 0;

    if (password.length < 8) {
      errors.push('A senha deve ter pelo menos 8 caracteres');
    } else {
      strengthScore += 1;
    }

    if (password.length >= 12) {
      strengthScore += 1;
    }
    if (password.length >= 16) {
      strengthScore += 1;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula');
    } else {
      strengthScore += 1;
    }

    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula');
    } else {
      strengthScore += 1;
    }

    if (!/\d/.test(password)) {
      errors.push('A senha deve conter pelo menos um número');
    } else {
      strengthScore += 1;
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial');
    } else {
      strengthScore += 1;
    }

    if (hasSpaces(password)) {
      errors.push('A senha não pode conter espaços');
    }

    const lowerPassword = password.toLowerCase();
    if (COMMON_PASSWORDS.some((common) => lowerPassword.includes(common))) {
      errors.push('A senha é muito comum. Escolha uma senha mais única');
    }

    if (hasSequentialChars(password)) {
      errors.push('A senha não deve conter sequências comuns (ex: 123456, abcdef)');
    }

    if (hasRepeatedChars(password)) {
      errors.push('A senha não deve conter muitos caracteres repetidos');
    }

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (strengthScore >= 6 && password.length >= 12 && errors.length === 0) {
      strength = 'strong';
    } else if (strengthScore >= 4 && errors.length === 0) {
      strength = 'medium';
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength,
    };
  };

  return {
    validatePassword,
  };
}
