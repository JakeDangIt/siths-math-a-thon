<template>
  <!-- skeleton for the question cards and button -->
  <div v-if="questionsStore.isLoading || !mathJaxLoaded" class="mx-auto space-y-2 lg:w-2/3">
    <Skeleton class="mb-4 h-10" />
    <Skeleton class="h-32" />
    <Skeleton class="h-32" />
    <Skeleton class="h-10 w-36" />
  </div>

  <!-- tabs for the questions, if you switch tab, rerenders mathjax -->
  <Tabs v-else :default-value="Number(timeStore.currentWeek)" class="md:mx-auto md:w-4/5 lg:mx-auto lg:w-2/3"
    @update:model-value="onTabChange">
    <div class="flex flex-col gap-2 md:flex-row">
      <NuxtLink to="/minigames" class="flex w-fit">
        <Button variant="secondary" class="border border-slate-500">
          <span>Minigames</span>
        </Button>
      </NuxtLink>
      <!-- carousel for the tabs -->
      <Carousel v-if="questionsStore.questionData.length > 0" class="mx-auto w-2/3" :opts="{
        align: 'start',
        slidesToScroll: 2,
        startIndex: weekNames.findIndex(
          (week) => week == timeStore.currentWeek
        ),
      }">
        <CarouselContent>
          <!-- paired into week and its bonus -->
          <CarouselItem v-for="week in presentWeekNames" class="w-full basis-1/2" :key="week">
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

      <div v-else>
        <h2 class="mb-4 text-2xl font-bold">Contest Starts In:</h2>
        <div class="countdown font-mono mb-6 text-4xl">
          <span>{{ countdown.days }}</span> Days
          <span>{{ countdown.hours }}</span> Hours
          <span>{{ countdown.minutes }}</span> Minutes
          <span>{{ countdown.seconds }}</span> Seconds
        </div>
        <p class="text-xl">Questions will be available on January 28, 2025.</p>
      </div>
    </div>

    <!-- content for the tabs -->
    <TabsContent v-for="(_, index) in weekNames" :value="weekNames[index]" class="space-y-2">
      <div v-if="
        timeStore.timeRemainings.find((time) =>
          time.week.includes(String(weekNames[index]).includes('Bonus')
            ? `${Number(String(weekNames[index]).replace('Bonus', '')) + 1} Bonus`
            : `${weekNames[index] + 1}`)
        ).timeRemaining < 0
        || roleStore.role !== 'member'
      ">
        <!-- week name and each question for that week -->
        <h1 class="my-2 text-center text-2xl font-bold">
          Week {{ weekNames[index] }} Questions
          <QuestionsClock :week="weekNames[index]" />
        </h1>

        <QuestionsQuestionCard class="flex flex-col gap-2" v-for="question in questionsStore.questionData
          .filter((question) => question.week == weekNames[index])
          .sort((a, b) => a.number - b.number)" :key="question.number" :question="question.number"
          :mathContent="question.content" :extraInfo="question.extraInfo" :week="weekNames[index]"
          :imageUrl="question.imageUrl" :points="question.points" />

        <!-- preview answer -->
        <Sheet>
          <!-- scroll down button and preview answer button -->
          <TransitionGroup tag="div" name="fade" class="buttons">
            <div :class="isFarDownEnough
              ? 'translate-x-[20rem] lg:translate-x-[-20rem]'
              : 'translate-x-0'
              " key="scroll-down"
              class="fixed bottom-3 right-[0.9rem] flex items-center gap-2 transition-all lg:left-4 lg:right-auto z-20 translate-x-0">
              <Button aria-label="Scroll Down" @click="scrollDown()">
                <Icon name="material-symbols:arrow-downward" class="h-full w-6"></Icon>
              </Button>
              <QuestionsAddQuestion v-if="roleStore.role == 'admin'" :week="weekNames[index]" />
              <SheetTrigger>
                <Button aria-label="Preview Answers">Preview {{ width > 1024 ? 'Answers' : '' }}</Button>
              </SheetTrigger>
              <Button variant="secondary" v-if="hasAnswersChanged" @click="saveAnswers">Save {{ width > 1024 ? 'Answers' : '' }}</Button>
            </div>

            <div :class="isFarDownEnough
              ? 'translate-x-0'
              : 'translate-x-[20rem] lg:translate-x-[-20rem]'
              " key="scroll-up"
              class="fixed bottom-3 right-[0.9rem] flex items-center gap-2 transition-all lg:left-4 lg:right-auto z-20 translate-x-0">
              <Button aria-label="Scroll Up" @click="scrollUp()">
                <Icon name="material-symbols:arrow-upward" class="h-full w-6"></Icon>
              </Button>
              <QuestionsAddQuestion v-if="roleStore.role == 'admin'" :week="weekNames[index]" />
              <Button variant="secondary" v-if="hasAnswersChanged" @click="saveAnswers">Save {{ width > 1024 ? 'Answers' : '' }}</Button>
            </div>
          </TransitionGroup>

          <!-- another preview button -->
          <SheetTrigger><Button class="relative z-20" aria-label="Preview Answers">Preview Answers</Button>
          </SheetTrigger>

          <!-- preview answer content -->
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Your Answers</SheetTitle>
              <SheetDescription>
                Ensure your answers are correct before submitting
              </SheetDescription>
            </SheetHeader>

            <!-- another tabs, basically the same as the one outside -->
            <Tabs :default-value="Number(timeStore.currentWeek)" class="mx-auto my-4">
              <Carousel class="mx-auto w-2/3" :opts="{
                align: 'start',
                slidesToScroll: 2,
                startIndex: weekNames.findIndex(
                  (week) => week == timeStore.currentWeek
                ),
              }">
                <CarouselContent>
                  <!-- paired into week and its bonus -->
                  <CarouselItem v-for="week in presentWeekNames" class="w-full basis-1/2" :key="week">
                    <TabsList class="w-full">
                      <TabsTrigger :value="week">
                        {{ width > 640 ? 'Week ' : 'W' }}{{ week }}
                      </TabsTrigger>
                    </TabsList>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              <!-- each of the inputted answers, sorted by number, split into two columns on mobile -->
              <TabsContent v-for="(_, index) in weekNames" :value="weekNames[index]"
                class="grid grid-cols-2">
                <!-- each answer, sorted, with a remove button -->
                <div v-for="answer in answersStore.answerData
                  .filter((answer) => answer.week == weekNames[index])
                  .sort((a, b) => a.question - b.question)" class="group flex justify-between px-2 hover:bg-slate-200">
                  <p>
                    <span class="font-bold">Q{{ answer.question }}.</span>
                    {{ answer.answer }}
                  </p>
                  <button aria-label="Remove Answer" @click="removeAnswer(weekNames[index], answer.question)"
                    class="flex items-center opacity-0 transition-all group-hover:opacity-100">
                    <Icon v-if="answer.answer !== ''" name="material-symbols:cancel-outline"></Icon>
                  </button>
                </div>

                <!-- submit and save button -->
                <div class="col-span-2 mt-12 grid w-full grid-cols-2 gap-2 lg:col-auto">
                  <Button aria-label="Save Answers" @click="
                    saveAnswers();
                  " variant="secondary" :disabled="saveLoading || answersStore.answerData.length == 0
                    " class="w-full">
                    Save Answers
                  </Button>
                  <Button aria-label="Submit Answers" @click="
                    submitAnswers(
                      weekNames[index],
                      answersStore.answerData.filter(
                        (answer) => answer.week == weekNames[index]
                      )
                    )
                    " :disabled="submitLoading ||
                      answersStore.answerData.filter(
                        (answer) => answer.week == weekNames[index]
                      ).length == 0
                      " class="w-full">
                    Submit {{ width > 640 ? 'Week ' : 'W' }}{{ week }}{{ weekNames[index] }}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>
      <div v-else>
        <h1 class="my-2 text-center text-2xl font-bold">
          Week {{ weekNames[index] }} Questions
        </h1>
        <p class="text-center">Questions are not available</p>
      </div>
    </TabsContent>
  </Tabs>
</template>

<script setup>
const answersStore = useAnswersStore();
const questionsStore = useQuestionsStore();
const toastStore = useToastStore();
const roleStore = useRoleStore();
const timeStore = useTimeStore();

const user = useSupabaseUser();
const session = useSupabaseSession();
const mathJaxLoaded = computed(() => typeof MathJax !== 'undefined');

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

// present week names, also for the tabs, just that it filters out the weeks that don't have any questions or time has passed
const presentWeekNames = computed(() => {
  return weekNames.filter((week) => {
    return questionsStore.questionData.some(
      (question) => question.week == week
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
    if (!session.value) return
    const token = session.value.access_token;
    const response = await $fetch('/api/saveAnswers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        answers: answersStore.answerData,
      }),
      keepalive: true,
    });

    if (response.error) {
      toastStore.changeToast('Failed to save answers', error.message);
    } else {
      initialAnswers.value = JSON.parse(JSON.stringify(answersStore.answerData));
      toastStore.changeToast(
        'Answers saved',
        'Your answers have been saved'
      );
    }
  }
  saveLoading.value = false;
}


// function to submit answers, checks if user is logged in
async function submitAnswers(week, answers) {
  submitLoading.value = true;

  if (!user.value) {
    toastStore.changeToast('You must be logged in to submit answers');
    submitLoading.value = false;
    return;
  }

  if (answers.every((answer) => answer.answer === '')) {
    toastStore.changeToast('You must answer at least one question to submit');
    submitLoading.value = false;
    return;
  }

  if (!session.value) {
    toastStore.changeToast('Session expired, please log in again');
    submitLoading.value = false;
    return;
  }

  const token = session.value.access_token;

  try {
    const response = await $fetch('/api/submitAnswers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ week, answers }),
    });

    if (response.error) {
      toastStore.changeToast('Answers submitted already: ', response.error);
    } else {
      toastStore.changeToast('Submitted successfully', 'Your answers have been submitted');
    }
  } catch (err) {
    console.error('Error submitting answers:', err);
    toastStore.changeToast('Unexpected error submitting answers');
  } finally {
    submitLoading.value = false;
  }
}


// function to remove an answer from the store (not the input, which is done in the QuestionCard component)
function removeAnswer(week, question) {
  answersStore.removeAnswer(week, question);
}

// function to check if the user has scrolled far enough down to put away the scroll and preview answer buttons
function checkIsFarDownEnough() {
  if (document.body.scrollHeight - window.innerHeight * 2 > 0) {
    isFarDownEnough.value =
      y.value > document.body.scrollHeight - window.innerHeight * 2;
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
    saveAnswers();
    event.preventDefault();
    event.returnValue = '';
  }
}

function handleSaveBeforeExit(event) {
  if (user.value && answersStore.answerData.length > 0 && hasAnswersChanged.value) {
    saveAnswers();
    event.preventDefault();
    event.returnValue = '';
  }
}

// check if far down enough when the user scrolls
watch(
  y,
  () => {
    checkIsFarDownEnough();
  },
  { immediate: true }
);

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

// rerender mathjax when the questions are loaded
watch(
  () => [questionsStore.questionData, window.MathJax],
  async () => {
    if (questionsStore.questionData.length > 0 && !questionsStore.isLoading) {
      await nextTick();
      await questionsStore.rerenderMathJax();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  if (window.MathJax) {
    await nextTick();
    await questionsStore.rerenderMathJax();
  }
  // event listener to check if the user has unsaved changes when they try to leave the page
  window.addEventListener('beforeunload', handleBeforeUnload);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      handleSaveBeforeExit();
    }
  });
  window.addEventListener('pagehide', handleSaveBeforeExit);
});

onBeforeUnmount(() => {
  // remove the event listener to avoid memory leaks
  window.removeEventListener('beforeunload', handleBeforeUnload);
  document.removeEventListener('visibilitychange', handleSaveBeforeExit);
  window.removeEventListener('pagehide', handleSaveBeforeExit);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
  document.removeEventListener('visibilitychange', handleSaveBeforeExit);
  window.removeEventListener('pagehide', handleSaveBeforeExit);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>