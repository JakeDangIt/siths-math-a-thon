<template>
  <div
    class="relative mb-4 space-y-2 rounded-lg border border-gray-200 p-4 pl-10"
  >
    <div class="absolute left-2 top-1/2 flex -translate-y-1/2 flex-col gap-1">
      <Button
        @click="moveUp"
        size="sm"
        variant="outline"
        class="p-1"
        :disabled="!canMoveUp"
      >
        <Icon name="material-symbols:arrow-upward" class="h-4 w-4" />
      </Button>
      <Button
        @click="moveDown"
        size="sm"
        variant="outline"
        class="p-1"
        :disabled="!canMoveDown"
      >
        <Icon name="material-symbols:arrow-downward" class="h-4 w-4" />
      </Button>
      <Button
        @click="deleteQuestion"
        size="sm"
        variant="destructive"
        class="p-1"
      >
        <Icon name="material-symbols:delete" class="h-4 w-4" />
      </Button>
    </div>
    <Card class="relative overflow-hidden">
      <CardHeader>
        <CardTitle> Edit Question {{ question }} </CardTitle>
        <CardDescription>
          <span class="text-theme-red">
            {{ isAnswerInvalid ? 'Please enter a valid integer' : '' }}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent class="relative z-10 flex flex-col items-center gap-2">
        <Textarea
          v-model="extraInfoValue"
          placeholder="Extra Info"
          class="mb-4 w-4/5 items-center rounded-lg border-2 border-black px-4 py-2"
        />
        <Textarea
          v-model="mathContentValue"
          placeholder="Math Content (LaTeX)"
          class="relative w-full overflow-x-auto overflow-y-hidden text-left"
        />
        <Input v-model="imageUrlValue" placeholder="Image URL" class="mb-4" />
        <Input
          v-model="answerValue"
          placeholder="Answer"
          class="mb-4"
          @input="handleAnswerInput"
          @blur="handleAnswerBlur"
        />
      </CardContent>
    </Card>

    <!-- Preview Card -->
    <Card class="relative overflow-hidden">
      <CardHeader>
        <CardTitle>
          {{ `Question ${question}` }}
        </CardTitle>
        <CardDescription> Preview </CardDescription>
      </CardHeader>
      <CardContent class="relative z-10 flex flex-col items-center gap-2">
        <div
          v-if="extraInfoValue"
          v-html="extraInfoValue"
          class="mb-4 w-4/5 items-center rounded-lg border-2 border-black px-4 py-2"
        ></div>
        <div
          v-if="mathContentValue"
          v-html="mathContentValue"
          class="relative w-full overflow-x-auto overflow-y-hidden text-left"
        ></div>
        <div v-if="imageUrlValue" class="mb-4 flex justify-center">
          <img
            :src="imageUrlValue"
            :alt="`Image for Question ${question}`"
            class="w-full rounded-lg md:max-w-[50%]"
            draggable="false"
          />
        </div>
      </CardContent>

      <img
        :src="`/theme/card_accent_${randAccent}.png`"
        class="accent-img absolute bottom-0 right-0 hidden h-64 w-64 object-contain"
        alt="card accent"
        draggable="false"
      />
    </Card>
  </div>
</template>

<script setup>
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { computed } from 'vue';

const questionsStore = useQuestionsStore();
const props = defineProps([
  'question',
  'week',
  'mathContent',
  'extraInfo',
  'imageUrl',
  'answer',
  'canMoveUp',
  'canMoveDown',
]);

const emit = defineEmits([
  'update:mathContent',
  'update:extraInfo',
  'update:imageUrl',
  'update:answer',
  'moveUp',
  'moveDown',
  'delete',
]);

const question = computed(() => props.question);
const week = ref(props.week);

// Random accent image (1 to 4)
const randAccent = ref(Math.floor(Math.random() * 4) + 1);

const mathContentValue = ref(props.mathContent || '');
const extraInfoValue = ref(props.extraInfo || '');
const imageUrlValue = ref(props.imageUrl || '');
const answerValue = ref(props.answer || '');

// Watch for prop changes
watch(
  () => props.answer,
  (newVal) => {
    answerValue.value = newVal || '';
  }
);

const isAnswerInvalid = ref(false);

// Watch for changes and emit
watch(mathContentValue, (newVal) => {
  emit('update:mathContent', newVal);
  nextTick(() => {
    if (typeof window.MathJax !== 'undefined') {
      questionsStore.rerenderMathJax();
    }
  });
});

watch(extraInfoValue, (newVal) => {
  emit('update:extraInfo', newVal);
});

watch(imageUrlValue, (newVal) => {
  emit('update:imageUrl', newVal);
});

watch(answerValue, (newVal) => {
  emit('update:answer', newVal);
});

function moveUp() {
  emit('moveUp');
}

function moveDown() {
  emit('moveDown');
}

function deleteQuestion() {
  emit('delete');
}

function handleAnswerInput(event) {
  const value = event.target.value;
  const cleanedValue = value.match(/^-?\d*$/)?.[0] || '';

  isAnswerInvalid.value = cleanedValue !== value;

  if (cleanedValue !== value) {
    nextTick(() => {
      event.target.value = cleanedValue;
      answerValue.value = cleanedValue;
    });
  } else {
    answerValue.value = value;
  }
}

function handleAnswerBlur(event) {
  const value = event.target.value;
  const cleanedValue = value.match(/^-?\d*$/)?.[0] || '';

  if (cleanedValue !== value) {
    event.target.value = cleanedValue;
    answerValue.value = cleanedValue;
  }

  isAnswerInvalid.value = false;
}

onMounted(() => {
  if (mathContentValue.value && typeof window.MathJax !== 'undefined') {
    nextTick(() => {
      questionsStore.rerenderMathJax();
    });
  }
});
</script>

<style scoped>
.bee-mode .accent-img {
  display: block;
}
</style>
