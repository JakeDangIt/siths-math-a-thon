export const useLeaderboardStore = defineStore('leaderboard', () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const toastStore = useToastStore();

  // leaderboard data (only id and correct answers, sorted by correct answers)
  const leaderboardData = ref([]);
  // top 10 (only uid, name, and correct answers)
  const top10 = ref([]);
  // top 3 user avatars (name and image)
  const top3Avatars = ref([]);

  const userAnswers = ref([]);
  const userPlace = ref(0);

  const isLoading = ref(true);
  const avatarLoading = ref(true);
  const answersLoading = ref(true);
  const placeLoading = ref(true);

  const user_id = computed(() => user.value?.id);

  // these two is your number of correct answers and number of answered questions
  const numberOfCorrect = computed(() =>
    userAnswers.value.reduce(
      (sum, week) =>
        sum + week.correct_answers.filter((answer) => answer.isCorrect).length,
      0
    )
  );
  const numberOfAnswered = computed(() =>
    userAnswers.value.reduce(
      (sum, week) => sum + week.correct_answers.length,
      0
    )
  );

  // get the data from the top 10
  async function retrieveLeaderboard() {
    isLoading.value = true;

    try {
      const response = await fetch('/api/retreiveLeaderboard');
      const result = await response.json();

      if (result.error) {
        toastStore.changeToast('Failed to retrieve leaderboard', result.error);
      } else {
        leaderboardData.value = result.leaderboard;
        top10.value = result.leaderboard.slice(0, 10);
      }
    } catch (error) {
      toastStore.changeToast('Error fetching leaderboard', error.message);
    }

    isLoading.value = false;
  }

  async function getUserPlace() {
    placeLoading.value = true;

    if (!user_id.value) {
      toastStore.changeToast('User not logged in');
      placeLoading.value = false;
      return;
    }

    try {
      const response = await fetch(`/api/userPlace?uid=${user_id.value}`);
      const result = await response.json();

      if (result.error) {
        toastStore.changeToast('Failed to retrieve user place', result.error);
      } else {
        userPlace.value = result.place;
      }
    } catch (error) {
      toastStore.changeToast('Error fetching user place', error.message);
    }

    placeLoading.value = false;
  }

  // get the top 3 user avatars
  async function getTop3UserAvatars() {
    avatarLoading.value = true;

    const response = await fetch('/api/top3Avatars');
    const result = await response.json();

    if (result.error) {
      console.error('Error fetching avatars:', result.error);
      avatarLoading.value = false;
      return;
    }

    top3Avatars.value = result;
    avatarLoading.value = false;
  }

  // get your answers
  async function getUserAnswers() {
    const { data, error } = await supabase
      .from('submitted_answers')
      .select('correct_answers, uid, created_at')
      .eq('uid', user.value.id);

    if (error) {
      toastStore.changeToast('Failed to retrieve user answers', error.message);
      return;
    }
    if (data.length === 0) {
      userAnswers.value = [null];
    }
    userAnswers.value = data;
    answersLoading.value = false;
  }

  // if you log in and out, update the user answers and place
  watch(
    () => user.value,
    async (newUser) => {
      if (newUser) {
        await getUserAnswers();
        await getUserPlace();
      }
    }
  );

  onMounted(async () => {
    // get the leaderboard and avatars
    await retrieveLeaderboard();
    await getTop3UserAvatars();

    // if you're logged in, get your answers and place
    if (user.value) {
      await getUserAnswers();
      await getUserPlace();
    }
  });

  return {
    leaderboardData,
    top3Avatars,
    top10,
    userAnswers,
    userPlace,
    isLoading,
    avatarLoading,
    placeLoading,
    answersLoading,
    numberOfCorrect,
    numberOfAnswered,
    retrieveLeaderboard,
    getUserAnswers,
  };
});
