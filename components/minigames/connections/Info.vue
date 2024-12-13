<template>
    <div class="space-y-6">
        <div class="flex flex-col items-center gap-4">
            <p class="text-lg font-medium">Mistakes remaining:</p>
            <div class="flex gap-2">
                <span v-for="i in 4" :key="i" class="w-4 h-4 rounded-full"
                    :class="i <= (4 - mistakes) ? 'bg-[#666666]' : 'bg-[#E8E8E6]'"></span>
            </div>
        </div>

        <div class="flex flex-row gap-2 justify-center">
            <button
                class="px-6 py-2 rounded-full border-2 border-black hover:bg-gray-100 transition-colors duration-200 font-medium"
                :disabled="isChecking" :class="{ 'opacity-50 cursor-not-allowed': isChecking }"
                @click="$emit('shuffle')">
                Shuffle
            </button>
            <button
                class="whitespace-nowrap px-6 py-2 rounded-full border-2 border-black hover:bg-gray-100 transition-colors duration-200 font-medium"
                :class="{ 'opacity-50 cursor-not-allowed': selectedConnections.length < 1 || isChecking }"
                :disabled="selectedConnections.length < 1 || isChecking" @click="$emit('deselect-all')">
                Deselect All
            </button>
            <button
                class="px-6 py-2 rounded-full border-2 border-black hover:bg-gray-100 transition-colors duration-200 font-medium"
                :class="{ 'opacity-50 cursor-not-allowed': selectedConnections.length !== 4 || isChecking }"
                :disabled="selectedConnections.length !== 4 || isChecking" @click="$emit('submit')">
                Submit
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    selectedConnections: {
        type: Array,
        default: () => []
    },
    mistakes: {
        type: Number,
        default: 0
    },
    isChecking: {
        type: Boolean,
        default: false
    }
});

defineEmits(['shuffle', 'deselect-all', 'submit']);
</script>