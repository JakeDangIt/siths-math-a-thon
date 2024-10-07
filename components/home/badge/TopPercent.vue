<template>
  <div v-if="!leaderboardStore.placeLoading">
    <Badge variant="secondary">
      <Icon name="material-symbols:trophy" class="mr-1 h-3 w-3" />
      Top
      {{
        Math.ceil(
          (leaderboardStore.userPlace /
            leaderboardStore.leaderboardData.length) *
          10
        ) * 10
      }}%
    </Badge>
  </div>
  <div v-else class="flex items-center space-x-4">
    <Skeleton class="h-5 w-12 rounded-full" />
  </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore();
</script>
