export const useArchiveStore = defineStore("archive", () => {
  const toastStore = useToastStore();
  const supabase = useSupabaseClient();

  const isLoading = ref(true);
  const files2023 = ref([]);
  const files2024 = ref([]);

  onMounted(async () => {
    const { data: archive, error } = await supabase.storage
      .from("archive")
      .list();

    if (error) throw error;

    files2023.value = archive.filter((file) => file.name.startsWith("2023"));
    files2024.value = archive.filter((file) => file.name.startsWith("2024"));
    if (error) {
      toastStore.changeToast("Error getting archive", error.message);
    } else {
      isLoading.value = false;
    }
  });

  return { files2023, files2024, isLoading };
});
