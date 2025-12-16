import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';

export default function useAuth(store = useAuthStore()) {
  const { user, isLoading, error } = storeToRefs(store);

  if (import.meta.client && typeof window !== 'undefined') {
    store.initAuthListener();
  }

  const waitForAuth = async (): Promise<void> => {
    const authPromise = store.initAuthListener();
    if (authPromise) {
      await authPromise;
    }
  };

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
