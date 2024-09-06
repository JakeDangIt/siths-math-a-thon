import { routes } from "../utils/routes.js";
export const useRoutesStore = defineStore("routes", () => {
  const router = useRouter();

  const visitedRoutes = ref([]);

  function addRoute() {
    visitedRoutes.value.push(router.currentRoute.value.path);
  }

  async function redirectToLast() {
    await navigateTo(visitedRoutes.value.filter((route) => route !== '/auth/login' && route !== '/auth/signup').at(-1))
  }

  onMounted(() => {
    watch(
      router.currentRoute,
      () => {
        addRoute();
      },
      { immediate: true }
    );
  });

  return { visitedRoutes, redirectToLast };
});
