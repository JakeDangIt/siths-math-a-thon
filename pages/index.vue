<template>
  <div class="flex w-full flex-col items-center">
    <div class="space-y-4 lg:w-4/5 xl:w-3/5">
      <!-- Banner -->
      <HomeBanner />

      <!-- Help Button for Instructions -->
      <HomeDirections />

      <!-- Main Content Grid -->
      <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <!-- Featured Problem - Hero Section -->
        <div class="md:col-span-2 lg:col-span-2">
          <HomeFeaturedProblem class="h-full" />
        </div>

        <!-- Profile Summary - Right sidebar -->
        <HomeProfileSummary class="h-full" />

        <!-- Charity and Leaderboard Row -->
        <HomeMichaelsCause class="h-full" />
        <HomeWeekStatsLeaderboard class="h-full md:col-span-1 lg:col-span-2" />

        <!-- Announcements - Full width but condensed -->
        <HomeAnnouncements class="md:col-span-2 lg:col-span-3" />
      </div>
    </div>
  </div>
</template>
