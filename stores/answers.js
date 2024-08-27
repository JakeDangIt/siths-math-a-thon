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
    // Check if a row exists for the current user's uid
    const { data, error } = await supabase
    .from('saved-answers')
    .select('*')

    if (data.length > 0) {
      // If the record exists, update it
      const { error: updateError } = await supabase
        .from("saved-answers")
        .update({ answers: answerData.value })
        .eq("uid", user.value.id);

      if (updateError) {
        toastStore.changeToast("Failed to update answers", updateError.message);
        return;
      }
    } else {
      // If the record doesn't exist, insert a new one
      const { error: insertError } = await supabase
        .from("saved-answers")
        .insert({ answers: answerData.value });

      if (insertError) {
        toastStore.changeToast("Failed to insert answers", insertError.message);
        return;
      }
    }
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
  })

  return { answerData, getAnswerLoading, setAnswer, getAnswer, saveAnswers, retrieveAnswers };
});
