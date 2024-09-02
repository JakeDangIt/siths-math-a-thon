<template>
    <div>
        <Skeleton v-if="leaderboardStore.isLoading || leaderboardStore.avatarLoading" class="mx-2 h-screen lg:w-2/3 lg:mx-auto"></Skeleton>
    </div>
    <div v-if="!leaderboardStore.isLoading || !leaderboardStore.avatarLoading" class="mx-2 lg:w-2/3 lg:mx-auto">
        <Card>
            <CardHeader class="text-center">
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>(ordered by total number of correct answers)</CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col">
                <div class="flex items-end justify-center gap-2">
                    <LeaderboardTop3Icon v-for="(user, index) in leaderboardStore.top3" :key="user.id" :user="user"
                        :index="index" :class="{
                            'order-2': index === 0,
                            'order-1': index === 1,
                            'order-3': index === 2
                        }" />
                </div>

                <Card>
                    <CardContent>
                        <div class="pt-2 lg:p-6 space-y-2">
                            <div class="flex items-center bg-slate-200 rounded-lg" v-for="(user, index) in leaderboardStore.top10">
                                <p class="text-lg lg:text-xl m-3 w-6 text-center">{{ index + 4 }}</p>
                                <p><span class="lg:text-lg">{{ user.user_name }}</span> - {{ user.correct_answers }} points</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore()
</script>
