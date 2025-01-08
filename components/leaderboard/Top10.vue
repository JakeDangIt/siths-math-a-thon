<template>
  <!-- top 10 on leaderboard -->
  <Card class="w-full md:w-4/5 lg:w-1/2 xl:w-2/5">
    <CardHeader class="mb-2 text-center">
      <CardTitle>Leaderboard</CardTitle>
      <CardDescription>(ordered by total number of correct answers)</CardDescription>
    </CardHeader>
    <CardContent v-if="leaderboardStore.leaderboardData.length > 0" class="flex flex-col">
      <div class="flex items-end justify-center gap-2">
        <LeaderboardTop3Icon v-for="(user, index) in leaderboardStore.top10.slice(0, 3)" :key="user.id" :user="user"
          :index="index" :class="{
            'order-2': index === 0,
            'order-1': index === 1,
            'order-3': index === 2,
          }" />
      </div>

      <!-- user data -->
      <div class="space-y-1 pt-2 lg:p-2">
        <div class="flex items-center rounded-lg bg-slate-200 py-2"
          :class="user_id == user.uid ? 'border-2 border-slate-400' : ''"
          v-for="(user, index) in leaderboardStore.top10.slice(3, 10)">
          <p class="m-2 w-6 text-center text-lg lg:text-2xl">
            {{ index + 4 }}
          </p>

          <p class="w-5/6 rounded-lg bg-slate-100 p-2 lg:w-auto">
            <span class="lg:text-lg">{{ user.user_name }}</span>
            - {{ user.total_points }} points
          </p>
        </div>
      </div>
    </CardContent>
    <CardContent v-else class="text-center p-8">
      <p class="text-xl mb-4">No leaderboard data available yet.</p>
      <p>The leaderboard will be updated once the contest begins and participants start submitting their answers.</p>
    </CardContent>
  </Card>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore();
const user = useSupabaseUser();
const user_id = computed(() => user.value?.id);
</script>
