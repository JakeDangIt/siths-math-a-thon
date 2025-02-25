export const useArchiveStore = defineStore('archive', () => {
  const toastStore = useToastStore();
  const supabase = useSupabaseClient();

  // archive data and loading state
  const files2023 = ref([]);
  const files2024 = ref([]);
  const files2025 = ref([]);
  const isLoading = ref(true);

  onMounted(async () => {
    // get archive files
    const { data: archive, error } = await supabase.storage
      .from('archive')
      .list();

    files2023.value = archive.filter((file) => file.name.startsWith('2023'));
    files2024.value = archive.filter((file) => file.name.startsWith('2024'));
    files2025.value = archive.filter((file) => file.name.startsWith('2025'));
    if (error) {
      toastStore.changeToast('Error getting archive', error.message);
    } else {
      isLoading.value = false;
    }
  });

  return { files2023, files2024, files2025, isLoading };
});
