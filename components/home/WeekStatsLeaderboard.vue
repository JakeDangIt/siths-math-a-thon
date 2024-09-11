<template>
    <div class="">
        <Card class="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <CardHeader>
                <CardTitle class="text-center">Your Stats & Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="mb-6 flex justify-evenly">
                    <div class="text-center">
                        <p class="text-2xl font-bold">{{ordinalPlace(leaderboardStore.userPlace)}}</p>
                        <p class="text-sm text-muted-foreground">place</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold">{{leaderboardStore.numberOfCorrect}}</p>
                        <p class="text-sm text-muted-foreground">Points</p>
                    </div>
                </div>
                <div class="space-y-4">
                    <div v-for="(avatar, index) in leaderboardStore.top3Avatars" class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <Avatar>
                                <AvatarImage :src="avatar.image" draggable="false"></AvatarImage>
                                <AvatarFallback class="text-lg">{{ firstName[0] }}</AvatarFallback>
                            </Avatar>
                            <span>{{avatar.name}}</span>
                        </div>
                        <span>{{leaderboardStore.top10[index].correct_answers}} pts</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore()
const avatarStore = useAvatarStore()
const user = useSupabaseUser()

const name = computed(() => user.value?.user_metadata?.name || '')
const firstName = computed(() => {
    const [first] = name.value.split(' ');
    return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
});

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