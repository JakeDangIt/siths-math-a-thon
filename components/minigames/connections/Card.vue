<template>
    <Button class="flex w-full justify-center items-center border border-gray-300 p-4">
        {{ connection.title }}
    </Button>
</template>

<script setup>
const props = defineProps(['connection']);
</script>
