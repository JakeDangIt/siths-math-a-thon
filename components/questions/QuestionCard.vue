<template>
  <Card class="my-2">
    <CardHeader>
      <CardTitle>
        {{ `Question ${question}` }}
      </CardTitle>
      <CardDescription class="">
        {{ `[${points} points]` }}
        <span class="text-theme-red">{{ isInvalid ? 'Please enter a valid number' : '' }}</span>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="props.imageUrl" class="mb-4">
        <img :src="props.imageUrl" :alt="`Image for Question ${question}`" class="w-full h-auto" draggable="false"/>
      </div>
      <div v-html="props.mathContent"></div>
    </CardContent>
    <CardFooter>
      <Input
        id="input"
        type="text"
        v-model="input"
        :placeholder="'Question ' + question"
        @input="validateAndChangeAnswer"
        :disabled="answersStore.getAnswerLoading"
      />
    </CardFooter>
  </Card>
</template>

<script setup>
const answersStore = useAnswersStore();

const props = defineProps(['question', 'week', 'mathContent', 'imageUrl', 'points']);
const question = ref(props.question);
const week = ref(props.week);
const points = ref(props.points);

// question input
const input = ref(null);
const isInvalid = ref(false);

// if the answer is changed, update the answer in the store
function validateAndChangeAnswer() {
  // only allow numbers and replace non-numeric characters
  const cleanedValue = input.value.replace(/[^0-9]/g, '');
  isInvalid.value = cleanedValue !== input.value;
  input.value = cleanedValue;

  const correspondingQuestionIndex = answersStore.answerData.findIndex(
    (answer) => answer.week == week.value && answer.question == question.value
  );

  answersStore.answerData[correspondingQuestionIndex].answer = String(input.value);
}

// once the answers are loaded from the store, update the input value (really only for users logged in)
watch(
  () => [
    answersStore.answerData,
    answersStore.answerData.length,
    answersStore.getAnswerLoading,
  ],
  async () => {
    const correspondingQuestionIndex = answersStore.answerData.findIndex(
      (answer) => answer.week == week.value && answer.question == question.value
    );
    input.value = answersStore.answerData[correspondingQuestionIndex]?.answer;
  },
  { immediate: true }
);

// if the answer is removed, clear the input
watch(
  () => answersStore.answerRemoved,
  (newAnswerRemoved) => {
    if (newAnswerRemoved) {
      if (
        answersStore.answerRemoved.week == week.value &&
        answersStore.answerRemoved.question == question.value
      ) {
        input.value = '';
        // reset the watcher
        answersStore.answerRemoved = { week: null, question: null };
      }
    }
  }
);

onMounted(() => {
  // if the user is logged in, set the input value
  if (answersStore.answerData.length > 0) {
    const correspondingQuestionIndex = answersStore.answerData.findIndex(
      (answer) => answer.week == week.value && answer.question == question.value
    );
    input.value = answersStore.answerData[correspondingQuestionIndex]?.answer;
  }
});
</script>
