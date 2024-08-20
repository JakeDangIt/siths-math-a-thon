<template>
    <div class="flex justify-center mt-12">
        <StaffPerson v-for="person in staff" :key="person.name" :person="person" />
    </div>
</template>

<script setup>

</script>