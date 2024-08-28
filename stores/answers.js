export const useAnswersStore = defineStore("answers", () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const toastStore = useToastStore();

  const answerData = ref([]);
  const getAnswerLoading = ref(true);

  function setAnswer(week, questionNumber, answer) {
    const existingAnswerIndex = answerData.value.findIndex(
      (item) => item.week === week && item.questionNumber === questionNumber
    );

    if (existingAnswerIndex !== -1) {
      answerData.value[existingAnswerIndex].answer = answer;
    } else {
      answerData.value.push({ week, questionNumber, answer });
    }
  }

  function getAnswer(week, questionNumber) {
    const answerEntry = answerData.value.find(
      (item) => item.week == week && item.questionNumber == questionNumber
    );
    return answerEntry ? answerEntry.answer : "";
  }

  async function saveAnswers() {
    const { data, error } = await supabase
      .from("saved-answers")
      .select("*")
      .eq("uid", user.value.id);

    if (data.length > 0) {
      if (Date.now() - new Date(data[0].created_at).getTime() < 1000 * 60 * 1) {
        toastStore.changeToast(
          "You can only save once per minute",
          "Please wait before saving again"
        );
        return;
      }

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
    } else {
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

  async function submitAnswers(week, answers) {
    const { data, error } = await supabase
      .from("submitted-answers")
      .select("*")
      .eq("uid", user.value.id)
      .eq("week", week);

    if (data.length > 0) {
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
    } else {
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

  async function retrieveAnswers() {
    const { data, error } = await supabase
      .from("saved-answers")
      .select("*")
      .eq("uid", user.value.id);

    if (error) {
      toastStore.changeToast("Failed to retrieve answers", error.message);
      return;
    }

    if (data.length > 0) {
      answerData.value = data[0].answers;
    }
  }

  onMounted(async () => {
    await retrieveAnswers();
    getAnswerLoading.value = false;
  });

  return {
    answerData,
    getAnswerLoading,
    setAnswer,
    getAnswer,
    saveAnswers,
    submitAnswers,
    retrieveAnswers,
  };
});
