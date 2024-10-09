<template>
  <div
    v-if="hasSubmitted && answersHaveBeenChecked"
    class="mx-2 mt-2 space-y-2 lg:mt-0 lg:w-1/3"
  >
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Total Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            v-if="leaderboardStore.userAnswers.length == 0"
            class="space-y-1"
          >
            <Skeleton class="h-6 w-1/2"></Skeleton>
            <Skeleton class="h-6 w-1/2"></Skeleton>
          </div>
          <div v-else>
            <LeaderboardStatsBarGraph />
            <p>
              {{ useOrdinalPlace(leaderboardStore.userPlace) }}/{{
                leaderboardStore.leaderboardData.length
              }}
              contestants
            </p>
            <p>
              {{
                (
                  (leaderboardStore.numberOfCorrect /
                    leaderboardStore.numberOfAnswered) *
                  100
                ).toFixed(2)
              }}% accuracy - {{ leaderboardStore.numberOfCorrect }}/{{
                leaderboardStore.numberOfAnswered
              }}
              correct answers
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-if="leaderboardStore.userAnswers.length == 0" class="space-y-2">
      <Skeleton class="h-9 w-full"></Skeleton>
      <Skeleton class="h-screen w-full"></Skeleton>
    </div>
    <Tabs v-else :default-value="1" class="mx-auto my-4">
      <TabsList class="mb-4 w-full">
        <Carousel class="relative mx-auto w-4/5">
          <CarouselContent>
            <CarouselItem
              v-for="(weekPair, index) in presentWeekNames"
              :key="index"
            >
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
          <TableCaption v-if="weeksAnswers(weekNames[index])"
            >Your answers for Week {{ weekNames[index] }}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead> Question Number </TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead>Submitted Answer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-if="weeksAnswers(weekNames[index])"
              v-for="question in weeksAnswers(weekNames[index])"
            >
              <TableCell>{{ question.question }}</TableCell>
              <TableCell>{{
                formattedResponse(question.submittedAnswer, question.isCorrect)
              }}</TableCell>
              <TableCell>{{ question.submittedAnswer }}</TableCell>
            </TableRow>
            <TableRow v-else>
              <TableCell colspan="3"
                >No answers submitted for this set of questions</TableCell
              >
            </TableRow>
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  </div>

  <div v-else class="mx-2 mt-2 space-y-2 lg:mt-0 lg:w-1/3">
    <Card>
      <CardHeader>
        <CardTitle>Total Statistics</CardTitle>
      </CardHeader>
      <CardContent v-if="!leaderboardStore.answersLoading">
        <p v-if="!hasSubmitted">You have not submitted any answers yet.</p>
        <p v-else-if="!answersHaveBeenChecked">
          Please wait until your answers have been checked.
        </p>
      </CardContent>
      <CardContent v-else>
        <Skeleton class="h-6 w-1/2"></Skeleton>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
const questionsStore = useQuestionsStore();
const leaderboardStore = useLeaderboardStore();

const hasSubmitted = computed(() => leaderboardStore.userAnswers[0] != null);
const answersHaveBeenChecked = computed(() =>
  leaderboardStore.userAnswers.some((week) => week?.correct_answers !== null)
);

const weekNames = [1, '1 Bonus', 2, '2 Bonus', 3, '3 Bonus'];
const groupedWeekNames = [
  [1, '1 Bonus'],
  [2, '2 Bonus'],
  [3, '3 Bonus'],
];

// present week names, also for the tabs, just that it filters out the weeks that don't have any questions
const presentWeekNames = computed(() => {
  return groupedWeekNames.filter((pair) => {
    return questionsStore.questionData.some(
      (question) => question.week == pair[0]
    );
  });
});

function weeksAnswers(weekName) {
  const weekAnsweredQuestions = leaderboardStore.userAnswers
    .find((week) => week.correct_answers[0].week == weekName)
    ?.correct_answers.sort((a, b) => a.question - b.question);
  const totalCorrect = {
    question: 'Total',
    submittedAnswer: weekAnsweredQuestions.filter(
      (question) => question.isCorrect
    ).length,
    isCorrect: '',
  };

  return [...weekAnsweredQuestions, totalCorrect];
}

function formattedResponse(submittedAnswer, isCorrect) {
  if (submittedAnswer == '') {
    return 'Omitted';
  } else if (isCorrect) {
    return 'Correct';
  } else if (isCorrect == '') {
    return '';
  } else {
    return 'Incorrect';
  }
}
</script>
