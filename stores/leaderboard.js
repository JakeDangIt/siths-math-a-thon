export const useLeaderboardStore = defineStore("leaderboard", () => {
    const supabase = useSupabaseClient();
    const toastStore = useToastStore();

    const leaderboardData = ref([]);
    const isLoading = ref(true);


    return {  };
  });
  