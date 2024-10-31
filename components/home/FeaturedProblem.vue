<template>
  <div>
    <!-- featured problem, which is just a random problem from the list of questions -->
    <Card class="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Featured Problem</CardTitle>
      </CardHeader>

      <CardContent v-if="questionsStore.isLoading || !mathJaxLoaded">
        <Skeleton class="mb-4 h-6" />
        <Skeleton class="h-10 w-20" />
      </CardContent>

      <CardContent v-else class="flex h-full flex-col justify-between">
        <div class="mb-4 flex flex-col gap-2 overflow-clip">
          <p class="text-lg font-semibold">{{ randomQuestion?.title }}.</p>
          <span v-html="randomQuestion?.content"></span>
        </div>

        <!-- solve now button that goes to /questions -->
        <nuxt-link to="/questions">
          <Button class="w-full">Solve Now</Button>
        </nuxt-link>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
const questionsStore = useQuestionsStore();
const mathJaxLoaded = computed(() => typeof MathJax !== 'undefined');

// random question
const randomQuestion = computed(() => {
  return questionsStore.questionData[
    Math.floor(Math.random() * questionsStore.questionData.length)
  ];
});

// rerender mathjax when question data changes
watch(
  () => questionsStore.questionData,
  async () => {
    if (questionsStore.questionData.length > 0 && !questionsStore.isLoading) {
      await nextTick();
      await questionsStore.rerenderMathJax();
    }
  },
  { immediate: true }
);
</script>
