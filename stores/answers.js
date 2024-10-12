export const useAnswersStore = defineStore('answers', () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const toastStore = useToastStore();
  const questionsStore = useQuestionsStore();

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

  // save answers
  async function saveAnswers() {
    const { data } = await supabase
      .from('saved_answers')
      .select('*')
      .eq('uid', user.value.id);

    // if you have an answer, update it, otherwise insert it
    if (data.length > 0) {
      // update the answers
      const { error: updateError } = await supabase
        .from('saved_answers')
        .update({
          created_at: new Date().toISOString(),
          answers: answerData.value,
        })
        .eq('uid', user.value.id);

      if (updateError) {
        toastStore.changeToast('Failed to update answers', updateError.message);
        return;
      }
    }

    // insert the answers
    else {
      const { error: insertError } = await supabase
        .from('saved_answers')
        .insert({ answers: answerData.value });

      if (insertError) {
        toastStore.changeToast('Failed to insert answers', insertError.message);
        return;
      }
    }
  }

  // submit answers
  async function submitAnswers(week, answers) {
    await saveAnswers();

    const { data: submittedData } = await supabase
      .from('submitted_answers')
      .select('*')
      .eq('uid', user.value.id)
      .eq('submitted_week', week);

    if (submittedData.length > 0) {
      // can't submit more than once per hour
      if (
        Date.now() - new Date(submittedData[0].created_at).getTime() <
        1000 * 60 * 60 * 1
      ) {
        toastStore.changeToast(
          'You can only submit once per hour',
          'Please wait before submitting again'
        );
        return;
      }

      // update or insert the answers
      const { error: updateError } = await supabase
        .from('submitted_answers')
        .update({
          created_at: new Date().toISOString(),
          submitted_week: week, // week is treated as text
          answers: answers,
        })
        .eq('uid', user.value.id)
        .eq('submitted_week', week);

      if (updateError) {
        toastStore.changeToast('Failed to update answers', updateError.message);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from('submitted_answers')
        .insert({ submitted_week: week, answers: answers, uid: user.value.id });

      if (insertError) {
        toastStore.changeToast('Failed to insert answers', insertError.message);
        return;
      }
    }

    toastStore.changeToast(
      'Answers submitted',
      'Thank you for submitting your answers'
    );
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
    saveAnswers,
    submitAnswers,
    retrieveAnswers,
  };
});
