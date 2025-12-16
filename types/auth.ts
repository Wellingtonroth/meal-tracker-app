export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthResponse {
  user: {
    uid: string;
    email: string;
  };
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}
