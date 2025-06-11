export const useAnswersStore = defineStore('answers', () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const toastStore = useToastStore();
  const questionsStore = useQuestionsStore();

  const answerData = ref([]);
  const getAnswerLoading = ref(true);
  const answerRemoved = ref({ week: null, question: null });

  // Helper function to normalize week values for comparison
  const normalizeWeek = (week) => String(week);

  // Helper function to normalize question values for comparison
  const normalizeQuestion = (question) => Number(question);

  // Add or update an answer
  function addOrUpdateAnswer(week, question, answer) {
    const normalizedWeek = normalizeWeek(week);
    const normalizedQuestion = normalizeQuestion(question);

    const index = answerData.value.findIndex(
      (ans) =>
        normalizeWeek(ans.week) === normalizedWeek &&
        normalizeQuestion(ans.question) === normalizedQuestion
    );

    if (index !== -1) {
      // Update existing answer
      answerData.value[index].answer = answer;
    } else {
      // Add new answer
      answerData.value.push({
        week: normalizedWeek,
        question: normalizedQuestion,
        answer: answer,
      });
    }
  }

  // Get answer for a specific week and question
  function getAnswer(week, question) {
    const normalizedWeek = normalizeWeek(week);
    const normalizedQuestion = normalizeQuestion(question);

    const answer = answerData.value.find(
      (ans) =>
        normalizeWeek(ans.week) === normalizedWeek &&
        normalizeQuestion(ans.question) === normalizedQuestion
    );

    return answer ? answer.answer : '';
  }

  // Get all answers for a specific week
  function getAnswersForWeek(week) {
    const normalizedWeek = normalizeWeek(week);
    return answerData.value
      .filter((ans) => normalizeWeek(ans.week) === normalizedWeek)
      .sort(
        (a, b) => normalizeQuestion(a.question) - normalizeQuestion(b.question)
      );
  }

  // Remove answer (set to empty string)
  function removeAnswer(week, question) {
    const normalizedWeek = normalizeWeek(week);
    const normalizedQuestion = normalizeQuestion(question);

    const index = answerData.value.findIndex(
      (answer) =>
        normalizeWeek(answer.week) === normalizedWeek &&
        normalizeQuestion(answer.question) === normalizedQuestion
    );

    if (index !== -1) {
      answerData.value[index].answer = '';
      // trigger the watcher in QuestionCard.vue
      answerRemoved.value = {
        week: normalizedWeek,
        question: normalizedQuestion,
      };
    }
  }

  // Initialize answer data based on questions
  function initializeAnswerData() {
    // Clear existing data to avoid duplicates
    answerData.value = [];

    questionsStore.questionData.forEach((question) => {
      answerData.value.push({
        week: normalizeWeek(question.week),
        question: normalizeQuestion(question.question),
        answer: '',
      });
    });
  }

  // Merge saved answers with initialized answer data
  function mergeSavedAnswers(savedAnswers) {
    savedAnswers.forEach((savedAnswer) => {
      const normalizedWeek = normalizeWeek(savedAnswer.week);
      const normalizedQuestion = normalizeQuestion(savedAnswer.question);

      const index = answerData.value.findIndex(
        (answer) =>
          normalizeWeek(answer.week) === normalizedWeek &&
          normalizeQuestion(answer.question) === normalizedQuestion
      );

      if (index !== -1) {
        // Update existing answer with saved data
        answerData.value[index].answer = savedAnswer.answer || '';
      } else {
        // Add saved answer if question still exists
        const questionExists = questionsStore.questionData.some(
          (q) =>
            normalizeWeek(q.week) === normalizedWeek &&
            normalizeQuestion(q.question) === normalizedQuestion
        );

        if (questionExists) {
          answerData.value.push({
            week: normalizedWeek,
            question: normalizedQuestion,
            answer: savedAnswer.answer || '',
          });
        }
      }
    });
  }

  // Retrieve answers from database
  async function retrieveAnswers() {
    if (!user.value) {
      console.warn('User not logged in, skipping answer retrieval');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_answers')
        .select('*')
        .eq('uid', user.value.id);

      if (error) {
        console.error('Error retrieving answers:', error);
        toastStore.changeToast('Failed to retrieve answers', error.message);
        return;
      }

      if (data && data.length > 0 && data[0].answers) {
        // Merge saved answers with current question structure
        mergeSavedAnswers(data[0].answers);
      }
    } catch (err) {
      console.error('Unexpected error retrieving answers:', err);
      toastStore.changeToast(
        'Failed to retrieve answers',
        'Unexpected error occurred'
      );
    }
  }

  // Get all weeks that have answers (non-empty)
  function getWeeksWithAnswers() {
    const weeksSet = new Set();
    answerData.value
      .filter((answer) => answer.answer && answer.answer.trim() !== '')
      .forEach((answer) => weeksSet.add(normalizeWeek(answer.week)));
    return Array.from(weeksSet).sort();
  }

  // Check if a week has any answers
  function hasAnswersForWeek(week) {
    const normalizedWeek = normalizeWeek(week);
    return answerData.value.some(
      (answer) =>
        normalizeWeek(answer.week) === normalizedWeek &&
        answer.answer &&
        answer.answer.trim() !== ''
    );
  }

  // Get count of answered questions for a week
  function getAnsweredCountForWeek(week) {
    const normalizedWeek = normalizeWeek(week);
    return answerData.value.filter(
      (answer) =>
        normalizeWeek(answer.week) === normalizedWeek &&
        answer.answer &&
        answer.answer.trim() !== ''
    ).length;
  }

  // Get total question count for a week
  function getTotalQuestionsForWeek(week) {
    const normalizedWeek = normalizeWeek(week);
    return questionsStore.questionData.filter(
      (question) => normalizeWeek(question.week) === normalizedWeek
    ).length;
  }

  // Watch for questions loading completion
  watch(
    () => questionsStore.isLoading,
    async (newIsLoading) => {
      if (!newIsLoading && questionsStore.questionData.length > 0) {
        getAnswerLoading.value = true;

        // Initialize answer data based on available questions
        initializeAnswerData();

        // If user is logged in, retrieve and merge their saved answers
        if (user.value) {
          await retrieveAnswers();
        }

        getAnswerLoading.value = false;
      }
    },
    { immediate: true }
  );

  // Watch for user login state changes
  watch(user, async (newUser) => {
    if (
      newUser &&
      !getAnswerLoading.value &&
      questionsStore.questionData.length > 0
    ) {
      getAnswerLoading.value = true;
      await retrieveAnswers();
      getAnswerLoading.value = false;
    }
  });

  return {
    answerData,
    getAnswerLoading,
    answerRemoved,
    addOrUpdateAnswer,
    getAnswer,
    getAnswersForWeek,
    removeAnswer,
    retrieveAnswers,
    getWeeksWithAnswers,
    hasAnswersForWeek,
    getAnsweredCountForWeek,
    getTotalQuestionsForWeek,
    initializeAnswerData,
  };
});
