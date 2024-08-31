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
const week = ref(props.week)

// question input
const input = ref()

// if the answer is changed, update the answer in the store
function changeAnswer() {
    const correspondingQuestionIndex = answersStore.answerData.findIndex(
        (question) => question.week == week.value && question.questionNumber == questionNumber.value
    )

    answersStore.answerData[correspondingQuestionIndex].answer = input.value
}

// watch for changes in the store
onMounted(() => {
    // once the answers are loaded from the store, update the input value (really only for users logged in)
    watch(
        () => answersStore.getAnswerLoading,
        async (newIsLoading) => {
            if (!newIsLoading) {
                const correspondingQuestionIndex = answersStore.answerData.findIndex(
                    (question) => question.week == week.value && question.questionNumber == questionNumber.value
                )

                input.value = answersStore.answerData[correspondingQuestionIndex].answer
            }
        },
        { immediate: true }
    );

    // if the answer is removed, clear the input
    watch(
        () => answersStore.answerRemoved,
        (newAnswerRemoved) => {
            if (newAnswerRemoved) {
                if (answersStore.answerRemoved.week == week.value && answersStore.answerRemoved.questionNumber == questionNumber.value) {
                    input.value = ''
                    // reset the watcher
                    answersStore.answerRemoved = {week: null, questionNumber: null}
                }
            }
        }
    )
})
</script>
