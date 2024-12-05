import imageUrlBuilder from '@sanity/image-url';
import { createClient } from '@sanity/client';

// Sanity client configuration
const sanityClient = createClient({
  projectId: 'ferer2d9',
  dataset: 'production',
  apiVersion: '2021-08-31',
  useCdn: true,
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source).url();
}

export const useQuestionsStore = defineStore('questions', () => {
  const timeStore = useTimeStore();

  // question data and loading state
  const questionData = ref([]);
  const questionTimeData = ref([]);
  const isLoading = ref(true);

  // get questions
  async function getQuestions() {
    const QUESTIONS_QUERY = groq`*[_type == "questions"]`;
    const { data: questions } = await useSanityQuery(QUESTIONS_QUERY);

    const questionsWithImages = questions.value.map((question) => {
      if (question.image?.asset?._ref) {
        question.imageUrl = urlFor(question.image);
      }
      return question;
    });

    questionData.value = questionsWithImages.filter((question) => !question.title.includes('Time'));
    questionTimeData.value = questionsWithImages.filter((question) => question.title.includes('Time'));

    // update time store with new time data
    timeStore.targetDates = questionTimeData.value.map((question) => {
      const targetDate = new Date(question.content);
      return { week: [question.week, question.week + ' Bonus'], date: targetDate };
    });

    await rerenderMathJax();
  }

  // rerender MathJax, really for route changes or if you flip through the tabs
  async function rerenderMathJax() {
    if (window.MathJax) {
      await MathJax.typesetPromise();
    }
  }

  function buildImageUrl(image) {
    return urlFor(image);
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

  return { questionData, questionTimeData, isLoading, getQuestions, rerenderMathJax, buildImageUrl };
});
