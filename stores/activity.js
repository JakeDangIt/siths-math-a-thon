export const useActivityStore = defineStore('activity', () => {
  const activityData = ref([]);
  const isLoading = ref(true);

  async function getActivity() {
    const ACTIVITY_QUERY = groq`*[_type == "activity"]`;
    const { data: activity } = await useSanityQuery(ACTIVITY_QUERY);

    activityData.value = activity.value.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }

  onMounted(async () => {
    await getActivity();
    isLoading.value = false;
  });

  return { activityData, isLoading, getActivity };
});
