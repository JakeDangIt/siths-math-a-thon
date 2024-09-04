<template>
    <div class="flex justify-evenly">
        <LeaderboardTop10 />
        <LeaderboardStats v-if="user"/>
    </div>
</template>

<script setup>
const user = useSupabaseUser()
</script>