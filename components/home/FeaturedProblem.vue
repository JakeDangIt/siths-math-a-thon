<template>
  <div>
    <Card class="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Featured Problem</CardTitle>
      </CardHeader>
      <CardContent v-if="randomQuestion" class="flex h-full flex-col justify-between">
        <div class="flex flex-col gap-2 mb-4">
          <p v-show="!questionsStore.isLoading">
            {{ randomQuestion.title }}.
          </p>
          <span>{{ randomQuestion.content }}</span>
        </div>

        <nuxt-link to="/questions"><Button class="w-full">Solve Now</Button></nuxt-link>
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
const randomQuestion = ref({});


onMounted(async () => {
  watch(() => questionsStore.questionData, () => {
    if (questionsStore.questionData.length !== 0) {
      nextTick(() => {
        // get random question out of the questions list
        randomQuestion.value = questionsStore.questionData[rand(0, questionsStore.questionData.length - 1)];

        // rerender mathjax when the questions are loaded
        questionsStore.rerenderMathJax();
      });
    }
  });
});
</script>
