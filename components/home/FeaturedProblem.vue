<template>
    <div>
        <Card class="h-full flex flex-col ">
            <CardHeader>
                <CardTitle>Featured Problem</CardTitle>
            </CardHeader>
            <CardContent v-if="questionsStore.questionData.length != 0" class="flex flex-col h-full justify-between">
                <p v-show="!questionsStore.isLoading" className="flex items-center gap-2 mb-4">Question 1.
                    {{ questionsStore.questionData[0]?.tex_content }}</p>

                <nuxt-link to="/questions"><Button class="w-full">Solve Now</Button></nuxt-link>
            </CardContent>
            <CardContent v-else>
                <Skeleton class="h-6" />
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
const questionsStore = useQuestionsStore()

onMounted(async () => {
    // rerender mathjax when the questions are loaded
    if (questionsStore.questionData.length !== 0) {
        nextTick(() => {
            questionsStore.rerenderMathJax();
        });
    }
})
</script>