export const useQuestionsStore = defineStore('questions', () => {
  const toastStore = useToastStore();

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

  // put the MathJax script in the head
  function getMathJax() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = async () => {
      await rerenderMathJax();
      isLoading.value = false;
    };

    script.onerror = () => {
      toastStore.changeToast(
        'Error loading MathJax',
        'Please refresh the page'
      );
      isLoading.value = false;
    };
  }

  // get questions on mount and load MathJax (which renders it on load)
  onMounted(async () => {
    getMathJax();
    await getQuestions();
  });

  return { questionData, isLoading, getQuestions, getMathJax, rerenderMathJax };
});
