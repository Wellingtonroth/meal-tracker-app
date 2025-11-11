import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware(async (to, _from) => {
  if (import.meta.server) {
    return;
  }

  const authStore = useAppStore();
  const authPromise = authStore.initAuthListener();

  // Aguarda o estado inicial ser determinado
  if (authPromise) {
    await authPromise;
  }

  const { user } = storeToRefs(authStore);

  if (!user.value) {
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
