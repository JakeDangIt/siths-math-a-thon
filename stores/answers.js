export const useAnswersStore = defineStore('answers', () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const toastStore = useToastStore();
  const questionsStore = useQuestionsStore();
  const leaderboardStore = useLeaderboardStore();

  const answerData = ref([]);
  const getAnswerLoading = ref(true);
  const answerRemoved = ref({ week: null, question: null });

  // remove answer
  function removeAnswer(week, question) {
    // find the answer
    const index = answerData.value.findIndex(
      (answer) => answer.week == week && answer.question == question
    );

    // remove the answer
    answerData.value[index].answer = '';
    // trigger the watcher in QuestionCard.vue
    answerRemoved.value = { week, question };
  }

  // retrieve answers
  async function retrieveAnswers() {
    const { data, error } = await supabase
      .from('saved_answers')
      .select('*')
      .eq('uid', user.value.id);

    if (error) {
      toastStore.changeToast('Failed to retrieve answers', error.message);
      return;
    }

    if (data.length > 0) {
      answerData.value = data[0].answers;
      // if the number of questions has changed, make blank answers for the new questions
      if (answerData.value.length != questionsStore.questionData.length) {
        questionsStore.questionData.forEach((question) => {
          const index = answerData.value.findIndex(
            (answer) =>
              answer.week == question.week && answer.question == question.number
          );

          if (index == -1) {
            answerData.value.push({
              week: question.week,
              question: question.number,
              answer: '',
            });
          }
        });
      }
    }
  }

  // wait for questions to load, then create the answer data
  watch(
    () => questionsStore.isLoading,
    async (newIsLoading) => {
      if (!newIsLoading) {
        questionsStore.questionData.forEach((question) => {
          answerData.value.push({
            week: question.week,
            question: question.number,
            answer: '',
          });
        });

        // if the user is logged in, retrieve their answers and update the answer data
        if (user.value) {
          getAnswerLoading.value = true;
          await retrieveAnswers();
        }
        getAnswerLoading.value = false;
      }
    },
    { immediate: true }
  );

  return {
    answerData,
    getAnswerLoading,
    answerRemoved,
    removeAnswer,
    retrieveAnswers,
  };
});
