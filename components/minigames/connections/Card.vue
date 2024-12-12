<template>
    <div>
        <Button
            class="flex w-full h-full aspect-square justify-center items-center border border-gray-300 p-4 bg-connections-gray text-black text-bold hover:bg-connections-gray"
            :class="{
                'bg-connections-dark-gray hover:bg-connections-dark-gray text-white': selectedConnections.includes(connection.id),
            }" @click="handleClick">
            {{ connection.title }}
        </Button>
    </div>
</template>

<script setup>
const props = defineProps({
    connection: Object,
    selectedConnections: Array,
});
const emit = defineEmits(['click']);

function handleClick() {
    emit('click', props.connection.id);
}
</script>
