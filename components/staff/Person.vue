<template>
    <Card class="px-8 py-4 h-1/2">
        <h1 class="font-bold text-2xl">{{ person.name }}</h1>
        <Separator />
        <p class="text-gray-600">{{ person.title }}</p>
        <p class="text-gray-600">Email: {{ person.email }}</p>
    </Card>
</template>

<script setup>
const props = defineProps(['person'])
const person = props.person
</script>