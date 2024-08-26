<template>
    <div>
        <div v-if="isLoading" class="mx-2 space-y-2">
            <Skeleton class="h-10 w-full mb-4" />
            <Skeleton class="h-24 w-full" />
            <Skeleton class="h-24 w-full" />
        </div>
        <Tabs :default-value="1" class="mx-auto lg:w-2/3" :class="isLoading ? 'opacity-0' : ''">
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
import { toast } from '../ui/toast';

const supabase = useSupabaseClient()
const toastStore = useToastStore()

const questionData = ref([])

const isLoading = ref(true)

async function getQuestions() {
    const { data, error } = await supabase
        .from('questions')
        .select('*')

    if (error) {
        toastStore.changeToast('Error retrieving questions', error.message)
        return
    }
    questionData.value = data
}

function getMathJax() {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
    script.async = true
    document.head.appendChild(script)
    script.onload = () => {
        isLoading.value = false
    }
    script.onerror = () => {
        toastStore.changeToast('Error loading MathJax', 'Please refresh the page')
        isLoading.value = false
    }
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
