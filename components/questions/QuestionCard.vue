<template>
  <Card class="my-2">
    <CardHeader>
      <CardTitle>
        {{ `Question ${question}` }}
      </CardTitle>
      <CardDescription>
        {{ `[${points} points]` }}
        <span class="text-theme-red">{{ isInvalid ? 'Please enter a valid number' : '' }}</span>
      </CardDescription>
    </CardHeader>
    <CardContent class="flex flex-col items-center">
      <div v-if="props.extraInfo" v-html="props.extraInfo"
        class="items-center border-2 px-4 py-2 w-4/5 mb-4 border-black rounded-lg"></div>
        {{ mathContainer?.scrollWidth }} {{ mathContainer?.clientWidth }}
      <div v-if="props.mathContent" class="w-full text-left relative">
        <div class="text-ellipsis" :class="{'overflow-hidden': isOverflowing}" ref="mathContainer" v-html="props.mathContent"></div>
        <Button v-if="isOverflowing" class="md:hidden mt-2" @click="openDialog">
          Expand
        </Button>
      </div>
      <div v-if="props.imageUrl" class="mb-4 flex justify-center">
        <img :src="props.imageUrl" :alt="`Image for Question ${question}`" class="max-w-1/2" draggable="false" />
      </div>
    </CardContent>
    <CardFooter>
      <Input id="input" type="text" v-model="input" :placeholder="'Question ' + question"
        @input="validateAndChangeAnswer" :disabled="answersStore.getAnswerLoading" />
    </CardFooter>

    <!-- Dialog for expanded view -->
    <Dialog v-model:open="dialogVisible">
      <DialogContent>
        <div class="relative flex items-center justify-center h-[90vh]">
          <div class="rotate-90 w-full">
            <div v-html="props.mathContent"></div>
          </div>
        </div>
        <DialogFooter>
          <Button @click="dialogVisible = false" class="w-screen">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Card>
</template>

<script setup>
const answersStore = useAnswersStore();

const props = defineProps(['question', 'week', 'mathContent', 'extraInfo', 'imageUrl', 'points']);
const question = ref(props.question);
const week = ref(props.week);
const points = ref(props.points);

// Question input
const input = ref(null);
const isInvalid = ref(false);

// For dialog state
const dialogVisible = ref(false);
const isOverflowing = ref(false);

// Reference for the math container to check overflow
const mathContainer = ref(null);

// Validate and update answer
function validateAndChangeAnswer() {
  const cleanedValue = input.value.replace(/[^0-9]/g, '');
  isInvalid.value = cleanedValue !== input.value;
  input.value = cleanedValue;

  const correspondingQuestionIndex = answersStore.answerData.findIndex(
    (answer) => answer.week == week.value && answer.question == question.value
  );

  answersStore.answerData[correspondingQuestionIndex].answer = String(input.value);
}

// Check if math content is overflowing
onMounted(() => {
  if (answersStore.answerData.length > 0) {
    const correspondingQuestionIndex = answersStore.answerData.findIndex(
      (answer) => answer.week == week.value && answer.question == question.value
    );
    input.value = answersStore.answerData[correspondingQuestionIndex]?.answer;
  }

  nextTick(() => {
    isOverflowing.value = mathContainer.value?.scrollWidth > mathContainer.value?.clientWidth;
  });
});

// Open the dialog
function openDialog() {
  dialogVisible.value = true;
  nextTick(() => {
    useQuestionsStore().rerenderMathJax();
  });
}
</script>
