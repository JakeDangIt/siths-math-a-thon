<template>

    <div v-if="hasSubmitted" class="mx-2 mt-2 lg:mt-0 lg:w-1/3 space-y-2">
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Total Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div v-if="leaderboardStore.userAnswers.length == 0" class="space-y-1">
                        <Skeleton class="w-1/2 h-6"></Skeleton>
                        <Skeleton class="w-1/2 h-6"></Skeleton>
                    </div>
                    <div v-else>
                        <p>{{ ordinalPlace(leaderboardStore.userPlace) }}/{{ leaderboardStore.leaderboardData.length }}
                            contestants</p>
                        <p>{{ (numberOfCorrect / numberOfAnswered * 100).toFixed(2) }}% accuracy - {{ numberOfCorrect
                            }}/{{
                                numberOfAnswered }} correct answers</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div v-if="leaderboardStore.userAnswers.length == 0" class="space-y-2">
            <Skeleton class="w-full h-9"></Skeleton>
            <Skeleton class="w-full h-screen"></Skeleton>
        </div>
        <Tabs v-else :default-value="1" class="mx-auto my-4">
            <TabsList class="w-full mb-4">
                <Carousel class="relative w-4/5 mx-auto">
                    <CarouselContent>

                        <CarouselItem v-for="(weekPair, index) in presentWeekNames" :key="index">
                            <TabsList class="grid w-full grid-cols-2">
                                <TabsTrigger :value="weekPair[0]">
                                    <p>Week {{ weekPair[0] }}</p>
                                </TabsTrigger>
                                <TabsTrigger :value="weekPair[1]">
                                    <p>Week {{ weekPair[1] }}</p>
                                </TabsTrigger>
                            </TabsList>
                        </CarouselItem>
                        
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </TabsList>

            <TabsContent v-for="(_, index) in weekNames" :value="weekNames[index]">
                <Table>
                    <TableCaption v-if="weeksAnswers(weekNames[index])">Your answers for Week {{ weekNames[index] }}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                Question Number
                            </TableHead>
                            <TableHead>Accuracy</TableHead>
                            <TableHead>Submitted Answer</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-if="weeksAnswers(weekNames[index])"
                            v-for="question in weeksAnswers(weekNames[index])">
                            <TableCell>{{ question.questionNumber }}</TableCell>
                            <TableCell>{{ question.submittedAnswer == '' ? 'Omitted' :
                                question.isCorrect ? 'Correct' : 'Incorrect' }}</TableCell>
                            <TableCell>{{ question.submittedAnswer }}</TableCell>
                        </TableRow>
                        <TableRow v-else>
                            <TableCell colspan="3">No answers submitted for this set of questions</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TabsContent>
        </Tabs>
    </div>

    <div v-else class="mx-2 mt-2 lg:w-1/3">
        <Card>
            <CardHeader>
                <CardTitle>Total Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You have not submitted any answers yet</p>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
const questionsStore = useQuestionsStore()
const leaderboardStore = useLeaderboardStore()
const user = useSupabaseUser()

const hasSubmitted = computed(() => leaderboardStore.userAnswers[0] != null)

const weekNames = [1, '1 Bonus', 2, '2 Bonus', 3, '3 Bonus']
const groupedWeekNames = [[1, '1 Bonus'], [2, '2 Bonus'], [3, '3 Bonus']]

// present week names, also for the tabs, just that it filters out the weeks that don't have any questions
const presentWeekNames = computed(() => {
    return groupedWeekNames.filter((pair) => {
        return questionsStore.questionData.some((question) => question.week == pair[0])
    })
})

const user_id = computed(() => user.value?.id)
const numberOfCorrect = computed(() => leaderboardStore.leaderboardData.find((user) => user.uid == user_id.value)?.correct_answers)
const numberOfAnswered = computed(() => leaderboardStore.userAnswers.reduce((sum, week) => sum + week.correct_answers.length, 0));

function weeksAnswers(weekName) {
    return leaderboardStore.userAnswers
        .find((week) => week.correct_answers[0].week == weekName)?.correct_answers
        .sort((a, b) => a.questionNumber - b.questionNumber)
}

// function to get the ordinal place, if 11th, 12th, or 13th, return the number with th
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