<template>
  <Card class="relative my-2 overflow-hidden">
    <CardHeader>
      <CardTitle>
        {{ `Question ${question}` }}
      </CardTitle>
      <CardDescription>
        {{ `[${points} ${points > 1 ? 'points' : 'point'}]` }}
        <span class="text-theme-red">
          {{ isInvalid ? 'Please enter a valid number' : '' }}
        </span>
      </CardDescription>
    </CardHeader>
    <CardContent class="relative z-10 flex flex-col gap-2 items-center">
      <div v-if="props.extraInfo" v-html="props.extraInfo"
        class="mb-4 w-4/5 items-center rounded-lg border-2 border-black px-4 py-2"></div>
      <div v-if="props.mathContent" v-html="props.mathContent" class="relative w-full text-left overflow-x-auto"></div>
      <div v-if="props.imageUrl" class="mb-4 flex justify-center">
        <img :src="props.imageUrl" :alt="`Image for Question ${question}`" class="w-full md:max-w-[50%] rounded-lg"
          draggable="false" />
      </div>
      <Input id="input" type="text" v-model="input" :placeholder="'Question ' + question"
        @change="validateAndChangeAnswer" :disabled="answersStore.getAnswerLoading" />
    </CardContent>

    <!-- Random accent image that only appears in bee mode -->
    <img :src="`/theme/card_accent_${randAccent}.png`"
      class="accent-img absolute bottom-0 right-0 h-64 w-64 object-contain" alt="card accent" draggable="false" />
  </Card>
</template>

<script setup>
const answersStore = useAnswersStore();
const props = defineProps(["question", "week", "mathContent", "extraInfo", "imageUrl", "points"]);

const question = ref(props.question);
const week = ref(props.week);
const points = ref(props.points);

// Random accent image (1 to 4)
const randAccent = ref(Math.floor(Math.random() * 4) + 1);

// Question input
const input = ref(null);
const isInvalid = ref(false);

// Validate and update answer
function validateAndChangeAnswer() {
  const cleanedValue = input.value.match(/^-?\d*$/)?.[0] || "";
  isInvalid.value = cleanedValue !== input.value;
  input.value = cleanedValue;
  
  nextTick(() => {
    const correspondingQuestionIndex = answersStore.answerData.findIndex(
      (answer) => answer.week == week.value && answer.question == question.value
    );

    if (correspondingQuestionIndex !== -1) {
      answersStore.answerData.splice(correspondingQuestionIndex, 1, {
        ...answersStore.answerData[correspondingQuestionIndex],
        answer: String(input.value),
      });
    }
  });
}

// Check if math content is overflowing
onMounted(() => {
  if (answersStore.answerData.length > 0) {
    const correspondingQuestionIndex = answersStore.answerData.findIndex(
      (answer) => answer.week == week.value && answer.question == question.value
    );
    input.value = answersStore.answerData[correspondingQuestionIndex]?.answer;
  }
});
</script>

<style scoped>
.accent-img {
  display: none;
}
.bee-mode .accent-img {
  display: block;
}
</style>