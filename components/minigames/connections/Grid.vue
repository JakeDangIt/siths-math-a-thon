<template>
    <div class="list w-1/4 mx-auto flex flex-col items-center">
        <TransitionGroup tag="div" name="list" class="list w-full grid grid-cols-4 gap-4">
            <MinigamesConnectionsCard
                v-for="(connection, index) in connections"
                :key="connection.id"
                :connection="connection"
                :selected-connections="selectedConnections"
                @click="handleClick"
            />
        </TransitionGroup>
        <MinigamesConnectionsInfo
            :selected-connections="selectedConnections"
            @shuffle="shuffle"
            @deselectAll="deselectAll"
        />
    </div>
</template>

<script setup>
import { connections as allConnections } from '~/utils/connections';

const connections = ref([...allConnections]);
const selectedConnections = ref([]);

function handleClick(id) {
    if (selectedConnections.value.includes(id)) {
        selectedConnections.value = selectedConnections.value.filter((connection) => connection !== id);
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
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}
</style>
