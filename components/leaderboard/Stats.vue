<template>
    <div class="w-1/4">
        <Card v-for="week in leaderboardStore.userAnswers">
            <CardHeader>
                <CardTitle>Week {{week.correct_answers[0].week}}</CardTitle>
                <CardDescription>Your Results</CardDescription>
            </CardHeader>
            <CardContent>
                <p></p>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
const leaderboardStore = useLeaderboardStore()
</script>