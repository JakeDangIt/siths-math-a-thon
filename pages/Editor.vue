<template>
  <!-- tabs for the questions, if you switch tab, rerenders mathjax -->
  <Tabs
    v-if="data"
    :default-value="'1'"
    class="md:mx-auto md:w-4/5 lg:mx-auto lg:w-2/3"
    @update:model-value="onTabChange"
  >
    <div class="flex flex-col gap-2 md:flex-row">
      <Carousel
        v-if="presentWeekNames.length > 0"
        class="mx-auto w-2/3"
        :opts="{
          align: 'start',
          slidesToScroll: 2,
          startIndex: defaultWeek - 1,
        }"
        ref="mainCarousel"
      >
        <CarouselContent>
          <!-- paired into week and its bonus -->
          <CarouselItem
            v-for="week in presentWeekNames"
            class="w-full basis-1/2"
            :key="week"
          >
            <TabsList class="w-full">
              <TabsTrigger class="w-full" :value="week">
                Week {{ week }}
              </TabsTrigger>
            </TabsList>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>

    <!-- content for the tabs -->
    <TabsContent
      v-for="week in presentWeekNames"
      :value="week"
      :key="week"
      class="space-y-2"
    >
      <div>
        <!-- week name and each question for that week -->
        <h1 class="my-2 text-center text-2xl font-bold">
          Week {{ week }} Questions
        </h1>

        <QuestionsEditorCard
          class="flex flex-col gap-2"
          v-for="(question, index) in getQuestionsForWeek(week)"
          :key="question.id"
          :question="question.question"
          :mathContent="question.math_content"
          :extraInfo="question.extra_info"
          :week="week"
          :imageUrl="question.image_url"
          :answer="answerList[question.id] || ''"
          :canMoveUp="index > 0"
          :canMoveDown="index < getQuestionsForWeek(week).length - 1"
          @update:mathContent="
            updateQuestion(question.id, 'math_content', $event)
          "
          @update:extraInfo="updateQuestion(question.id, 'extra_info', $event)"
          @update:imageUrl="updateQuestion(question.id, 'image_url', $event)"
          @update:answer="answerList[question.id] = $event"
          @moveUp="moveQuestionUp(question.id, week)"
          @moveDown="moveQuestionDown(question.id, week)"
          @delete="deleteQuestion(question.id)"
        />

        <Button @click="addQuestion(week)" class="mt-4">Add Question</Button>

        <div class="fixed bottom-3 right-[0.9rem] z-20 lg:left-4 lg:right-auto">
          <Button @click="saveQuestions" variant="secondary">
            Save Changes
          </Button>
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>

<script setup>
definePageMeta({
  middleware: ['editor-admin'],
});

const data = ref({ questions: [] });
const answerList = ref({});

const questionsStore = useQuestionsStore();
const toastStore = useToastStore();

const mainCarousel = ref(null);

const selectedPreviewWeek = ref('1');

const allWeekNames = ['1', '1 Bonus', '2', '2 Bonus', '3', '3 Bonus'];

const normalizeWeek = (week) => {
  return String(week);
};

const presentWeekNames = ref(allWeekNames);

const defaultWeek = computed(() => {
  return presentWeekNames.value.length > 0 ? presentWeekNames.value[0] : '1';
});

const getQuestionsForWeek = (week) => {
  return data.value.questions
    .filter((question) => normalizeWeek(question.week) === normalizeWeek(week))
    .sort((a, b) => Number(a.question) - Number(b.question));
};

// function to rerender mathjax when tab changes, must be nexttick to wait for DOM to update
function onTabChange(newWeek) {
  const carouselScrollIndex = getCarouselScrollIndex(newWeek);

  nextTick(() => {
    scrollCarouselToIndex(mainCarousel, carouselScrollIndex);
    questionsStore.rerenderMathJax();
  });
}

const getWeekIndex = (week) => {
  return presentWeekNames.value.findIndex(
    (w) => normalizeWeek(w) === normalizeWeek(week)
  );
};

// Helper function to get the carousel scroll index based on week pairs
// Since carousel shows 2 items (basis-1/2), we need to scroll to the correct pair
const getCarouselScrollIndex = (week) => {
  const weekIndex = getWeekIndex(week);
  if (weekIndex === -1) return 0;

  // Group weeks into pairs: [0,1], [2,3], [4,5], etc.
  // For weeks 1 and 1 Bonus (indices 0,1) -> scroll to index 0
  // For weeks 2 and 2 Bonus (indices 2,3) -> scroll to index 1
  // For weeks 3 and 3 Bonus (indices 4,5) -> scroll to index 2
  return Math.floor(weekIndex / 2);
};

const updateQuestion = (id, field, value) => {
  const question = data.value.questions.find((q) => q.id === id);
  if (question) {
    question[field] = value;
    nextTick(() => {
      questionsStore.rerenderMathJax();
    });
  }
};
const moveQuestionUp = (id, week) => {
  const scrollY = window.scrollY;
  const questions = data.value.questions
    .filter((q) => normalizeWeek(q.week) === normalizeWeek(week))
    .sort((a, b) => Number(a.question) - Number(b.question));
  const index = questions.findIndex((q) => q.id === id);
  if (index > 0) {
    const temp = questions[index].question;
    questions[index].question = questions[index - 1].question;
    questions[index - 1].question = temp;
    nextTick(() => window.scrollTo(0, scrollY));
  }
};

const moveQuestionDown = (id, week) => {
  const scrollY = window.scrollY;
  const questions = data.value.questions
    .filter((q) => normalizeWeek(q.week) === normalizeWeek(week))
    .sort((a, b) => Number(a.question) - Number(b.question));
  const index = questions.findIndex((q) => q.id === id);
  if (index < questions.length - 1) {
    const temp = questions[index].question;
    questions[index].question = questions[index + 1].question;
    questions[index + 1].question = temp;
    nextTick(() => window.scrollTo(0, scrollY));
  }
};

const addQuestion = (week) => {
  const questions = getQuestionsForWeek(week);
  const maxQuestion = Math.max(...questions.map((q) => Number(q.question)), 0);
  const newQuestionNum = maxQuestion + 1;
  const newId = 'new-' + Date.now();
  const newQuestion = {
    id: newId,
    week: week,
    question: newQuestionNum.toString(),
    math_content: '',
    extra_info: '',
    image_url: '',
  };
  data.value.questions.push(newQuestion);
  answerList.value[newId] = '';
};

const saveQuestions = async () => {
  try {
    const response = await requestEndpoint('/api/saveEditorQuestions', 'POST', {
      questions: data.value.questions,
      answers: answerList.value,
    });

    if (response.error) {
      console.error('Error saving:', response.error);
    } else {
      console.log('Saved successfully');
      // Reload data to get actual database IDs for new questions
      toastStore.changeToast('Success', 'The questions have been saved.');
      await reloadData();
    }
  } catch (error) {
    console.error('Error saving questions:', error);
  }
};

const deleteQuestion = async (id) => {
  const questionToDelete = data.value.questions.find((q) => q.id === id);
  if (questionToDelete) {
    // Delete from database if it's an existing question
    if (!id.toString().startsWith('new-')) {
      try {
        const response = await requestEndpoint(
          '/api/deleteEditorQuestion',
          'POST',
          {
            questionId: id,
          }
        );

        if (response.error) {
          console.error('Error deleting from database:', response.error);
          return;
        }

        // Reload data to sync with database
        await reloadData();
      } catch (error) {
        console.error('Error deleting question:', error);
        return;
      }
    } else {
      // For new questions, just remove from local state and renumber
      const week = questionToDelete.week;
      const index = data.value.questions.findIndex((q) => q.id === id);
      if (index !== -1) {
        data.value.questions.splice(index, 1);
        delete answerList.value[id];

        // Renumber questions in this week
        const questionsInWeek = data.value.questions
          .filter((q) => normalizeWeek(q.week) === normalizeWeek(week))
          .sort((a, b) => Number(a.question) - Number(b.question));
        questionsInWeek.forEach((q, idx) => {
          q.question = (idx + 1).toString();
        });
      }
    }
  }
};

const scrollCarouselToIndex = (carouselRef, index) => {
  if (carouselRef?.value?.scrollTo && index >= 0) {
    carouselRef.value.scrollTo(index);
  }
};

watch(selectedPreviewWeek, (newWeek) => {
  const carouselScrollIndex = getCarouselScrollIndex(newWeek);
  nextTick(() => {
    scrollCarouselToIndex(mainCarousel, carouselScrollIndex);
  });
});

watch(
  () => [data.value.questions, window.MathJax],
  async () => {
    if (data.value.questions.length > 0) {
      await nextTick();
      await questionsStore.rerenderMathJax();
    }
  },
  { immediate: true }
);

const reloadData = async () => {
  const fetchedData = await requestEndpoint('/api/retrieveEditorQuestions');
  data.value = fetchedData;

  const answersData = await requestEndpoint('/api/retrieveEditorAnswers');

  answerList.value = {};
  data.value.questions.forEach((question) => {
    answerList.value[question.id] = '';
  });

  answersData.answers.forEach((answer) => {
    const question = data.value.questions.find(
      (q) =>
        normalizeWeek(q.week) === normalizeWeek(answer.week) &&
        q.question == answer.question_number
    );
    if (question) {
      answerList.value[question.id] = answer.answer;
    }
  });

  if (window.MathJax) {
    await nextTick();
    await questionsStore.rerenderMathJax();
  }
};

onMounted(async () => {
  await reloadData();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
