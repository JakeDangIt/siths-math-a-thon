<template>
    <Dialog :defaultOpen="true">
        <DialogTrigger>
            <button
                class="px-6 py-2 rounded-full border-2 border-black hover:bg-gray-100 transition-colors duration-200 font-medium">
                See Results
            </button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-md">
            <DialogHeader>
                <div class="flex flex-col items-center text-center">
                    <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                        <StarIcon class="w-8 h-8 text-white" />
                    </div>
                    <DialogTitle class="text-2xl font-bold mb-6">
                        {{ getCompletionMessage }}
                    </DialogTitle>
                </div>
            </DialogHeader>

            <div class="flex flex-col items-center">
                <h3 class="text-lg text-center font-bold mb-2">Guess History</h3>
                <div>
                    <div v-for="(guess, index) in guessHistory" :key="index" class="flex gap-1">
                        <div v-for="item in guess.items" :key="item" class="w-10 h-10 rounded text-center"
                            :class="getGroupColor(connections.find((guess) => guess.content == item).group - 1)"></div>
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
    isGameOver: Boolean
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