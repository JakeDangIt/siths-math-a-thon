export const useQuestionsStore = defineStore('questions', () => {
  const toastStore = useToastStore();

  // question data and loading state
  const questionData = ref([]);
  const isLoading = ref(false);

  // get questions
  async function retreiveQuestions() {
    isLoading.value = true;
    try {
      const result = await requestEndpoint('/api/retreiveQuestions');

      if (result.error) {
        toastStore.changeToast('Failed to retrieve questions', result.error);
      } else {
        questionData.value = result.questions;
      }
    } catch (error) {
      toastStore.changeToast('Error fetching questions', error.message);
    }

    isLoading.value = false;

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
    await retreiveQuestions().then(async () => {
      await rerenderMathJax();
      setTimeout(async () => {
        await rerenderMathJax();
      }, 100);
      isLoading.value = false;
    });
  });

  return {
    questionData,
    isLoading,
    retreiveQuestions,
    rerenderMathJax,
  };
});
