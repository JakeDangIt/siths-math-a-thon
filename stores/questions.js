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
  }

  // rerender MathJax, really for route changes or if you flip through the tabs
  function rerenderMathJax() {
    if (window.MathJax) {
      MathJax.typesetPromise().then(() => {
        isLoading.value = false;
      });
    }
  }

  // put the MathJax script in the head
  function getMathJax() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      rerenderMathJax();
      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
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
    await getQuestions();
    getMathJax();

    watch(questionData.value, () => {
      rerenderMathJax();
      console.log(questionData.value);
    });
  });

  return { questionData, isLoading, getQuestions, getMathJax, rerenderMathJax };
});
