<template>
    <div class="w-full max-w-2xl mx-auto px-4 py-8">
        <h1 class="text-2xl md:text-3xl font-bold text-center mb-8">
            Create four groups of four!
        </h1>

        <TransitionGroup tag="div" name="list" class="relative grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-8">
            <!-- Completed Groups -->
            <div v-for="group in foundGroups" :key="group.id"
                class="col-span-2 md:col-span-4 h-[80px] flex items-center justify-center p-2 rounded-lg text-center transition-all duration-500 group-pop"
                :class="getGroupColor(group.index)">
                <div>
                    <h3 class="font-bold text-xl mb-1">{{ group.title }}</h3>
                    <p>{{ group.items.join(', ') }}</p>
                </div>
            </div>

            <!-- Active Game Cards -->
            <MinigamesConnectionsCard v-for="connection in connections" :key="connection.id" :connection="connection"
                :selectedConnections="selectedConnections" :isChecking="isChecking" :isWrong="isWrong"
                @click="handleClick" />
        </TransitionGroup>

        <div class="flex flex-col items-center gap-3">
            <MinigamesConnectionsInfo :selectedConnections="selectedConnections" :mistakes="mistakes" @shuffle="shuffle"
                :isChecking="isChecking" :isGameOver="isGameOver" @deselect-all="deselectAll" @submit="submitGuess" />

            <MinigamesConnectionsEndingScreen v-if="isGameOver" :foundGroups="foundGroups" :connections="allConnections"
                :isGameOver="isGameOver" :mistakes="mistakes" :guessHistory="guessHistory" />
        </div>
    </div>
</template>

<script setup>
import { connections as allConnections } from '~/utils/connections';

const connections = ref([...allConnections]);
const selectedConnections = ref([]);
const mistakes = ref(0);
const foundGroups = ref([]);
const guessHistory = ref([]);
const isChecking = ref(false);
const isWrong = ref(false);

const isGameOver = computed(() => foundGroups.value.length === 4 || mistakes.value >= 4);

function getGroupColor(index) {
    const colors = {
        0: 'bg-[#F7DA21] text-black',
        1: 'bg-[#92C13D] text-black',
        2: 'bg-[#7BA4DB] text-black',
        3: 'bg-[#B87AA3] text-black',
    };
    return colors[index] || '';
}

function handleClick(id) {
    if (selectedConnections.value.includes(id)) {
        selectedConnections.value = selectedConnections.value.filter(
            (connection) => connection !== id
        );
    } else if (selectedConnections.value.length < 4) {
        selectedConnections.value.push(id);
    }
}

function shuffle() {
    connections.value = [...connections.value].sort(() => Math.random() - 0.5);
}

function deselectAll() {
    selectedConnections.value = [];
}

async function submitGuess() {
    if (selectedConnections.value.length !== 4) return;

    isChecking.value = true; // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const selectedItems = connections.value.filter(item =>
        selectedConnections.value.includes(item.id)
    );

    const allSameGroup = selectedItems.every(item =>
        item.group === selectedItems[0].group
    );

    guessHistory.value.push({
        items: selectedItems.map(item => item.content),
        isCorrect: allSameGroup,
    });

    if (allSameGroup) {
        const groupIndex = selectedItems[0].group - 1;
        connections.value = connections.value.filter(item =>
            !selectedConnections.value.includes(item.id)
        );
        await new Promise(resolve => setTimeout(resolve, 500));
        foundGroups.value.push({
            id: Date.now(),
            index: groupIndex,
            title: selectedItems[0].groupTitle,
            items: selectedItems.map(item => item.content)
        });

        selectedConnections.value = [];
    } else {
        isWrong.value = true;
        await new Promise(resolve => setTimeout(resolve, 800));
        isWrong.value = false;
        mistakes.value++;
    }

    isChecking.value = false;
}
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}

@keyframes popIn {
    0% {
        transform: scale(1.1);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}

.group-pop {
    animation: popIn 0.3s ease-out;
}
</style>