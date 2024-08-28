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
                    <CarouselItem v-for="(weeks, index) in filteredWeekData" :key="index">
                        <TabsList class="grid w-full grid-cols-2">
                            <TabsTrigger :value="weeks[0][0]">
                                Week {{ weeks[0][0] }}
                            </TabsTrigger>
                            <TabsTrigger :value="weeks[1][0] + ' Bonus'">
                                Week {{ weeks[1][0] }} Bonus
                            </TabsTrigger>
                        </TabsList>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <TabsContent v-for="(_, index) in weekNames" :value="weekNames[index]" class="mx-2 space-y-2">
                <h1 class="text-xl text-center font-bold">Week {{ weekNames[index] }} Questions</h1>
                <QuestionsQuestionCard v-for="question in weekDataValues[index].value" :key="question.question"
                    :questionNumber="question.question" :mathContent="question.tex_content" :week="weekNames[index]" />
                <Sheet>
                    <div>
                        <div class="flex items-center gap-2 fixed bottom-3 right-[0.9rem] lg:left-4 lg:right-auto transition-all"
                            :class="isFarDownEnough ? 'translate-x-[6rem] lg:translate-x-[-14rem]' : 'translate-x-0'">
                            <Button @click="scrollDown()">
                                <Icon name="gravity-ui:arrow-down" class="w-6 h-full"></Icon>
                            </Button>
                            <SheetTrigger><Button>Preview {{ width > 1024 ? 'Answers' : '' }}</Button></SheetTrigger>
                        </div>
                    </div>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Your Answers</SheetTitle>
                            <SheetDescription>
                                Ensure your answers are correct before submitting
                            </SheetDescription>
                        </SheetHeader>
                        <Tabs :default-value="weekNames[index]" class="mx-auto my-2">
                            <TabsList>
                                <Carousel class="relative w-3/5 mx-auto">
                                    <CarouselContent>
                                        <CarouselItem v-for="(weeks, index) in filteredWeekData" :key="index">
                                            <TabsList class="grid w-full grid-cols-2">
                                                <TabsTrigger :value="weeks[0][0]">
                                                    <p>Week {{ weeks[0][0] }}</p>
                                                </TabsTrigger>
                                                <TabsTrigger :value="weeks[1][0] + ' Bonus'">
                                                    <p class="tracking-tighter">Week {{ weeks[1][0] }} Bonus</p>
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
                            </TabsContent>
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

const weekData = [[[1, false], [1, true]], [[2, false], [2, true]], [[3, false], [3, true]]]

const week1Data = computed(() => questionsStore.questionData.filter(question => question.week == 1 && question.bonus == false))
const week1BonusData = computed(() => questionsStore.questionData.filter(question => question.week == 1 && question.bonus == true))
const week2Data = computed(() => questionsStore.questionData.filter(question => question.week == 2 && question.bonus == false))
const week2BonusData = computed(() => questionsStore.questionData.filter(question => question.week == 2 && question.bonus == true))
const week3Data = computed(() => questionsStore.questionData.filter(question => question.week == 3 && question.bonus == false))
const week3BonusData = computed(() => questionsStore.questionData.filter(question => question.week == 3 && question.bonus == true))

const weekNames = [1, '1 Bonus', 2, '2 Bonus', 3, '3 Bonus']
const weekDataValues = [
    week1Data,
    week1BonusData,
    week2Data,
    week2BonusData,
    week3Data,
    week3BonusData
]

const filteredWeekData = computed(() => {
    return weekData.filter(weeks => {
        const weekIndex = weekNames.indexOf(weeks[0][0]);
        const bonusIndex = weekNames.indexOf(weeks[1][0] + ' Bonus');
        return weekDataValues[weekIndex].value.length > 0 || weekDataValues[bonusIndex].value.length > 0;
    });
});

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