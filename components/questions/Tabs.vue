<template>
    <div>
        <Tabs v-if="questionData.length > 0" :default-value="1" class="w-[400px]">
            <TabsList>
                <TabsTrigger v-for="week in weekData" :value="week">
                    {{week}}
                </TabsTrigger>
            </TabsList>
            <TabsContent :value="1">
                <QuestionsWeekCard v-if="questionData.length > 0" v-for="question in week1Data" :week="question.week"
                    :bonus="question.bonus" :mathContent="question.tex_content" />
            </TabsContent>
            <TabsContent :value="2">
                Change your password here.
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

const week1Data = computed(() => questionData.value.filter(question => question.week == 1))
const weekData = computed(() => questionData.value.map(question => question.week))
</script>