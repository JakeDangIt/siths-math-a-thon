<template>
  <button
    class="flex h-[80px] w-full items-center justify-center rounded-lg p-4 text-lg font-bold transition-colors duration-200"
    :class="{
      'border border-gray-300 bg-[#F7F7F6] hover:bg-[#E8E8E6]':
        !selectedConnections.includes(connection.id),
      'bg-[#666666] text-white hover:bg-[#777777]':
        selectedConnections.includes(connection.id),
      'cursor-pointer':
        selectedConnections.length < 4 ||
        selectedConnections.includes(connection.id),
      'animate-check':
        isChecking && selectedConnections.includes(connection.id),
      'animate-wrong': isWrong && selectedConnections.includes(connection.id),
    }"
    :style="{}"
    @click="handleClick"
    :disabled="
      (selectedConnections.length >= 4 &&
        !selectedConnections.includes(connection.id)) ||
      isChecking
    "
  >
    {{ connection.content }}
  </button>
</template>

<script setup>
const props = defineProps({
  connection: {
    type: Object,
    required: true,
  },
  selectedConnections: {
    type: Array,
    default: () => [],
  },
  isChecking: {
    type: Boolean,
    default: false,
  },
  isWrong: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

function handleClick() {
  if (
    props.selectedConnections.length < 4 ||
    props.selectedConnections.includes(props.connection.id)
  ) {
    emit('click', props.connection.id);
  }
}
</script>

<style scoped>
@keyframes checkAnimation {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes wrongAnimation {
  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  75% {
    transform: translateX(5px);
  }
}

.animate-check {
  animation: checkAnimation 0.5s ease-in-out forwards;
}

.animate-wrong {
  animation: wrongAnimation 0.5s ease-in-out forwards;
}
</style>
