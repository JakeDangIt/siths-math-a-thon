export const useQuestionsStore = defineStore("questions", () => {
  const supabase = useSupabaseClient();
  const toastStore = useToastStore();

  const questionData = ref([]);
  const isLoading = ref(true);

  async function getQuestions() {
    const { data, error } = await supabase.from("questions").select("*");

    if (error) {
      toastStore.changeToast("Error retrieving questions", error.message);
      return;
    }
    questionData.value = data;
  }

  function rerenderMathJax() {
    if (window.MathJax) {
      MathJax.typesetPromise().then(() => {
        isLoading.value = false;
      });
    }
  }

  function getMathJax() {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      rerenderMathJax(); // Initial rendering after MathJax loads
      isLoading.value = false;
    };
    
    script.onerror = () => {
      toastStore.changeToast("Error loading MathJax", "Please refresh the page");
      isLoading.value = false;
    };
  }

  onMounted(async () => {
    await getQuestions();
    getMathJax();
  });

  return { questionData, isLoading, getMathJax, rerenderMathJax };
});
