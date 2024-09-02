<template>
    <div class="w-1/3 flex items-center justify-center text-center rounded-t-2xl" :style="{ height: `${computedHeight}px` }"
        :class="bgColor">
        <div>
            <h1 class="text-[80px]">{{ index }}</h1>
            <p class="text-lg">{{ user.user_name }}</p>
            <p>{{ user.correct_answers }} points</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['user', 'index'])
const leaderboardStore = useLeaderboardStore()

const user = ref(props.user)
const index = ref(props.index + 1)

const maxScore = computed(() => leaderboardStore.top3[0].correct_answers)
const minScore = computed(() => leaderboardStore.top3[2].correct_answers)
const scoreRange = computed(() => maxScore.value - minScore.value)

const computedHeight = computed(() => {
    // basically the percentage of how much higher the user is than the lowest score times the range (100px), with 300px as the minimum height
    const height = (((user.value.correct_answers - minScore.value) / scoreRange.value) * 100) + 300
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
        default:
            return 'bg-white'
    }
})
</script>
