<script setup lang="ts">
</script>

<template>
    <div class="flex flex-col items-center w-full">
        <div class="lg:w-3/5">
            <HomeBanner />
            <!-- <HomeWeekStats class="lg:w-1/5" /> -->
            <div class="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <HomeDirections class="col-span-3" />
                <HomeDirections />
                <HomeDirections />
            </div>
        </div>
    </div>
</template>