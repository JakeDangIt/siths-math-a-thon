<template>
  <div>
    <!-- featured problem, which is just a random problem from the list of questions -->
    <Card class="relative flex h-full flex-col">
      <CardHeader>
        <CardTitle>Featured Problem</CardTitle>
      </CardHeader>

      <CardContent v-if="questionsStore.isLoading || !mathJaxLoaded">
        <Skeleton class="mb-4 h-6" />
        <Skeleton class="h-10 w-20" />
      </CardContent>

      <CardContent v-else-if="questionsStore.questionData.length > 0"
        class="relative z-10 flex h-full flex-col justify-between">
        <div class="mb-4 flex flex-col gap-2 overflow-clip">
          <p class="text-lg font-semibold">{{ randomQuestion?.title }}.</p>
          <span v-html="randomQuestion?.content"></span>
        </div>

        <!-- solve now button that goes to /questions -->
        <nuxt-link to="/questions">
          <Button class="w-full">Solve Now</Button>
        </nuxt-link>
      </CardContent>

      <CardContent v-else>
        <div class="mb-4 flex flex-col gap-2 overflow-clip">
          <p class="text-lg font-semibold">No questions available.</p>
          <span>Check back later for more questions.</span>
        </div>
      </CardContent>
      <img src="/theme/card_accent_4.png" class="absolute bottom-0 right-0 h-64 w-64 object-contain" alt="card accent"
        draggable="false" />
    </Card>
  </div>
</template>

<script setup>
const timeStore = useTimeStore();
const questionsStore = useQuestionsStore();
const mathJaxLoaded = computed(() => typeof MathJax !== 'undefined');

const currentWeekQuestions = computed(() => {
  return questionsStore.questionData.filter((question) => question.week == timeStore.currentWeek || question.week == timeStore.currentWeek + ' Bonus');
});

// random question
const randomQuestion = computed(() => {
  return currentWeekQuestions.value[
    Math.floor(Math.random() * currentWeekQuestions.value.length)
  ];
});

// rerender mathjax when question data changes
watch(
  () => [questionsStore.questionData, window.MathJax],
  async () => {
    if (questionsStore.questionData.length > 0 && !questionsStore.isLoading) {
      await nextTick();
      await questionsStore.rerenderMathJax();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  if (window.MathJax) {
    await nextTick();
    await questionsStore.rerenderMathJax();
  }
});
</script>
<style scoped>
img {
  display: none;
}

.bee-mode img {
  display: block;
}
</style>