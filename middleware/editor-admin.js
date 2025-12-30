export default defineNuxtRouteMiddleware(async () => {
  const session = useSupabaseSession();
  const token = session.value?.access_token;

  if (!token) {
    return navigateTo('/');
  }

  const data = await $fetch('/api/retrieveUserRole', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data || data.role !== 'admin') {
    return navigateTo('/');
  }
});
