export const useLeaderboardStore = defineStore("leaderboard", () => {
    const supabase = useSupabaseClient();
    const toastStore = useToastStore();

    const leaderboardData = ref([]);
    const top3 = ref([]);
    const isLoading = ref(true);

    async function retrieveLeaderboard() {
        const { data, error } = await supabase.from("leaderboard").select("*");

        if (error) {
            toastStore.changeToast("Failed to retrieve leaderboard", error.message);
        }
        else {
            leaderboardData.value = data;
            top3.value = data.sort((a, b) => b.correct_answers - a.correct_answers).slice(0, 3);
        }

        isLoading.value = false;
    }

    onMounted(() => {
      retrieveLeaderboard();
    })

    return { leaderboardData, top3, isLoading, retrieveLeaderboard };
  });
  