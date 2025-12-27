import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';

export default function useAuth(store = useAuthStore()) {
  const { user, isLoading, error } = storeToRefs(store);

  const waitForAuth = async (): Promise<void> => {
    if (import.meta.client && typeof window !== 'undefined') {
      await store.initAuthListener();
    }
  };

  // Inicializar o listener automaticamente no cliente
  if (import.meta.client && typeof window !== 'undefined') {
    store.initAuthListener();
  }

  return {
    user,
    isLoading,
    error,
    register: store.register,
    login: store.login,
    logout: store.logout,
    clearError: store.clearError,
    waitForAuth,
  };
}
