export const useQuestionsStore = defineStore("questions", () => {
  const supabase = useSupabaseClient();
  const toastStore = useToastStore();

  // question data and loading state
  const questionData = ref([]);
  const sanityQuestionData = ref([]);
  const isLoading = ref(true);

  // get questions
  async function getQuestions() {
    const { data, error } = await supabase.from("questions").select("*");

    if (error) {
      toastStore.changeToast("Error retrieving questions", error.message);
      return;
    }

    const POSTS_QUERY = groq`*[_type == "questions"]{ _id, number, content, author }`;
    const { data: posts } = await useSanityQuery(POSTS_QUERY);
    questionData.value = data;
    sanityQuestionData.value = posts;
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
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      rerenderMathJax();
      isLoading.value = false;
    };

    script.onerror = () => {
      toastStore.changeToast(
        "Error loading MathJax",
        "Please refresh the page"
      );
      isLoading.value = false;
    };
  }

  // get questions on mount and load MathJax (which renders it on load)
  onMounted(async () => {
    await getQuestions();
    getMathJax();
  });

  return { questionData, sanityQuestionData, isLoading, getMathJax, rerenderMathJax };
});
