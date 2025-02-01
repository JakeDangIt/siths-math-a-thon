<template>
  <Dialog :defaultOpen="true">
    <DialogTrigger>
      <button
        class="rounded-full border-2 border-black px-6 py-2 font-medium transition-colors duration-200 hover:bg-gray-100"
      >
        See Results
      </button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <div class="flex flex-col items-center text-center">
          <div
            class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500"
          >
            <StarIcon class="h-8 w-8 text-white" />
          </div>
          <DialogTitle class="mb-6 text-2xl font-bold">
            {{ getCompletionMessage }}
          </DialogTitle>
        </div>
      </DialogHeader>

      <div class="flex flex-col items-center">
        <h3 class="mb-2 text-center text-lg font-bold">Guess History</h3>
        <div>
          <div
            v-for="(guess, index) in guessHistory"
            :key="index"
            class="flex gap-1"
          >
            <div
              v-for="item in guess.items"
              :key="item"
              class="h-10 w-10 rounded text-center"
              :class="
                getGroupColor(
                  connections.find((guess) => guess.content == item).group - 1
                )
              "
            ></div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { StarIcon } from 'lucide-vue-next';

const props = defineProps({
  foundGroups: Array,
  connections: Array,
  guessHistory: Array,
  mistakes: Number,
  isGameOver: Boolean,
});

const getCompletionMessage = computed(() => {
  if (props.mistakes === 0) return 'Perfect!';
  if (props.mistakes === 1) return 'Excellent!';
  if (props.mistakes === 2) return 'Great Job!';
  if (props.mistakes === 3) return 'Well Done!';
  return 'Game Over';
});

function getGroupColor(index) {
  const colors = {
    0: 'bg-[#F7DA21]', // Yellow
    1: 'bg-[#92C13D]', // Green
    2: 'bg-[#7BA4DB]', // Blue
    3: 'bg-[#B87AA3]', // Purple
  };
  return colors[index] || '';
}
</script>
