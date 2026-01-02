export const useAnnouncementsStore = defineStore('announcements', () => {
  const announcementsData = ref([]);
  const toastStore = useToastStore();
  const isLoading = ref(false);

  async function retrieveAnnouncements() {
    isLoading.value = true;

    try {
      const result = await requestEndpoint('/api/retreiveAnnouncements');

      if (result.error) {
        toastStore.changeToast(
          'Failed to retrieve announcements',
          result.error
        );
      } else {
        announcementsData.value = result.announcements;
      }
    } catch (error) {
      toastStore.changeToast('Error fetching announcements', error.message);
    }

    isLoading.value = false;
  }

  onMounted(async () => {
    await retrieveAnnouncements();
    isLoading.value = false;
  });

  return { announcementsData, isLoading, retrieveAnnouncements };
});
