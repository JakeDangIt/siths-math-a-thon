<template>
  <!-- badge to show your top percentage if top 50% -->
  <div v-if="topPercentage">
    <div v-if="!leaderboardStore.placeLoading" class="flex items-center space-x-4">
      <Skeleton class="h-5 w-12 rounded-full" />
    </div>
    <div v-else>
      <Badge variant="secondary">
        <Icon name="material-symbols:trophy" class="mr-1 h-3 w-3" />
        {{ topPercentage }}
      </Badge>
    </div>
  </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore();

// percentage calculation
const topPercentage = computed(() => {
  const percentage = (leaderboardStore.userPlace / leaderboardStore.leaderboardData.length) * 10

  if (leaderboardStore.userPlace <= 10) {
    return useOrdinalPlace(leaderboardStore.userPlace) + ' Place';
  }
  else if (Math.ceil(percentage) * 10 < 50) {
    return 'Top ' + Math.ceil(
      percentage
    ) * 10 + '%';
  }
  else {
    return null;
  }
});
</script>
