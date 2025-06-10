<template>
  <div
    v-if="leaderboardStore.leaderboardData.length != 0"
    class="h-full w-full"
  >
    <Card v-if="leaderboardStore.top3Avatars.length != 3">
      <Skeleton class="h-60 w-full" />
    </Card>

    <!-- card for the top 3 leaderboard -->
    <Card class="h-full" v-else>
      <CardHeader>
        <CardTitle class="text-center">
          <span v-if="user && leaderboardStore.userPlace">Your Stats & </span
          >Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          v-if="user && leaderboardStore.userPlace"
          class="mb-6 flex justify-evenly"
        >
          <div class="text-center">
            <p class="text-2xl font-bold">
              {{ useOrdinalPlace(leaderboardStore.userPlace) }}
            </p>
            <p class="text-sm text-muted-foreground">place</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold">
              {{ leaderboardStore.numberOfCorrect }}
            </p>
            <p class="text-sm text-muted-foreground">Points</p>
          </div>
        </div>
        <div class="space-y-2">
          <div
            v-for="(avatar, index) in leaderboardStore.top3Avatars"
            :key="index"
            class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2"
          >
            <div class="flex items-center space-x-2">
              <Avatar>
                <Avatar class="text-lg">{{
                  useFirstName(avatar?.name ?? ' ')[0]
                }}</Avatar>
              </Avatar>
              <span>{{ avatar?.name ?? '' }}</span>
            </div>
            <span
              >{{ leaderboardStore.top10[index]?.total_points ?? 0 }} pts</span
            >
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore();
const user = useSupabaseUser();
</script>
