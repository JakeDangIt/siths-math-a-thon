<template>
    <div>
        <div v-if="questionsStore.isLoading" class="mx-auto space-y-2 lg:w-2/3">
            <Skeleton class="h-10 mb-4 mx-2" />
            <Skeleton class="h-32 mx-2" />
            <Skeleton class="h-32 mx-2" />
            <Skeleton class="h-10 w-36 mx-2" />
        </div>
        <Tabs :default-value="1" class="mx-auto lg:w-2/3" :class="questionsStore.isLoading ? 'opacity-0' : ''"
            @update:model-value="onTabChange">
            <Carousel class="relative w-3/5 mx-auto">
                <CarouselContent>
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
            <TabsContent v-for="(_, index) in weekNames" :value="weekNames[index]" class="mx-2 space-y-2">
                <h1 class="text-xl text-center font-bold">Week {{ weekNames[index] }} Questions</h1>
                <QuestionsQuestionCard
                    v-for="question in questionsStore.questionData.filter((question) => question.week == weekNames[index])"
                    :key="question.question" :questionNumber="question.question" :mathContent="question.tex_content"
                    :week="weekNames[index]" />
                <Sheet>
                    <div>
                        <div class="flex items-center gap-2 fixed bottom-3 right-[0.9rem] lg:left-4 lg:right-auto transition-all"
                            :class="isFarDownEnough ? 'translate-x-[14rem] lg:translate-x-[-14rem]' : 'translate-x-0'">
                            <Button @click="scrollDown()">
                                <Icon name="gravity-ui:arrow-down" class="w-6 h-full"></Icon>
                            </Button>
                            <SheetTrigger><Button>Preview {{ width > 1024 ? 'Answers' : '' }}</Button></SheetTrigger>
                        </div>
                    </div>
                    <SheetTrigger><Button>Preview Answers</Button></SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Your Answers</SheetTitle>
                            <SheetDescription>
                                Ensure your answers are correct before submitting
                            </SheetDescription>
                        </SheetHeader>
                        <Tabs :default-value="weekNames[index]" class="mx-auto my-4">
                            <TabsList class="w-full">
                                <Carousel class="relative w-4/5 mx-auto">
                                    <CarouselContent>
                                        <CarouselItem v-for="(weekPair, index) in presentWeekNames" :key="index">
                                            <TabsList class="grid w-full grid-cols-2">
                                                <TabsTrigger :value="weekPair[0]">
                                                    <p>Week {{ weekPair[0] }}</p>
                                                </TabsTrigger>
                                                <TabsTrigger :value="weekPair[1]">
                                                    <p class="tracking-tighter">Week {{ weekPair[1] }}</p>
                                                </TabsTrigger>
                                            </TabsList>
                                        </CarouselItem>
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </TabsList>
                            <TabsContent v-for="(_, index) in weekNames" :value="weekNames[index]"
                                class="mx-2 grid grid-cols-2 lg:grid-cols-1">
                                <p
                                    v-for="answer in answersStore.answerData.filter(answer => answer.week == weekNames[index]).sort((a, b) => a.questionNumber - b.questionNumber)">
                                    {{ answer.questionNumber }}. {{ answer.answer }}
                                </p>
                                <div class="space-x-2 mt-12">
                                    <Button
                                        @click="submitAnswers(weekNames[index], answersStore.answerData.filter(answer => answer.week == weekNames[index]))"
                                        :disabled="submitLoading">
                                        Submit Week
                                        {{ weekNames[index] }}
                                    </Button>
                                    <Button @click="saveAnswers()" variant="secondary" :disabled="saveLoading">Save
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

const { x, y } = useWindowScroll()
const { width, height } = useWindowSize()
const isFarDownEnough = ref(false)

const saveLoading = ref(false)
const submitLoading = ref(false)

const weekNames = [1, '1 Bonus', 2, '2 Bonus', 3, '3 Bonus']
const groupedWeekNames = [[1, '1 Bonus'], [2, '2 Bonus'], [3, '3 Bonus']]

const presentWeekNames = computed(() => {
    return groupedWeekNames.filter((pair) => {
        return questionsStore.questionData.some((question) => question.week == pair[0])
    })
})

function onTabChange() {
    nextTick(() => {
        questionsStore.rerenderMathJax();
    });
}

async function saveAnswers() {
    saveLoading.value = true;
    if (user.value === null) {
        toastStore.changeToast('You must be logged in to save answers');
        return;
    }
    await answersStore.saveAnswers();
    saveLoading.value = false;
}

async function submitAnswers(week, answers) {
    submitLoading.value = true;
    if (user.value === null) {
        toastStore.changeToast('You must be logged in to submit answers');
        return;
    }
    await answersStore.submitAnswers(week, answers);
    submitLoading.value = false;
}

function checkIsFarDownEnough() {
    isFarDownEnough.value = y.value > document.body.scrollHeight - window.innerHeight * 2
}

function scrollDown() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

onMounted(() => {
    if (questionsStore.questionData.length !== 0) {
        nextTick(() => {
            questionsStore.rerenderMathJax();
        });
    }

    watch(y, () => {
        checkIsFarDownEnough()
    })
})
</script>