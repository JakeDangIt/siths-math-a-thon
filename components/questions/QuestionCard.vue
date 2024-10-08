<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle>
          {{ `Question ${question}` }}
        </CardTitle>
        <CardDescription class="text-theme-red">
          {{ isInvalid ? 'Please enter a valid number' : '' }}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
const answersStore = useAnswersStore();

const props = defineProps(['question', 'week', 'mathContent']);
const question = ref(props.question);
const week = ref(props.week);

// question input
const input = ref(null);
const isInvalid = ref(false); // Track if input is invalid

// if the answer is changed, update the answer in the store
function validateAndChangeAnswer() {
  // Only allow numbers and replace non-numeric characters
  const cleanedValue = input.value.replace(/[^0-9]/g, '');

  // Check if cleaned value is different from the original input
  if (cleanedValue !== input.value) {
    isInvalid.value = true; // Mark input as invalid
  } else {
    isInvalid.value = false; // Input is valid
  }

  input.value = cleanedValue;

  const correspondingQuestionIndex = answersStore.answerData.findIndex(
    (answer) => answer.week == week.value && answer.question == question.value
  );

  answersStore.answerData[correspondingQuestionIndex].answer = String(
    input.value
  );
}

// watch for changes in the store
onMounted(() => {
  // once the answers are loaded from the store, update the input value (really only for users logged in)
  watch(
    () => answersStore.getAnswerLoading,
    async (newIsLoading) => {
      if (!newIsLoading) {
        const correspondingQuestionIndex = answersStore.answerData.findIndex(
          (answer) =>
            answer.week == week.value && answer.question == question.value
        );

        input.value =
          answersStore.answerData[correspondingQuestionIndex]?.answer;
      }
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
});
</script>
