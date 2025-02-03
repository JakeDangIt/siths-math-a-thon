<template>
  <div class="space-y-6">
    <div class="flex flex-col items-center gap-4">
      <p class="text-lg font-medium">Mistakes remaining:</p>
      <div class="flex gap-2">
        <span
          v-for="i in 4"
          :key="i"
          class="h-4 w-4 rounded-full"
          :class="i <= 4 - mistakes ? 'bg-[#666666]' : 'bg-[#cacac7]'"
        ></span>
      </div>
    </div>

    <div v-if="!isGameOver" class="flex flex-row justify-center gap-2">
      <button
        class="rounded-full border-2 border-black px-6 py-2 font-medium transition-colors duration-200 hover:bg-gray-100"
        :disabled="isChecking"
        :class="{ 'cursor-not-allowed opacity-50': isChecking }"
        @click="$emit('shuffle')"
      >
        Shuffle
      </button>
      <button
        class="whitespace-nowrap rounded-full border-2 border-black px-6 py-2 font-medium transition-colors duration-200 hover:bg-gray-100"
        :class="{
          'cursor-not-allowed opacity-50':
            selectedConnections.length < 1 || isChecking,
        }"
        :disabled="selectedConnections.length < 1 || isChecking"
        @click="$emit('deselect-all')"
      >
        Deselect All
      </button>
      <button
        class="rounded-full border-2 border-black px-6 py-2 font-medium transition-colors duration-200 hover:bg-gray-100"
        :class="{
          'cursor-not-allowed opacity-50':
            selectedConnections.length !== 4 || isChecking,
        }"
        :disabled="selectedConnections.length !== 4 || isChecking"
        @click="$emit('submit')"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedConnections: {
    type: Array,
    default: () => [],
  },
  mistakes: {
    type: Number,
    default: 0,
  },
  isChecking: {
    type: Boolean,
    default: false,
  },
  isGameOver: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['shuffle', 'deselect-all', 'submit']);
</script>
