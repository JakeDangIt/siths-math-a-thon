import { requestEndpoint } from '../composables/requestEndpoint';

export default defineNuxtRouteMiddleware(async () => {
  const data = await requestEndpoint('/api/retrieveUserRole');

  if (!data || data.role !== 'admin') {
    return navigateTo('/');
  }
});
