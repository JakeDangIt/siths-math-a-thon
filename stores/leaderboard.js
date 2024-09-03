export const useLeaderboardStore = defineStore("leaderboard", () => {
  const supabase = useSupabaseClient();
  const toastStore = useToastStore();

  const leaderboardData = ref([]);
  const top3 = ref([]);
  const top10 = ref([]);
  const top3Avatars = ref([]);

  const isLoading = ref(true);
  const avatarLoading = ref(true);

  async function retrieveLeaderboard() {
    const { data, error } = await supabase.from("leaderboard").select("*");

    if (error) {
      toastStore.changeToast("Failed to retrieve leaderboard", error.message);
    } else {
      leaderboardData.value = data;
      top3.value = data
        .sort((a, b) => b.correct_answers - a.correct_answers)
        .slice(0, 3);
      top10.value = data
        .sort((a, b) => b.correct_answers - a.correct_answers)
        .slice(3, 10);
    }

    isLoading.value = false;
  }

  async function getUserAvatars() {
    // get names of all files in the bucket
    const { data: files, error: filesError } = await supabase.storage
      .from("avatars")
      .list();

    if (files.length > 0) {
      // check if the top 3 users have avatars
      const fileNames = files.map((file) => file.name.split(".jpeg")[0]);

      top3.value.forEach(async (user) => {
        if (fileNames.includes(user.uid)) {
          const { data: avatar, error: avatarError } = await supabase.storage.from('avatars').download(`${user.uid}.jpeg`);
          if (avatar) {
            top3Avatars.value.push(URL.createObjectURL(avatar));
          }
        }
      });
    }

    avatarLoading.value = false;
  }

  onMounted(async () => {
    await retrieveLeaderboard();
    await getUserAvatars();
  });

  return { leaderboardData, top3, top3Avatars, top10, isLoading, avatarLoading, retrieveLeaderboard };
});
