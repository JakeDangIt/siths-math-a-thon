<script setup lang="ts">
import WeekStatsLeaderboard from '~/components/home/WeekStatsLeaderboard.vue';

</script>

<template>
    <div class="flex flex-col items-center w-full">
        <div class="lg:w-3/5 space-y-6">
            <HomeBanner />
            <!-- <HomeWeekStats class="lg:w-1/5" /> -->
            <div class="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <HomeDirections class="col-span-3" />
                <HomeWeekStatsLeaderboard />
            </div>
        </div>
    </div>
</template>