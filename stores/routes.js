export const useRoutesStore = defineStore('routes', () => {
  // track the routes for when you login, it goes to the last route that wasn't login or signup
  const router = useRouter();
  const visitedRoutes = ref([]);

  // put the route in the array
  function addRoute() {
    visitedRoutes.value.push(router.currentRoute.value.path);
  }

  // go to the last one that wasn't login or signup
  async function redirectToLast() {
    await navigateTo(
      visitedRoutes.value
        .filter((route) => route !== '/auth/login' && route !== '/auth/signup')
        .at(-1)
    );
  }

  // when the route changes, add the route to the array
  watch(
    router.currentRoute,
    () => {
      addRoute();
    },
    { immediate: true }
  );

  return { visitedRoutes, redirectToLast };
});
