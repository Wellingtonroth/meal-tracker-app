export default defineNuxtRouteMiddleware(async (to, _from) => {
  if (!to.path.startsWith('/app/')) {
    return;
  }

  const { user, waitForAuth } = useAuth();

  await waitForAuth();

  if (!user.value) {
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
