<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-2xl w-full">
        <h2 class="text-2xl font-bold mb-4">
          {{ foundGroups.length === 4 ? 'Congratulations!' : 'Game Over' }}
        </h2>
        <p class="text-xl mb-4">
          {{ foundGroups.length === 4 ? 'You found all the groups!' : 'Better luck next time!' }}
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div v-for="group in allGroups" :key="group" class="bg-gray-100 p-4 rounded">
            <h3 class="font-bold mb-2">{{ group.charAt(0).toUpperCase() + group.slice(1) }}</h3>
            <ul>
              <li v-for="connection in connectionsInGroup(group)" :key="connection.id">
                {{ connection.content }}
              </li>
            </ul>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Play Again
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    foundGroups: {
      type: Array,
      required: true
    },
    connections: {
      type: Array,
      required: true
    }
  });
  
  const allGroups = computed(() => {
    return [...new Set(props.connections.map(connection => connection.group))];
  });
  
  function connectionsInGroup(group) {
    return props.connections.filter(connection => connection.group === group);
  }
  
  defineEmits(['close']);
  </script>