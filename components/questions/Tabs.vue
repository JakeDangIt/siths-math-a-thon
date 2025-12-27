<template>
  <!-- skeleton for the question cards and button -->
  <div
    v-if="questionsStore.isLoading || !mathJaxLoaded"
    class="mx-auto space-y-2 lg:w-2/3"
  >
    <Skeleton class="mb-4 h-10" />
    <Skeleton class="h-32" />
    <Skeleton class="h-32" />
    <Skeleton class="h-10 w-36" />
  </div>

  <!-- tabs for the questions, if you switch tab, rerenders mathjax -->
  <Tabs
    v-else
    :default-value="defaultWeek"
    class="md:mx-auto md:w-4/5 lg:mx-auto lg:w-2/3"
    @update:model-value="onTabChange"
  >
    <div class="flex flex-col gap-2 md:flex-row">
      <!-- carousel for the tabs -->
      <Carousel
        v-if="presentWeekNames.length > 0"
        class="mx-auto w-2/3"
        :opts="{
          align: 'start',
          slidesToScroll: 2,
          startIndex: defaultWeek - 1,
        }"
        ref="mainCarousel"
      >
        <CarouselContent>
          <!-- paired into week and its bonus -->
          <CarouselItem
            v-for="week in presentWeekNames"
            class="w-full basis-1/2"
            :key="week"
          >
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
    </div>

    <!-- content for the tabs -->
    <TabsContent
      v-for="week in presentWeekNames"
      :value="week"
      :key="week"
      class="space-y-2"
    >
      <div v-if="getQuestionsForWeek(week).length > 0">
        <!-- week name and each question for that week -->
        <h1 class="my-2 text-center text-2xl font-bold">
          Week {{ week }} Questions
        </h1>

        <QuestionsQuestionCard
          class="flex flex-col gap-2"
          v-for="question in getQuestionsForWeek(week)"
          :key="question.id"
          :question="question.question"
          :mathContent="question.math_content"
          :extraInfo="question.extra_info"
          :week="week"
          :imageUrl="question.image_url"
          :points="question.points"
        />

        <!-- preview answer -->
        <Sheet>
          <div
            class="fixed bottom-3 right-[0.9rem] z-20 lg:left-4 lg:right-auto"
          >
            <!-- Scroll down button group -->
            <div
              :class="[
                'absolute items-center gap-2 transition-all duration-300 ease-in-out',
                isFarDownEnough
                  ? 'translate-x-[30rem] opacity-0 lg:translate-x-[-30rem]'
                  : 'translate-x-0 opacity-100',
              ]"
            >
              <div class="flex gap-2">
                <Button aria-label="Scroll Down" @click="scrollDown()">
                  <Icon
                    name="material-symbols:arrow-downward"
                    class="h-full w-6"
                  ></Icon>
                </Button>
                <SheetTrigger>
                  <Button aria-label="Preview Answers"
                    >Preview {{ width > 1024 ? 'Answers' : '' }}</Button
                  >
                </SheetTrigger>
                <Button
                  variant="secondary"
                  v-if="hasAnswersChanged"
                  @click="saveAnswers"
                >
                  Save {{ width > 1024 ? 'Answers' : '' }}
                </Button>
              </div>
            </div>

            <!-- Scroll up button group -->
            <div
              :class="[
                'flex items-center gap-2 transition-all duration-300 ease-in-out',
                isFarDownEnough
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-[30rem] opacity-0 lg:translate-x-[-30rem]',
              ]"
            >
              <Button aria-label="Scroll Up" @click="scrollUp()">
                <Icon
                  name="material-symbols:arrow-upward"
                  class="h-full w-6"
                ></Icon>
              </Button>
              <Button
                variant="secondary"
                v-if="hasAnswersChanged"
                @click="saveAnswers"
              >
                Save {{ width > 1024 ? 'Answers' : '' }}
              </Button>
            </div>
          </div>

          <!-- another preview button -->
          <SheetTrigger
            ><Button class="relative z-20" aria-label="Preview Answers"
              >Preview Answers</Button
            >
          </SheetTrigger>

          <!-- preview answer content -->
          <SheetContent class="h-screen overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Your Answers</SheetTitle>
              <SheetDescription>
                Ensure your answers are correct before submitting
              </SheetDescription>
            </SheetHeader>

            <!-- another tabs, basically the same as the one outside -->
            <Tabs
              :default-value="defaultWeek"
              class="mx-auto my-4"
              v-model="selectedPreviewWeek"
            >
              <Carousel
                class="mx-auto w-2/3"
                :opts="{
                  align: 'start',
                  slidesToScroll: 2,
                  startIndex: getCarouselScrollIndex(selectedPreviewWeek),
                }"
                ref="previewCarousel"
              >
                <CarouselContent>
                  <!-- paired into week and its bonus -->
                  <CarouselItem
                    v-for="week in presentWeekNames"
                    class="w-full basis-1/2"
                    :key="week"
                  >
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
              <TabsContent
                v-for="week in presentWeekNames"
                :value="week"
                :key="`preview-${week}`"
              >
                <div
                  v-if="getAnswersForWeek(week).length > 0"
                  class="space-y-2"
                >
                  <!-- Progress indicator -->
                  <div class="mb-4 rounded-lg bg-gray-50 p-3">
                    <div class="mb-2 flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-700"
                        >Progress for Week {{ week }}</span
                      >
                      <span class="text-sm text-gray-600">
                        {{ answersStore.getAnsweredCountForWeek(week) }} /
                        {{ answersStore.getTotalQuestionsForWeek(week) }}
                        answered
                      </span>
                    </div>
                    <div class="h-2 w-full rounded-full bg-gray-200">
                      <div
                        class="h-2 rounded-full bg-blue-600 transition-all duration-300"
                        :style="{
                          width: `${(answersStore.getAnsweredCountForWeek(week) / answersStore.getTotalQuestionsForWeek(week)) * 100}%`,
                        }"
                      ></div>
                    </div>
                  </div>

                  <!-- Answers grid -->
                  <ScrollArea class="h-[50vh] md:h-auto">
                    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <!-- each answer, sorted, with a remove button -->
                      <div
                        v-for="answer in getAnswersForWeek(week)"
                        :key="`${week}-${answer.question}`"
                        class="group flex items-start justify-between rounded-lg border p-2 transition-colors hover:bg-gray-50"
                        :class="
                          answer.answer && answer.answer.trim() !== ''
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200'
                        "
                      >
                        <div class="min-w-0 flex-1 p-1">
                          <p class="text-sm">
                            <span class="font-bold text-gray-700"
                              >Q{{ answer.question }}.</span
                            >
                            <span
                              v-if="
                                answer.answer && answer.answer.trim() !== ''
                              "
                              class="ml-2 text-gray-900"
                            >
                              {{ answer.answer }}
                            </span>
                            <span v-else class="ml-2 italic text-gray-400"
                              >No answer yet</span
                            >
                          </p>
                        </div>
                        <button
                          v-if="answer.answer && answer.answer.trim() !== ''"
                          aria-label="Remove Answer"
                          @click="removeAnswer(week, answer.question)"
                          class="ml-2 flex-shrink-0 px-1 opacity-0 transition-all hover:bg-red-100 group-hover:opacity-100"
                        >
                          <Icon
                            name="material-symbols:cancel-outline"
                            class="h-4 w-4 text-red-600"
                          ></Icon>
                        </button>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
                <div v-else class="py-8 text-center text-gray-500">
                  <div class="mb-2">
                    <Icon
                      name="material-symbols:quiz-outline"
                      class="mx-auto h-12 w-12 text-gray-300"
                    ></Icon>
                  </div>
                  <p class="text-lg font-medium">
                    No answers for Week {{ week }} yet
                  </p>
                  <p class="text-sm">
                    Start answering questions to see them here
                  </p>
                </div>

                <!-- submit and save button -->
                <div class="mt-6 grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                  <Button
                    aria-label="Save Answers"
                    @click="saveAnswers"
                    variant="secondary"
                    :disabled="
                      saveLoading || answersStore.answerData.length == 0
                    "
                    class="w-full"
                  >
                    <Icon
                      name="material-symbols:save-outline"
                      class="mr-2 h-4 w-4"
                    ></Icon>
                    Save All Answers
                  </Button>
                  <Button
                    aria-label="Submit Answers"
                    @click="submitAnswers(week, getAnswersForWeek(week))"
                    :disabled="
                      submitLoading || !answersStore.hasAnswersForWeek(week)
                    "
                    class="w-full"
                  >
                    <Icon
                      name="material-symbols:send-outline"
                      class="mr-2 h-4 w-4"
                    ></Icon>
                    Submit Week {{ week }}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>
      <div v-else>
        <h1 class="my-2 text-center text-2xl font-bold">
          Week {{ week }} Questions
        </h1>
        <p class="text-center">Questions are not available</p>
      </div>
    </TabsContent>
  </Tabs>
</template>

<script setup>
import ScrollArea from '../ui/scroll-area/ScrollArea.vue';

const answersStore = useAnswersStore();
const questionsStore = useQuestionsStore();
const toastStore = useToastStore();

const user = useSupabaseUser();
const session = useSupabaseSession();
const mathJaxLoaded = computed(() => typeof MathJax !== 'undefined');

// Carousel refs for programmatic control
const mainCarousel = ref(null);
const previewCarousel = ref(null);

// Add reactive variable for preview sheet tab selection
const selectedPreviewWeek = ref('1');

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

// week names - using string format to be consistent
const allWeekNames = ['1', '1 Bonus', '2', '2 Bonus', '3', '3 Bonus'];

// Helper function to normalize week values for comparison
const normalizeWeek = (week) => {
  return String(week);
};

// Helper function to get the index of a week in the presentWeekNames array
const getWeekIndex = (week) => {
  return presentWeekNames.value.findIndex(
    (w) => normalizeWeek(w) === normalizeWeek(week)
  );
};

// Helper function to get the carousel scroll index based on week pairs
// Since carousel shows 2 items (basis-1/2), we need to scroll to the correct pair
const getCarouselScrollIndex = (week) => {
  const weekIndex = getWeekIndex(week);
  if (weekIndex === -1) return 0;

  // Group weeks into pairs: [0,1], [2,3], [4,5], etc.
  // For weeks 1 and 1 Bonus (indices 0,1) -> scroll to index 0
  // For weeks 2 and 2 Bonus (indices 2,3) -> scroll to index 1
  // For weeks 3 and 3 Bonus (indices 4,5) -> scroll to index 2
  return Math.floor(weekIndex / 2);
};

// present week names, filtered to only show weeks that have questions
const presentWeekNames = computed(() => {
  return allWeekNames.filter((week) => {
    return questionsStore.questionData.some(
      (question) => normalizeWeek(question.week) === normalizeWeek(week)
    );
  });
});

// Default week should be the first available week
const defaultWeek = computed(() => {
  return presentWeekNames.value.length > 0 ? presentWeekNames.value[0] : '1';
});

// Helper function to get questions for a specific week
const getQuestionsForWeek = (week) => {
  return questionsStore.questionData
    .filter((question) => normalizeWeek(question.week) === normalizeWeek(week))
    .sort((a, b) => Number(a.question) - Number(b.question));
};

// Helper function to get answers for a specific week
const getAnswersForWeek = (week) => {
  return answersStore.getAnswersForWeek(week);
};

// Function to scroll carousel to specific index
const scrollCarouselToIndex = (carouselRef, index) => {
  if (carouselRef?.value?.scrollTo && index >= 0) {
    carouselRef.value.scrollTo(index);
  }
};

// function to rerender mathjax when tab changes, must be nexttick to wait for DOM to update
function onTabChange(newWeek) {
  selectedPreviewWeek.value = newWeek; // Sync preview sheet with main tabs

  // Scroll preview carousel to match the selected week pair
  const carouselScrollIndex = getCarouselScrollIndex(newWeek);
  nextTick(() => {
    scrollCarouselToIndex(previewCarousel, carouselScrollIndex);
    questionsStore.rerenderMathJax();
  });
}

// Watch for changes in selectedPreviewWeek to sync carousel position
watch(selectedPreviewWeek, (newWeek) => {
  const carouselScrollIndex = getCarouselScrollIndex(newWeek);
  nextTick(() => {
    scrollCarouselToIndex(previewCarousel, carouselScrollIndex);
  });
});

// function to save answers, checks if user is logged in
async function saveAnswers() {
  saveLoading.value = true;
  try {
    if (!user.value) {
      toastStore.changeToast('You must be logged in to save answers');
      return;
    }

    if (answersStore.answerData.length === 0) {
      toastStore.changeToast('You must answer at least one question to save');
      return;
    }

    if (!session.value) {
      toastStore.changeToast('Session expired, please log in again');
      return;
    }

    const token = session.value.access_token;
    const response = await $fetch('/api/saveAnswers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        answers: answersStore.answerData,
      }),
      keepalive: true,
    });

    if (response.error) {
      toastStore.changeToast('Failed to save answers', response.error);
    } else {
      initialAnswers.value = JSON.parse(
        JSON.stringify(answersStore.answerData)
      );
      toastStore.changeToast('Answers saved', 'Your answers have been saved');
    }
  } catch (error) {
    console.error('Error saving answers:', error);
    toastStore.changeToast('Failed to save answers', error.message);
  } finally {
    saveLoading.value = false;
  }
}

// function to submit answers, checks if user is logged in
async function submitAnswers(week, answers) {
  submitLoading.value = true;

  try {
    if (!user.value) {
      toastStore.changeToast('You must be logged in to submit answers');
      return;
    }

    if (
      !answers ||
      answers.length === 0 ||
      answers.every((answer) => !answer.answer || answer.answer.trim() === '')
    ) {
      toastStore.changeToast('You must answer at least one question to submit');
      return;
    }

    if (!session.value) {
      toastStore.changeToast('Session expired, please log in again');
      return;
    }

    const token = session.value.access_token;
    const response = await $fetch('/api/submitAnswers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ week: normalizeWeek(week), answers }),
    });

    if (response.error) {
      toastStore.changeToast('Submission failed', response.error);
    } else {
      toastStore.changeToast(
        'Submitted successfully',
        `Your answers for Week ${week} have been submitted`
      );
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
  if (
    user.value &&
    answersStore.answerData.length > 0 &&
    hasAnswersChanged.value
  ) {
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

// Watch for changes in answer loading state
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

// Watch for changes in present weeks to update default selection
watch(
  presentWeekNames,
  (newWeeks) => {
    if (newWeeks.length > 0 && !newWeeks.includes(selectedPreviewWeek.value)) {
      selectedPreviewWeek.value = newWeeks[0];
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
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
