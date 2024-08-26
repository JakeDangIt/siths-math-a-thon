<template>
    <div>
        <div v-if="questionsStore.isLoading" class="mx-auto space-y-2 lg:w-2/3">
            <Skeleton class="h-10 w-full mb-4" />
            <Skeleton class="h-24 w-full" />
            <Skeleton class="h-24 w-full" />
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
                            <TabsTrigger :value="weeks[1][0] + 'Bonus'">
                                Week {{ weeks[1][0] }} Bonus
                            </TabsTrigger>
                        </TabsList>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <TabsContent v-for="(_, index) in weekNames" :value="weekNames[index]" class="mx-2 space-y-2">
                <QuestionsQuestionCard v-for="question in weekDataValues[index].value"
                    :questionNumber="question.question" :mathContent="question.tex_content" />
            </TabsContent>
        </Tabs>
    </div>
</template>

<script setup>
const questionsStore = useQuestionsStore()

const weekData = [[[1, false], [1, true]], [[2, false], [2, true]], [[3, false], [3, true]]]

const week1Data = computed(() => questionsStore.questionData.filter(question => question.week == 1 && question.bonus == false))
const week1BonusData = computed(() => questionsStore.questionData.filter(question => question.week == 1 && question.bonus == true))
const week2Data = computed(() => questionsStore.questionData.filter(question => question.week == 2 && question.bonus == false))
const week2BonusData = computed(() => questionsStore.questionData.filter(question => question.week == 2 && question.bonus == true))
const week3Data = computed(() => questionsStore.questionData.filter(question => question.week == 3 && question.bonus == false))
const week3BonusData = computed(() => questionsStore.questionData.filter(question => question.week == 3 && question.bonus == true))

const weekNames = [1, '1Bonus', 2, '2Bonus', 3, '3Bonus']
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
        const bonusIndex = weekNames.indexOf(weeks[1][0] + 'Bonus');
        return weekDataValues[weekIndex].value.length > 0 || weekDataValues[bonusIndex].value.length > 0;
    });
});

function onTabChange() {
    nextTick(() => {
        questionsStore.rerenderMathJax();
    });
}

onMounted(() => {
    if (questionsStore.questionData.length !== 0) {
        nextTick(() => {
            questionsStore.rerenderMathJax();
        });
    }
})
</script>