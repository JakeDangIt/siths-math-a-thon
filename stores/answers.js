export const useAnswersStore = defineStore("answers", () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const toastStore = useToastStore();

  const answerData = ref([]);
  const getAnswerLoading = ref(true);


  // set answer, called when you update an input
  function setAnswer(week, questionNumber, answer) {
    // find the index of the answer in the array
    const existingAnswerIndex = answerData.value.findIndex(
      (item) => item.week === week && item.questionNumber === questionNumber
    );

    // if it exists, update it, otherwise add it
    if (existingAnswerIndex !== -1) {
      answerData.value[existingAnswerIndex].answer = answer;
    } else {
      answerData.value.push({ week, questionNumber, answer });
    }
  }

  // remove answer, called when you delete an input
  function removeAnswer(week, questionNumber) {
    const existingAnswerIndex = answerData.value.findIndex(
      (item) => item.week === week && item.questionNumber === questionNumber
    );

    if (existingAnswerIndex !== -1) {
      answerData.value.splice(existingAnswerIndex, 1);
    }
  }

  // get answer, called when you load the page and if youre logged in, inputs are prefilled
  function getAnswer(week, questionNumber) {
    const answerEntry = answerData.value.find(
      (item) => item.week == week && item.questionNumber == questionNumber
    );
    return answerEntry ? answerEntry.answer : "";
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

    // if you have answers, set them
    if (data.length > 0) {
      answerData.value = data[0].answers;
    }
  }


  onMounted(async () => {
    // if you're logged in, get the answers
    if (user.value) {
      await retrieveAnswers();
      getAnswerLoading.value = false;
    }
  });

  return {
    answerData,
    getAnswerLoading,
    setAnswer,
    removeAnswer,
    getAnswer,
    saveAnswers,
    submitAnswers,
    retrieveAnswers,
  };
});
