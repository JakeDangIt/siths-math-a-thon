<template>
  <!-- badge to show your top percentage if top 50% -->
  <div v-if="!leaderboardStore.placeLoading && topPercentage < 50">
    <Badge variant="secondary">
      <Icon name="material-symbols:trophy" class="mr-1 h-3 w-3" />
      Top {{ topPercentage }}%
    </Badge>
  </div>
  <div v-else class="flex items-center space-x-4">
    <Skeleton class="h-5 w-12 rounded-full" />
  </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore();

// percentage calculation
const topPercentage = computed(() => {
  return Math.ceil(
    (leaderboardStore.userPlace / leaderboardStore.leaderboardData.length) * 10
  ) * 10;
});
</script>
