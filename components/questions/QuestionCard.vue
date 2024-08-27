<template>
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Question {{ questionNumber }}</CardTitle>
            </CardHeader>
            <CardContent>
                <div v-html="mathContent"></div>
            </CardContent>
            <CardFooter>
                <Input id="input" type="number" v-model="input" :placeholder="'Question ' + questionNumber"
                    @change="changeAnswer"></Input>
            </CardFooter>
        </Card>
    </div>
</template>

<script setup>
const answersStore = useAnswersStore()

const props = defineProps(['questionNumber', 'week', 'mathContent'])
const mathContent = ref(props.mathContent)
const questionNumber = ref(props.questionNumber)

const input = ref()

function changeAnswer() {
    answersStore.setAnswer(props.week, questionNumber.value, input.value)
}

onMounted(() => {
    watch(() => answersStore.getAnswerLoading, () => {
        input.value = answersStore.getAnswer(props.week, questionNumber.value)
    }, { immediate: true })
})
</script>
