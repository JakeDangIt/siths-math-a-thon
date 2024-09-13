<template>
    <div class="w-full h-full">
        <Card class="h-full" v-if="leaderboardStore.top3Avatars.length == 3">
            <CardHeader>
                <CardTitle class="text-center">
                    <span v-if="user && leaderboardStore.userPlace">Your Stats & </span>Leaderboard
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div v-if="user && leaderboardStore.userPlace" class="mb-6 flex justify-evenly">
                    <div class="text-center">
                        <p class="text-2xl font-bold">{{ ordinalPlace(leaderboardStore.userPlace) }}</p>
                        <p class="text-sm text-muted-foreground">place</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold">{{ leaderboardStore.numberOfCorrect }}</p>
                        <p class="text-sm text-muted-foreground">Points</p>
                    </div>
                </div>
                <div class="space-y-4">
                    <div v-for="(avatar, index) in leaderboardStore.top3Avatars" :key="index" class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <Avatar>
                                <AvatarImage v-if="avatar?.image" :src="avatar?.image" draggable="false"></AvatarImage>
                                <AvatarFallback class="text-lg">{{ firstName(avatar?.name ?? ' ')[0] }}</AvatarFallback>
                            </Avatar>
                            <span>{{ avatar?.name ?? '' }}</span>
                        </div>
                        <span>{{ leaderboardStore.top10[index]?.correct_answers ?? 0 }} pts</span>
                    </div>
                </div>
            </CardContent>
        </Card>
        <div v-else class="flex w-full h-full">
            <Skeleton class="h-full w-full" />
        </div>
    </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore();
const user = useSupabaseUser()

const firstName = (user) => {
    const [first] = user.split(' ');
    return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
};

function ordinalPlace(place) {
    const onesDigit = place % 10,
        specialNotTeens = place % 100;
    if (onesDigit == 1 && specialNotTeens != 11) {
        return place + "st";
    }
    if (onesDigit == 2 && specialNotTeens != 12) {
        return place + "nd";
    }
    if (onesDigit == 3 && specialNotTeens != 13) {
        return place + "rd";
    }
    return place + "th";
}
</script>