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
    const { data: top10Data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(10);

    if (error) {
      toastStore.changeToast('Failed to retrieve leaderboard', error.message);
    } else {
      top10.value = top10Data;
    }

    isLoading.value = false;
  }

  // get your user place
  async function getUserPlace() {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('uid, correct_answers')
      .order('total_points', { ascending: false });

    if (error) {
      toastStore.changeToast('Failed to retrieve leaderboard', error.message);
    } else {
      leaderboardData.value = data;

      const userIndex = data.findIndex((user) => user.uid == user_id.value);
      userPlace.value = userIndex + 1;
      placeLoading.value = false;
    }
  }

  // get the top 3 user avatars
  async function getTop3UserAvatars() {
    // extract the top 3 UIDs
    const top3UIDs = top10.value.slice(0, 3).map((user) => user.uid);

    // query Supabase once to get all top 3 profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('avatar, name, uid')
      .in('uid', top3UIDs);

    profiles.sort((a, b) => top3UIDs.indexOf(a.uid) - top3UIDs.indexOf(b.uid));

    if (error) {
      console.error('Error fetching profiles:', error);
      avatarLoading.value = false;
      return;
    }

    // map each profile to top3Avatars with avatar download if it exists
    profiles.forEach(async (profile, index) => {
      if (profile.avatar) {
        const { data: avatarData, error: avatarError } = await supabase.storage
          .from('avatars')
          .download(profile.avatar);

        if (avatarError) {
          console.error('Error downloading avatar:', avatarError);
          top3Avatars.value[index] = {
            name: profile.name,
            image: null,
          };
        } else {
          top3Avatars.value[index] = {
            name: profile.name,
            image: URL.createObjectURL(avatarData),
          };
        }
      } else {
        top3Avatars.value[index] = {
          name: profile.name,
          image: null,
        };
      }
    });

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
