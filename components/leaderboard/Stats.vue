<template>
  <!-- if submitted and checked, show all your stats in a table and graph -->
  <div v-if="hasSubmitted && answersHaveBeenChecked" class="mt-2 space-y-2 lg:mt-0 w-full md:w-4/5 lg:w-1/2 xl:w-2/5">
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Total Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="leaderboardStore.userAnswers.length == 0" class="space-y-1">
            <Skeleton class="h-6 w-1/2"></Skeleton>
            <Skeleton class="h-6 w-1/2"></Skeleton>
          </div>
          <div v-else>
            <LeaderboardStatsBarGraph />
            <p>
              {{ userPlace }}
              /
              {{ totalUsers }}
              contestants
            </p>
            <p>
              {{ correctPercentage }}
              % accuracy - 
              {{ leaderboardStore.numberOfCorrect }}/{{leaderboardStore.numberOfAnswered}}
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
    <!-- table of your answer data -->
    <Tabs v-else :default-value="1" class="mx-auto my-4">
      <TabsList class="mb-4 w-full">
        <Carousel class="mx-auto w-4/5" :opts="{
          align: 'start',
          slidesToScroll: 2,
        }">
          <CarouselContent>
            <CarouselItem v-for="week in presentWeekNames" class="basis-1/2 w-full" :key="week">
              <TabsList class="w-full">
                <TabsTrigger class="w-full" :value="week">
                  Week {{ week }}
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
          <TableCaption v-if="weeksAnswers(weekNames[index]).length > 1">Your answers for Week {{ weekNames[index] }}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead> Question Number </TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead>Submitted Answer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="weeksAnswers(weekNames[index]).length > 1"
              v-for="question in weeksAnswers(weekNames[index]).slice(0, -1)">
              <TableCell>{{ question.question }}</TableCell>
              <TableCell>{{
                formattedResponse(question.submittedAnswer, question.isCorrect)
              }}</TableCell>
              <TableCell>{{ question.submittedAnswer }}</TableCell>
            </TableRow>
            <TableRow v-if="weeksAnswers(weekNames[index]).length > 1">
              <TableCell>Total</TableCell>
              <TableCell></TableCell>
              <TableCell>{{
                weeksAnswers(weekNames[index]).at(-1).submittedAnswer
                }}</TableCell>
            </TableRow>
            <TableRow v-else>
              <TableCell colspan="3">No answers submitted for this set of questions</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  </div>

  <!-- message for when you did submit, but not checked, or just no submit -->
  <div v-else class="mt-2 space-y-2 md:w-4/5 lg:mt-0 lg:w-1/3">
    <Card>
      <CardHeader>
        <CardTitle>Total Statistics</CardTitle>
      </CardHeader>
      <CardContent v-if="leaderboardStore.answersLoading">
        <Skeleton class="h-6 w-1/2"></Skeleton>
      </CardContent>
      <CardContent v-else>
        <p v-if="!hasSubmitted">You have not submitted any answers yet.</p>
        <p v-else-if="!answersHaveBeenChecked">
          Please wait until your answers have been checked.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
const questionsStore = useQuestionsStore();
const leaderboardStore = useLeaderboardStore();

// if there is some answer, you've submited
const hasSubmitted = computed(() => leaderboardStore.userAnswers[0] != null);
// if there is some answer that has been checked, in that the correct answer is true/false, not null, you've been checked
const answersHaveBeenChecked = computed(() =>
  leaderboardStore.userAnswers.some((week) => week?.correct_answers !== null)
);

// week names for tabs
const weekNames = [1, '1 Bonus', 2, '2 Bonus', 3, '3 Bonus'];

const userPlace = computed(() => useOrdinalPlace(leaderboardStore.userPlace));
const totalUsers = computed(() => leaderboardStore.leaderboardData.length);
const correctPercentage = computed(() => ((leaderboardStore.numberOfCorrect / leaderboardStore.numberOfAnswered) * 100).toFixed(2));

// present week names, also for the tabs, just that it filters out the weeks that don't have any questions
const presentWeekNames = computed(() => {
  return weekNames.filter((week) => {
    return questionsStore.questionData.some(
      (question) => question.week == week
    );
  });
});

// function to get the answers for a week
function weeksAnswers(weekName) {
  const weekAnsweredQuestions =
    leaderboardStore.userAnswers
      .find((week) => week.correct_answers[0].week == weekName)
      ?.correct_answers.sort((a, b) => a.question - b.question) || [];

  const totalCorrect = weekAnsweredQuestions
    ? {
      question: 'Total',
      submittedAnswer: weekAnsweredQuestions.filter(
        (question) => question.isCorrect
      ).length,
      isCorrect: '',
    }
    : [];

  // last row is total, number of correct answers
  return [...weekAnsweredQuestions, totalCorrect];
}

// function to format the response for the table
function formattedResponse(submittedAnswer, isCorrect) {
  if (submittedAnswer == '') {
    return 'Omitted';
  } else if (isCorrect) {
    return 'Correct';
  } else if (!isCorrect) {
    return 'Incorrect';
  }
}
</script>
