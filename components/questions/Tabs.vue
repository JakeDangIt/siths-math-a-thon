<template>
  <div>
    <!-- skeleton for the question cards and button -->
    <div v-if="questionsStore.isLoading" class="mx-auto space-y-2 lg:w-2/3">
      <Skeleton class="mx-2 mb-4 h-10" />
      <Skeleton class="mx-2 h-32" />
      <Skeleton class="mx-2 h-32" />
      <Skeleton class="mx-2 h-10 w-36" />
    </div>

    <!-- tabs for the questions, if you switch tab, rerenders mathjax -->
    <Tabs
      :default-value="1"
      class="mx-2 md:mx-auto md:w-4/5 lg:mx-auto lg:w-2/3"
      :class="questionsStore.isLoading ? 'opacity-0' : ''"
      @update:model-value="onTabChange"
    >
      <!-- carousel for the tabs -->
      <Carousel class="relative mx-auto w-2/3">
        <CarouselContent>
          <!-- paired into week and its bonus -->
          <CarouselItem v-for="weekPair in presentWeekNames" :key="weekPair">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger :value="weekPair[0]">
                Week {{ weekPair[0] }}
              </TabsTrigger>
              <TabsTrigger :value="weekPair[1]">
                Week {{ weekPair[1] }}
              </TabsTrigger>
            </TabsList>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <!-- content for the tabs -->
      <TabsContent
        v-for="(_, index) in weekNames"
        :value="weekNames[index]"
        class="space-y-2"
      >
        <!-- week name and each question for that week -->
        <h1 class="my-2 text-center text-xl font-bold">
          Week {{ weekNames[index] }} Questions
        </h1>
        <QuestionsQuestionCard
          v-for="question in questionsStore.questionData
            .filter((question) => question.week == weekNames[index])
            .sort((a, b) => a.number - b.number)"
          :key="question.number"
          :question="question.number"
          :mathContent="question.content"
          :week="weekNames[index]"
        />

        <!-- preview answer -->
        <Sheet>
          <!-- scroll down button and preview answer button -->
          <div>
            <div
              class="fixed bottom-3 right-[0.9rem] flex items-center gap-2 transition-all lg:left-4 lg:right-auto"
              :class="
                isFarDownEnough
                  ? 'translate-x-[20rem] lg:translate-x-[-20rem]'
                  : 'translate-x-0'
              "
            >
              <Button aria-label="Scroll Down" @click="scrollDown()">
                <Icon
                  name="material-symbols:arrow-downward"
                  class="h-full w-6"
                ></Icon>
              </Button>
              <QuestionsAddQuestion
                v-if="roleStore.role == 'admin'"
                :week="weekNames[index]"
              />
              <!-- to save space, 'Answers' is omitted on mobile -->
              <SheetTrigger
                ><Button aria-label="Preview Answers"
                  >Preview {{ width > 1024 ? 'Answers' : '' }}</Button
                ></SheetTrigger
              >
            </div>

            <div
              class="fixed bottom-3 right-[0.9rem] flex items-center gap-2 transition-all lg:left-4 lg:right-auto"
              :class="
                isFarDownEnough
                  ? 'translate-x-0'
                  : 'translate-x-[14rem] lg:translate-x-[-14rem]'
              "
            >
              <Button aria-label="Scroll Up" @click="scrollUp()">
                <Icon
                  name="material-symbols:arrow-upward"
                  class="h-full w-6"
                ></Icon>
              </Button>
              <QuestionsAddQuestion
                v-if="roleStore.role == 'admin'"
                :week="weekNames[index]"
              />
            </div>
          </div>

          <!-- another preview button -->
          <SheetTrigger><Button aria-label="Preview Answers">Preview Answers</Button></SheetTrigger>

          <!-- preview answer content -->
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Your Answers</SheetTitle>
              <SheetDescription>
                Ensure your answers are correct before submitting
              </SheetDescription>
            </SheetHeader>

            <!-- another tabs, basically the same as the one outside -->
            <Tabs :default-value="weekNames[index]" class="mx-auto my-4">
              <TabsList class="mb-4 w-full">
                <Carousel class="relative mx-auto w-4/5">
                  <CarouselContent>
                    <!-- paired into week and its bonus -->
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

              <!-- each of the inputted answers, sorted by number, split into two columns on mobile -->
              <TabsContent
                v-for="(_, index) in weekNames"
                :value="weekNames[index]"
                class="grid grid-cols-2 lg:grid-cols-1"
              >
                <!-- each answer, sorted, with a remove button -->
                <div
                  v-for="answer in answersStore.answerData
                    .filter((answer) => answer.week == weekNames[index])
                    .sort((a, b) => a.question - b.question)"
                  class="group flex justify-between px-2 hover:bg-slate-200"
                >
                  <p>
                    <span class="font-bold">Q{{ answer.question }}.</span>
                    {{ answer.answer }}
                  </p>
                  <button aria-label="Remove Answer"
                    @click="removeAnswer(weekNames[index], answer.question)"
                    class="flex items-center opacity-0 transition-all group-hover:opacity-100"
                  >
                    <Icon
                      v-if="answer.answer !== ''"
                      name="material-symbols:cancel-outline"
                    ></Icon>
                  </button>
                </div>

                <!-- submit and save button -->
                <div
                  class="col-span-2 mt-12 grid w-full grid-cols-2 gap-2 lg:col-auto"
                >
                  <Button aria-label="Save Answers"
                    @click="saveAnswers()"
                    variant="secondary"
                    :disabled="
                      saveLoading ||
                      answersStore.answerData.length == 0 ||
                      !hasAnswersChanged
                    "
                    class="w-full"
                  >
                    Save Answers
                  </Button>
                  <Button aria-label="Submit Answers"
                    @click="
                      submitAnswers(
                        weekNames[index],
                        answersStore.answerData.filter(
                          (answer) => answer.week == weekNames[index]
                        )
                      )
                    "
                    :disabled="
                      submitLoading ||
                      answersStore.answerData.filter(
                        (answer) => answer.week == weekNames[index]
                      ).length == 0
                    "
                    class="w-full"
                  >
                    Submit Week
                    {{ weekNames[index] }}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup>
const answersStore = useAnswersStore();
const questionsStore = useQuestionsStore();
const toastStore = useToastStore();
const roleStore = useRoleStore();

const user = useSupabaseUser();

// track if answers have changed
const initialAnswers = ref([]);
const hasAnswersChanged = computed(() => {
  return (
    JSON.stringify(answersStore.answerData) !==
    JSON.stringify(initialAnswers.value)
  );
});

// window scroll and window size, used for scrolling down and checking if far down enough to put away the scroll and preview answer buttons
const { y } = useWindowScroll();
const { width } = useWindowSize();
const isFarDownEnough = ref(false);

const saveLoading = ref(false);
const submitLoading = ref(false);

// week names and grouped week names, used for the tabs
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

// function to rerender mathjax when tab changes, must be nexttick to wait for DOM to update
function onTabChange() {
  nextTick(() => {
    questionsStore.rerenderMathJax();
  });
}

// function to save answers, checks if user is logged in
async function saveAnswers() {
  saveLoading.value = true;
  if (user.value == null) {
    toastStore.changeToast('You must be logged in to save answers');
  } else if (answersStore.answerData.length == 0) {
    toastStore.changeToast('You must answer at least one question to save');
  } else {
    await answersStore.saveAnswers();
    initialAnswers.value = JSON.parse(JSON.stringify(answersStore.answerData));
    toastStore.changeToast('Answers saved', 'Your answers have been saved');
  }
  saveLoading.value = false;
}

// function to submit answers, checks if user is logged in
async function submitAnswers(week, answers) {
  submitLoading.value = true;
  if (user.value === null) {
    toastStore.changeToast('You must be logged in to submit answers');
  } else if (answers.every((answer) => answer.answer === '')) {
    toastStore.changeToast('You must answer at least one question to submit');
  } else {
    await answersStore.saveAnswers();
    await answersStore.submitAnswers(week, answers);
  }
  submitLoading.value = false;
}

// function to remove an answer from the store (not the input, which is done in the QuestionCard component)
function removeAnswer(week, question) {
  answersStore.removeAnswer(week, question);
}

// function to check if the user has scrolled far enough down to put away the scroll and preview answer buttons
function checkIsFarDownEnough() {
  if (document.body.scrollHeight - window.innerHeight * 1.5 > 0) {
    isFarDownEnough.value =
      y.value > document.body.scrollHeight - window.innerHeight * 1.5;
  }
}

// function to scroll down to the bottom of the page
function scrollDown() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
}

// function to scroll up to the top of the page
function scrollUp() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

// function to handle the beforeunload event, which triggers a confirmation dialog if the user has unsaved changes
function handleBeforeUnload(event) {
  if (hasAnswersChanged.value) {
    event.preventDefault();
    event.returnValue = ''; // This triggers the confirmation dialog
  }
}

onMounted(() => {
  // rerender mathjax when the questions are loaded
  if (questionsStore.questionData.length !== 0) {
    nextTick(() => {
      questionsStore.rerenderMathJax();
    });
  }

  // check if far down enough when the user scrolls
  watch(y, () => {
    checkIsFarDownEnough();
  });

  watch(
    () => answersStore.getAnswerLoading,
    () => {
      if (answersStore.answerData.length !== 0) {
        initialAnswers.value = JSON.parse(
          JSON.stringify(answersStore.answerData)
        );
      }
    },
    { immediate: true }
  );

  // event listener to check if the user has unsaved changes when they try to leave the page
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  // remove the event listener to avoid memory leaks
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>
