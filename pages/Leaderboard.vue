<template>
    <div>
        <div v-if="leaderboardStore.isLoading || leaderboardStore.avatarLoading" class="w-full flex justify-evenly">
            <Skeleton class="mx-2 h-screen w-full lg:w-1/2"></Skeleton>
        </div>

        <div v-if="!leaderboardStore.isLoading && !leaderboardStore.avatarLoading" class="flex justify-evenly">
            <LeaderboardTop10 />
            <LeaderboardStats v-if="user" />
        </div>
    </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore()
const user = useSupabaseUser()
</script>