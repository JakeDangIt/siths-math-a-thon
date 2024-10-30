<template>
  <div>
    <div v-if="leaderboardStore.isLoading || leaderboardStore.avatarLoading"
      class="flex flex-col justify-center items-center lg:items-start lg:flex-row">
      <Skeleton class="h-screen lg:w-1/2"></Skeleton>
      <Skeleton v-if="user && leaderboardStore.userAnswers.length == 0" class="h-screen w-full lg:w-1/3">
      </Skeleton>
    </div>

    <div v-else class="flex flex-col gap-4 justify-center items-center lg:items-start lg:flex-row">
      <LeaderboardTop10 />
      <LeaderboardStats v-if="user" />
    </div>
  </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore();
const user = useSupabaseUser();
</script>
