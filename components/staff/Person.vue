<template>
  <Card class="p-4 md:p-6">
    <h1 class="text-2xl font-bold">{{ person.name }}</h1>
    <Separator />
    <p class="text-gray-600">{{ person.title }}</p>
    <p v-if="person.email" class="text-gray-600">Email: {{ person.email }}</p>
  </Card>
</template>

<script setup>
const props = defineProps(['person']);
const person = props.person;
</script>
