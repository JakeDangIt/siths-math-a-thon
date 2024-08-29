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
const week = props.week

// question input
const input = ref()

// if the answer is changed, update the answer in the store
function changeAnswer() {
    if (input.value === '') {
        answersStore.removeAnswer(week, questionNumber.value)
        return
    }
    answersStore.setAnswer(week, questionNumber.value, input.value)
}

// when the answers are done loading, fill in the input with your saved answer
onMounted(() => {
    watch(() => answersStore.getAnswerLoading, () => {
        input.value = answersStore.getAnswer(week, questionNumber.value)
    }, { immediate: true })
})
</script>
