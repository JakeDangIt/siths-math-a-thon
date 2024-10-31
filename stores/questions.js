export const useQuestionsStore = defineStore('questions', () => {

  // question data and loading state
  const questionData = ref([]);
  const isLoading = ref(true);

  // get questions
  async function getQuestions() {
    const QUESTIONS_QUERY = groq`*[_type == "questions"]`;
    const { data: questions } = await useSanityQuery(QUESTIONS_QUERY);

    questionData.value = questions.value;
    await rerenderMathJax();
  }

  // rerender MathJax, really for route changes or if you flip through the tabs
  async function rerenderMathJax() {
    if (window.MathJax) {
      await MathJax.typesetPromise();
    }
  }

  // get questions on mount and load MathJax (which renders it on load)
  onMounted(async () => {
    await getQuestions().then(async () => {
      await rerenderMathJax();
      setTimeout(async () => {
        await rerenderMathJax();
      }, 100);
      isLoading.value = false;
    });
  });

  return { questionData, isLoading, getQuestions, rerenderMathJax };
});
