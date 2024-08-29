<template>
    <div>
        <!-- skeleton for the question cards and button -->
        <div v-if="questionsStore.isLoading" class="mx-auto space-y-2 lg:w-2/3">
            <Skeleton class="h-10 mb-4 mx-2" />
            <Skeleton class="h-32 mx-2" />
            <Skeleton class="h-32 mx-2" />
            <Skeleton class="h-10 w-36 mx-2" />
        </div>

        <!-- tabs for the questions, if you switch tab, rerenders mathjax -->
        <Tabs :default-value="1" class="mx-auto lg:w-2/3" :class="questionsStore.isLoading ? 'opacity-0' : ''"
            @update:model-value="onTabChange">

            <!-- carousel for the tabs -->
            <Carousel class="relative w-2/3 mx-auto">
                <CarouselContent>
                    <!-- paired into week and its bonus -->
                    <CarouselItem v-for="(weekPair) in presentWeekNames" :key="weekPair">
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
            <TabsContent v-for="(_, index) in weekNames" :value="weekNames[index]" class="mx-2 space-y-2">

                <!-- week name and each question for that week -->
                <h1 class="text-xl text-center font-bold my-2">Week {{ weekNames[index] }} Questions</h1>
                <QuestionsQuestionCard
                    v-for="question in questionsStore.questionData.filter((question) => question.week == weekNames[index])"
                    :key="question.question" :questionNumber="question.question" :mathContent="question.tex_content"
                    :week="weekNames[index]" />

                <!-- preview answer -->
                <Sheet>

                    <!-- scroll down button and preview answer button -->
                    <div>
                        <div class="flex items-center gap-2 fixed bottom-3 right-[0.9rem] lg:left-4 lg:right-auto transition-all"
                            :class="isFarDownEnough ? 'translate-x-[14rem] lg:translate-x-[-14rem]' : 'translate-x-0'">
                            <Button @click="scrollDown()">
                                <Icon name="gravity-ui:arrow-down" class="w-6 h-full"></Icon>
                            </Button>
                            <!-- to save space, 'Answers' is omitted on mobile -->
                            <SheetTrigger><Button>Preview {{ width > 1024 ? 'Answers' : '' }}</Button></SheetTrigger>
                        </div>
                    </div>

                    <!-- another preview button -->
                    <SheetTrigger><Button>Preview Answers</Button></SheetTrigger>

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
                            <TabsList class="w-full mb-4">
                                <Carousel class="relative w-4/5 mx-auto">
                                    <CarouselContent>

                                        <!-- paired into week and its bonus -->
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

                            <!-- each of the inputted answers, sorted by number, split into two columns on mobile -->
                            <TabsContent v-for="(_, index) in weekNames" :value="weekNames[index]"
                                class="mx-2 grid grid-cols-2 lg:grid-cols-1">
                                <p
                                    v-for="answer in answersStore.answerData.filter(answer => answer.week == weekNames[index]).sort((a, b) => a.questionNumber - b.questionNumber)">
                                    {{ answer.questionNumber }}. {{ answer.answer }}
                                </p>

                                <!-- submit and save button -->
                                <div class="space-x-2 mt-12 col-span-2 lg:col-auto">
                                    <Button
                                        @click="submitAnswers(weekNames[index], answersStore.answerData.filter(answer => answer.week == weekNames[index]))"
                                        :disabled="submitLoading || answersStore.answerData.filter(answer => answer.week == weekNames[index]).length == 0">
                                        Submit Week
                                        {{ weekNames[index] }}
                                    </Button>
                                    <Button @click="saveAnswers()" variant="secondary"
                                        :disabled="saveLoading || answersStore.answerData.length == 0">Save
                                        Answers</Button>
                                </div>

                            </TabsContent>
                        </Tabs>
                        <SheetFooter>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </TabsContent>
        </Tabs>
    </div>
</template>

<script setup>
const answersStore = useAnswersStore()
const questionsStore = useQuestionsStore()
const toastStore = useToastStore()

const user = useSupabaseUser()

// window scroll and window size, used for scrolling down and checking if far down enough to put away the scroll and preview answer buttons
const { y } = useWindowScroll()
const { width } = useWindowSize()
const isFarDownEnough = ref(false)

const saveLoading = ref(false)
const submitLoading = ref(false)

// week names and grouped week names, used for the tabs
const weekNames = [1, '1 Bonus', 2, '2 Bonus', 3, '3 Bonus']
const groupedWeekNames = [[1, '1 Bonus'], [2, '2 Bonus'], [3, '3 Bonus']]

// present week names, also for the tabs, just that it filters out the weeks that don't have any questions
const presentWeekNames = computed(() => {
    return groupedWeekNames.filter((pair) => {
        return questionsStore.questionData.some((question) => question.week == pair[0])
    })
})

// function to rerender mathjax when tab changes, must be nexttick to wait for DOM to update
function onTabChange() {
    nextTick(() => {
        questionsStore.rerenderMathJax();
    });
}

// function to save answers, checks if user is logged in
async function saveAnswers() {
    saveLoading.value = true;
    if (user.value === null) {
        toastStore.changeToast('You must be logged in to save answers');
        return;
    }
    if (answersStore.answerData.length == 0) {
        toastStore.changeToast('You must answer at least one question to save');
        return;
    }
    else {
        await answersStore.saveAnswers();
    }
    saveLoading.value = false;
}

// function to submit answers, checks if user is logged in
async function submitAnswers(week, answers) {
    submitLoading.value = true;
    if (user.value === null) {
        toastStore.changeToast('You must be logged in to submit answers');
        return;
    }
    if (answers.length == 0) {
        toastStore.changeToast('You must answer at least one question to submit');
        return;
    }
    else {
        await answersStore.submitAnswers(week, answers);
    }
    submitLoading.value = false;
}

// function to check if the user has scrolled far enough down to put away the scroll and preview answer buttons
function checkIsFarDownEnough() {
    isFarDownEnough.value = y.value > document.body.scrollHeight - window.innerHeight * 2
}

// function to scroll down to the bottom of the page
function scrollDown() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
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
        checkIsFarDownEnough()
    })
})
</script>