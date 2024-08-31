export const useAnswersStore = defineStore("answers", () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const toastStore = useToastStore();
  const questionsStore = useQuestionsStore();

  const answerData = ref([]);
  const getAnswerLoading = ref(true);
  const answerRemoved = ref({week: null, questionNumber: null});


  // remove answer
  function removeAnswer(week, questionNumber) {
    // find the answer
    const index = answerData.value.findIndex(
      (answer) => answer.week == week && answer.questionNumber == questionNumber
    );

    // remove the answer
    answerData.value[index].answer = "";
    // trigger the watcher in QuestionCard.vue
    answerRemoved.value = {week, questionNumber};
  }


  // save answers
  async function saveAnswers() {
    const { data, error } = await supabase
      .from("saved-answers")
      .select("*")
      .eq("uid", user.value.id);

    // if you have an answer, update it, otherwise insert it
    if (data.length > 0) {
      // can't save more than once per minute
      if (Date.now() - new Date(data[0].created_at).getTime() < 1000 * 60 * 1) {
        toastStore.changeToast(
          "You can only save once per minute",
          "Please wait before saving again"
        );
        return;
      }

      // update the answers
      const { error: updateError } = await supabase
        .from("saved-answers")
        .update({
          created_at: new Date().toISOString(),
          answers: answerData.value,
        })
        .eq("uid", user.value.id);

      if (updateError) {
        toastStore.changeToast("Failed to update answers", updateError.message);
        return;
      }
    }

    // insert the answers
    else {
      const { error: insertError } = await supabase
        .from("saved-answers")
        .insert({ answers: answerData.value });

      if (insertError) {
        toastStore.changeToast("Failed to insert answers", insertError.message);
        return;
      }
    }

    toastStore.changeToast("Answers saved", "Your answers have been saved");
  }

  // submit answers
  async function submitAnswers(week, answers) {
    const { data, error } = await supabase
      .from("submitted-answers")
      .select("*")
      .eq("uid", user.value.id)
      .eq("week", week);

    // if you have an answer, update it, otherwise insert it
    if (data.length > 0) {
      // can't submit more than once per hour
      if (
        Date.now() - new Date(data[0].created_at).getTime() <
        1000 * 60 * 60 * 1
      ) {
        toastStore.changeToast(
          "You can only submit once per hour",
          "Please wait before submitting again"
        );
        return;
      }

      // update the answers
      const { error: updateError } = await supabase
        .from("submitted-answers")
        .update({
          created_at: new Date().toISOString(),
          week: String(week),
          answers: answers,
        })
        .eq("uid", user.value.id)
        .eq("week", week);

      if (updateError) {
        toastStore.changeToast("Failed to update answers", updateError.message);
        return;
      }
    }

    // insert the answers
    else {
      const { error: insertError } = await supabase
        .from("submitted-answers")
        .insert({ week: String(week), answers: answers });

      if (insertError) {
        toastStore.changeToast("Failed to insert answers", insertError.message);
        return;
      }
    }

    toastStore.changeToast(
      "Answers submitted",
      "Thank you for submitting your answers"
    );
  }

  // retrieve answers
  async function retrieveAnswers() {
    const { data, error } = await supabase
      .from("saved-answers")
      .select("*")
      .eq("uid", user.value.id);

    if (error) {
      toastStore.changeToast("Failed to retrieve answers", error.message);
      return;
    }

    answerData.value = data[0].answers;
  }


  // on mount
  onMounted(async () => {
    // wait for questions to load, then create the answer data
    watch(
      () => questionsStore.isLoading,
      async (newIsLoading) => {
        if (!newIsLoading) {
          questionsStore.questionData.forEach((question) => {
            answerData.value.push({
              week: question.week,
              questionNumber: question.question,
              answer: "",
            });
          });

          // if the user is logged in, retrieve their answers and update the answer data
          if (user.value) {
            await retrieveAnswers();
          }
          getAnswerLoading.value = false;
        }
      },
      { immediate: true }
    );
  });

  return {
    answerData,
    getAnswerLoading,
    answerRemoved,
    removeAnswer,
    saveAnswers,
    submitAnswers,
    retrieveAnswers,
  };
});
