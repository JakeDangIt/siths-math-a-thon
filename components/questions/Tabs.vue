<template>
    <div>
        <Tabs v-if="questionData.length > 0" :default-value="1" class="mx-auto w-[600px]">
            <Carousel class="relative w-full">
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
            <TabsContent v-for="(_, index) in weekNames" :value="weekNames[index]">
                <QuestionsQuestionCard v-if="questionData.length > 0" v-for="question in weekDataValues[index].value"
                    :questionNumber="question.question" :mathContent="question.tex_content" />
            </TabsContent>
        </Tabs>
    </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const questionData = ref([])

async function getQuestions() {
    const { data, error } = await supabase
        .from('questions')
        .select('*')

    questionData.value = data
}

function getMathJax() {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
    script.async = true
    document.head.appendChild(script)
}

onMounted(async () => {
    await getQuestions()
    getMathJax()
})

const weekData = [[[1, false], [1, true]], [[2, false], [2, true]], [[3, false], [3, true]]]

const week1Data = computed(() => questionData.value.filter(question => question.week == 1 && question.bonus == false))
const week1BonusData = computed(() => questionData.value.filter(question => question.week == 1 && question.bonus == true))
const week2Data = computed(() => questionData.value.filter(question => question.week == 2 && question.bonus == false))
const week2BonusData = computed(() => questionData.value.filter(question => question.week == 2 && question.bonus == true))
const week3Data = computed(() => questionData.value.filter(question => question.week == 3 && question.bonus == false))
const week3BonusData = computed(() => questionData.value.filter(question => question.week == 3 && question.bonus == true))

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
</script>
