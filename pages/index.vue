<template>
  <div class="flex w-full flex-col items-center">
    <div class="mx-2 space-y-6 lg:w-3/5">
      <HomeBanner />
      <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <HomeDirections class="col-span-full" />
        <HomeWeekStatsLeaderboard
          class="h-full w-full md:col-span-2 lg:col-span-1"
          :class="{ 'lg:row-span-2': user }"
        />
        <HomeActivity />
        <HomeFeaturedProblem />
        <HomeProfileSummary class="md:col-span-2 lg:col-span-2" />
      </div>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser();
</script>
