export const useLeaderboardStore = defineStore("leaderboard", () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const toastStore = useToastStore();

  const leaderboardData = ref([]);
  const top10 = ref([]);
  const top3Avatars = ref([]);

  const userAnswers = ref([]);
  const userPlace = ref(0);

  const isLoading = ref(true);
  const avatarLoading = ref(true);
  const answersLoading = ref(true);

  const user_id = computed(() => user.value?.id)
  const numberOfCorrect = computed(() => leaderboardData.value.find((user) => user.uid == user_id.value)?.correct_answers)
  const numberOfAnswered = computed(() => userAnswers.value.reduce((sum, week) => sum + week.correct_answers.length, 0));

  async function retrieveLeaderboard() {
    const { data, error } = await supabase.from("leaderboard").select("*");

    if (error) {
      toastStore.changeToast("Failed to retrieve leaderboard", error.message);
    } else {
      leaderboardData.value = data;
      top10.value = data
        .sort((a, b) => b.correct_answers - a.correct_answers)
        .slice(0, 10);

      if (user.value) {
        const userId = user.value.id;
        const userIndex = top10.value.findIndex((user) => user.uid == userId);
        userPlace.value = userIndex + 1;
      }
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

      top10.value.slice(0, 3).forEach(async (user) => {
        if (fileNames.includes(user.uid)) {
          const { data: avatar, error: avatarError } = await supabase.storage
            .from("avatars")
            .download(`${user.uid}.jpeg`);
          if (avatar) {
            top3Avatars.value.push({
              name: user.user_name,
              image: URL.createObjectURL(avatar),
            });
          }
        }
      });
    }

    avatarLoading.value = false;
  }

  async function getUserAnswers() {
    const { data, error } = await supabase
      .from("submitted_answers")
      .select("correct_answers, uid")
      .eq("uid", user.value.id);

    if (error) {
      toastStore.changeToast("Failed to retrieve user answers", error.message);
      return
    }
    if (data.length === 0) {
      userAnswers.value = [null];
    }
    userAnswers.value = data;
    answersLoading.value = false;
  }

  onMounted(async () => {
    await retrieveLeaderboard();
    await getUserAvatars();
    if (user.value) {
      await getUserAnswers();
    }

    watch(
      () => user.value,
      async (newUser) => {
        if (newUser) {
          await getUserAnswers();
          const userId = user.value?.id;
          const userIndex = top10.value.findIndex(
            (user) => user.uid == userId
          );
          userPlace.value = userIndex + 1;
        }
      },
      { immediate: true }
    );
  });

  return {
    leaderboardData,
    top3Avatars,
    top10,
    userAnswers,
    userPlace,
    isLoading,
    avatarLoading,
    answersLoading,
    numberOfCorrect,
    numberOfAnswered,
    retrieveLeaderboard,
  };
});
