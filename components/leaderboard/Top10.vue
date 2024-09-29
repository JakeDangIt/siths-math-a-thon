<template>
  <div class="mx-2 lg:w-1/2">
    <Card>
      <CardHeader class="mb-2 text-center">
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription
          >(ordered by total number of correct answers)</CardDescription
        >
      </CardHeader>
      <CardContent class="flex flex-col">
        <div class="flex items-end justify-center gap-2">
          <LeaderboardTop3Icon
            v-for="(user, index) in leaderboardStore.top10.slice(0, 3)"
            :key="user.id"
            :user="user"
            :index="index"
            :class="{
              'order-2': index === 0,
              'order-1': index === 1,
              'order-3': index === 2,
            }"
          />
        </div>

        <div class="space-y-1 pt-2 lg:p-2">
          <div
            class="flex items-center rounded-lg bg-slate-200 py-2"
            :class="user_id == user.uid ? 'border-2 border-slate-400' : ''"
            v-for="(user, index) in leaderboardStore.top10.slice(3, 10)"
          >
            <p class="m-2 w-6 text-center text-lg lg:text-2xl">
              {{ index + 4 }}
            </p>

            <p class="w-5/6 rounded-lg bg-slate-100 p-2 lg:w-auto">
              <span class="lg:text-lg">{{ user.user_name }}</span>
              - {{ user.correct_answers }} points
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore();
const user = useSupabaseUser();
const user_id = computed(() => user.value?.id);
</script>
