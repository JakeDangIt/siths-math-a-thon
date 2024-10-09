<template>
  <div>
    <!-- featured problem, which is just a random problem from the list of questions -->
    <Card class="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Featured Problem</CardTitle>
      </CardHeader>
      <CardContent
        v-if="!questionsStore.isLoading"
        class="flex h-full flex-col justify-between"
      >
        <div class="mb-4 flex flex-col gap-2">
          <p class="text-lg font-semibold">{{ randomQuestion?.title }}.</p>
          <span>{{ randomQuestion?.content }}</span>
        </div>

        <!-- solve now button that goes to /questions -->
        <nuxt-link to="/questions"
          ><Button class="w-full">Solve Now</Button></nuxt-link
        >
      </CardContent>

      <CardContent v-else>
        <Skeleton class="mb-4 h-6" />
        <Skeleton class="h-10 w-20" />
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { rand } from '@vueuse/core';
const questionsStore = useQuestionsStore();

// random question
const randomQuestion = computed(
  () =>
    questionsStore.questionData[rand(0, questionsStore.questionData.length - 1)]
);

// load questions
  watch(
    () => questionsStore.questionData,
    () => {
      if (questionsStore.questionData.length !== 0) {
				if (!questionsStore.isLoading) {
	        nextTick(() => {
	          // rerender mathjax when the questions are loaded
	          questionsStore.rerenderMathJax();
	        });
				}
      }
    },
    { immediate: true }
  );

onMounted(() => {
	if (window.MathJax) {
		questionsStore.rerenderMathJax();
	}
})
</script>
