<template>
    <div v-if="leaderboardStore.isLoading">
        <Skeleton class="h-screen w-screen" />
    </div>
    <div v-else class="mx-2 lg:w-2/3 lg:mx-auto">
        <Card>
            <CardHeader class="text-center">
                <CardTitle>Top 3 Contestants</CardTitle>
                <CardDescription>(ordered by total number of correct answers)</CardDescription>
            </CardHeader>
            <CardContent class="flex items-end justify-center gap-2">
                <LeaderboardTop3Icon v-for="(user, index) in leaderboardStore.top3" :key="user.id" :user="user"
                    :index="index" :class="{
                        'order-2': index === 0,
                        'order-1': index === 1,
                        'order-3': index === 2
                    }" />
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore()
</script>
