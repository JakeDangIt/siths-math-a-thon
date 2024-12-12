<template>
    <div class="flex items-center gap-2">
        <p>Mistakes Remaining:</p>
        <div class="flex gap-2">
            <span 
                v-for="i in 4 - mistakes" 
                :key="i" 
                class="w-4 h-4 rounded-full border bg-connections-dark-gray"
            ></span>
        </div>
    </div>
    <div class="flex gap-2">
        <Button variant="outline" class="bg-background border-black" @click="shuffle">Shuffle</Button>
        <Button variant="outline" class="bg-background border-black" @click="deselectAll">Deselect All</Button>
        <Button variant="outline" class="bg-background border-black">Submit</Button>
    </div>
</template>

<script setup>
const emit = defineEmits(['shuffle', 'deselectAll']);

const mistakes = ref(0);

function shuffle() {
    emit('shuffle');
}

function deselectAll() {
    emit('deselectAll');
}
</script>