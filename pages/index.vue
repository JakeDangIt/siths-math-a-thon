<template>
    <div class="flex flex-col items-center w-full">
        <div class="lg:w-3/5 space-y-6 mx-2">
            <HomeBanner />
            <div class="w-full grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <HomeDirections class="col-span-full" />
                <HomeWeekStatsLeaderboard class="md:col-span-2 lg:col-span-1 w-full h-full" :class="{'lg:row-span-2': user}" />
                <HomeActivity />
                <HomeFeaturedProblem />
                <HomeProfileSummary class="md:col-span-2 lg:col-span-2"/>
            </div>
        </div>
    </div>
</template>

<script setup>
	const user = useSupabaseUser()
</setup>