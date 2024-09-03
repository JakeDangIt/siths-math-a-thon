<template>
    <div class="w-1/3">
        <div v-if="leaderboardStore.avatarLoading">
            <Skeleton :style="{ height: `${width < 1024 ? 250 : 400}px` }" />
        </div>
        <div v-if="!leaderboardStore.avatarLoading" class="flex items-center justify-center text-center rounded-t-2xl"
            :style="{ height: `${computedHeight}px` }" :class="bgColor">
            <div>
                <Avatar class="lg:h-20 lg:w-20">
                    <AvatarImage v-if="userAvatar" :src="userAvatar" />
                    <AvatarFallback class="text-[16px] lg:text-[24px]">{{ firstName[0] }}</AvatarFallback>
                </Avatar>
                <h1 class="text-[40px] lg:text-[60px]">{{ index }}</h1>
                <p class="lg:text-lg">{{ user.user_name }}</p>
                <p class="text-sm">{{ user.correct_answers }} points</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['user', 'index'])
const leaderboardStore = useLeaderboardStore()

const { width } = useWindowSize()

const user = ref(props.user)
const index = ref(props.index + 1)
const userAvatar = computed(() => leaderboardStore.top3Avatars[props.index])
const firstName = computed(() => {
    const [first] = user.value.user_name.split(' ');
    return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
});

const maxScore = computed(() => leaderboardStore.top3[0].correct_answers)
const minScore = computed(() => leaderboardStore.top3[2].correct_answers)
const scoreRange = computed(() => maxScore.value - minScore.value)

const computedHeight = computed(() => {
    // basically the percentage of how much higher the user is than the lowest score times the range (50px or 100px), with 200px or 300px as the minimum height
    const height = (((user.value.correct_answers - minScore.value) / scoreRange.value) * (width.value < 1024 ? 50 : 100)) + (width.value < 1024 ? 200 : 300)
    return height
})

const bgColor = computed(() => {
    switch (index.value) {
        case 1:
            return 'bg-gold'
        case 2:
            return 'bg-silver'
        case 3:
            return 'bg-bronze'
    }
})
</script>
