<template>
    <div>
        <Card class="h-full">
            <CardHeader>
                <CardTitle>Featured Problem</CardTitle>
            </CardHeader>
            <CardContent v-if="!questionsStore.questionData.length != 0">
                <p className="mb-4">{{questionsStore.questionData[0]?.tex_content}}</p>
                <Button>Solve Now</Button>
            </CardContent>
            <CardContent v-else>
                <Skeleton class="h-6" />
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
const questionsStore = useQuestionsStore()

onMounted(() => {
    // rerender mathjax when the questions are loaded
    if (questionsStore.questionData.length !== 0) {
        nextTick(() => {
            questionsStore.rerenderMathJax();
        });
    }
})
</script>