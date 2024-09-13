<template>
    <div>
        <Badge variant="secondary">
            <Icon name="material-symbols:trophy" class="mr-1 h-3 w-3" />
            Top
            {{ Math.ceil((leaderboardStore.userPlace / leaderboardStore.leaderboardData.length) * 10) * 10 }}%
        </Badge>
    </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore()
</script>