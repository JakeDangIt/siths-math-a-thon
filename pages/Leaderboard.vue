<template>
    <div>
        <div v-if="leaderboardStore.isLoading || leaderboardStore.avatarLoading" class="w-full flex justify-evenly">
            <Skeleton class="mx-2 h-screen w-full lg:w-1/2"></Skeleton>
            <Skeleton v-if="user || leaderboardStore.userAnswers.length == 0" class="mx-2 h-screen w-full lg:w-1/3">
            </Skeleton>
        </div>

        <div v-if="!leaderboardStore.isLoading && !leaderboardStore.avatarLoading"
            class="flex flex-col lg:flex-row justify-evenly">
            <LeaderboardTop10 v-if="(user && leaderboardStore.userAnswers.length > 0) || (!user)" />
            <LeaderboardStats v-if="user" />
        </div>
    </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore()
const user = useSupabaseUser()
</script>