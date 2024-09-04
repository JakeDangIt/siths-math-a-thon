<template>

    <div v-if="leaderboardStore.isLoading || leaderboardStore.avatarLoading">
        <Skeleton class="mx-2 h-screen lg:w-1/2 lg:mx-auto"></Skeleton>
    </div>


    <div v-if="!leaderboardStore.isLoading && !leaderboardStore.avatarLoading" class="mx-2 lg:w-1/2">
        <Card>
            <CardHeader class="text-center mb-2">
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>(ordered by total number of correct answers)</CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col">
                <div class="flex items-end justify-center gap-2">
                    <LeaderboardTop3Icon v-for="(user, index) in leaderboardStore.top10.slice(0, 3)" :key="user.id"
                        :user="user" :index="index" :class="{
                            'order-2': index === 0,
                            'order-1': index === 1,
                            'order-3': index === 2
                        }" />
                </div>

                <Card>
                    <CardContent>
                        <div class="pt-2 lg:p-2 space-y-1">
                            <div class="flex items-center bg-slate-200 rounded-lg"
                                :class="user_id == user.uid ? 'border-slate-400 border-2' : ''"
                                v-for="(user, index) in leaderboardStore.top10.slice(3, 10)">

                                <p class="text-lg lg:text-2xl m-3 w-8 text-center">{{ index + 4 }}</p>

                                <p class="bg-slate-100 p-2 rounded-lg">
                                    <span class="lg:text-lg">{{ user.user_name }}</span>
                                    - {{ user.correct_answers }} points
                                </p>

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
const user = useSupabaseUser()
const user_id = computed(() => user.value?.id)
</script>
