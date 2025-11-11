import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/auth';

export default function useAuth(store = useAppStore()) {
  const { user, isLoading, error } = storeToRefs(store);

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
  };
}
