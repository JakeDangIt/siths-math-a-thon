<template>
  <Card class="relative my-2 overflow-hidden">
    <CardHeader>
      <CardTitle>
        {{ `Question ${question}` }}
      </CardTitle>
      <CardDescription>
        <span class="text-theme-red">
          {{ isInvalid ? 'Please enter a valid number' : '' }}
        </span>
      </CardDescription>
    </CardHeader>
    <CardContent class="relative z-10 flex flex-col items-center gap-2">
      <div
        v-if="props.extraInfo"
        v-html="props.extraInfo"
        class="mb-4 w-4/5 items-center rounded-lg border-2 border-black px-4 py-2"
      ></div>
      <div
        v-if="props.mathContent"
        v-html="props.mathContent"
        class="relative w-full overflow-x-auto text-left"
      ></div>
      <div v-if="props.imageUrl" class="mb-4 flex justify-center">
        <img
          :src="props.imageUrl"
          :alt="`Image for Question ${question}`"
          class="w-full rounded-lg md:max-w-[50%]"
          draggable="false"
        />
      </div>
      <Input
        v-if="user"
        id="input"
        type="text"
        v-model="inputValue"
        :placeholder="'Question ' + question"
        @input="handleInput"
        @blur="handleBlur"
        :disabled="answersStore.getAnswerLoading"
      />
    </CardContent>

    <!-- Random accent image that only appears in bee mode -->
    <img
      :src="`/theme/card_accent_${randAccent}.png`"
      class="accent-img absolute bottom-0 right-0 hidden h-64 w-64 object-contain"
      alt="card accent"
      draggable="false"
    />
  </Card>
</template>

<script setup>
const user = useSupabaseUser();

const answersStore = useAnswersStore();
const props = defineProps([
  'question',
  'week',
  'mathContent',
  'extraInfo',
  'imageUrl',
]);

const question = ref(props.question);
const week = ref(props.week);

// Random accent image (1 to 4)
const randAccent = ref(Math.floor(Math.random() * 4) + 1);

// Question input - use computed for two-way binding with store
const inputValue = computed({
  get() {
    return answersStore.getAnswer(week.value, question.value) || '';
  },
  set(value) {
    answersStore.addOrUpdateAnswer(week.value, question.value, value);
  },
});

const isInvalid = ref(false);

// Validate input and update answer
function handleInput(event) {
  const value = event.target.value;
  const cleanedValue = value.match(/^-?\d*$/)?.[0] || '';

  isInvalid.value = cleanedValue !== value;

  if (cleanedValue !== value) {
    // If invalid, set the cleaned value
    nextTick(() => {
      event.target.value = cleanedValue;
      inputValue.value = cleanedValue;
    });
  } else {
    // If valid, update normally
    inputValue.value = value;
  }
}

// Handle blur to ensure final validation
function handleBlur(event) {
  const value = event.target.value;
  const cleanedValue = value.match(/^-?\d*$/)?.[0] || '';

  if (cleanedValue !== value) {
    event.target.value = cleanedValue;
    inputValue.value = cleanedValue;
  }

  isInvalid.value = false; // Clear invalid state on blur
}

// Watch for answer removal from store
watch(
  () => answersStore.answerRemoved,
  (newValue) => {
    if (newValue.week === week.value && newValue.question === question.value) {
      // Reset the input when answer is removed from store
      inputValue.value = '';
    }
  },
  { deep: true }
);

// Initialize input value when component mounts
onMounted(() => {
  // Ensure the answer exists in store when component mounts
  const existingAnswer = answersStore.getAnswer(week.value, question.value);
  if (existingAnswer === undefined || existingAnswer === null) {
    answersStore.addOrUpdateAnswer(week.value, question.value, '');
  }
});
</script>

<style scoped>
.bee-mode .accent-img {
  display: block;
}
</style>
