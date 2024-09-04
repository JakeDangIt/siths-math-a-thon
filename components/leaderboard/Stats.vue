<template>
    <div class="w-1/4">
        <Card>
            <CardHeader>
                <CardTitle>Total Statistics</CardTitle>
                <CardDescription>Your overall results</CardDescription>
            </CardHeader>
            <CardContent>
                Card Content
            </CardContent>
            <CardFooter>
                Card Footer
            </CardFooter>
        </Card>
        <Card v-for="week in leaderboardStore.userAnswers">
            <CardHeader>
                <CardTitle>Week {{ week.correct_answers[0].week }}</CardTitle>
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