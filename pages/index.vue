<template>
  <div class="flex w-full flex-col items-center">
    <div class="space-y-6 lg:w-4/5 xl:w-3/5">
      <HomeBanner />
      <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <HomeDirections class="col-span-full" />
        <HomeMichaelsCause />
        <HomeWeekStatsLeaderboard class="h-full w-full lg:col-span-2" />
        <HomeProfileSummary class="h-full" />
        <!-- <HomeActivity />
        <HomeFeaturedProblem /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser();
</script>
