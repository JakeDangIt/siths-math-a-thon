<template>
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Question {{ question }}</CardTitle>
            </CardHeader>
            <CardContent>
                <div v-html="mathContent"></div>
            </CardContent>
            <CardFooter>
                <Input id="input" type="number" v-model="input" :placeholder="'Question ' + question"
                    @change="changeAnswer" :disabled="answersStore.getAnswerLoading"></Input>
            </CardFooter>
        </Card>
    </div>
</template>

<script setup>
const answersStore = useAnswersStore();

const props = defineProps(['question', 'week', 'mathContent']);

// question input
const input = ref();

// if the answer is changed, update the answer in the store
function changeAnswer() {
    const correspondingQuestionIndex = answersStore.answerData.findIndex(
        (answer) => answer.week == props.week && answer.question == props.question
    );

    answersStore.answerData[correspondingQuestionIndex].answer = String(
        input.value
    );
}

// watch for changes in the store
onMounted(() => {
    // once the answers are loaded from the store, update the input value (really only for users logged in)
    watch(
        () => answersStore.getAnswerLoading,
        async (newIsLoading) => {
            if (!newIsLoading) {
                const correspondingQuestionIndex = answersStore.answerData.findIndex(
                    (answer) =>
                        answer.week == props.week && answer.question == props.question
                );

                input.value =
                    answersStore.answerData[correspondingQuestionIndex]?.answer;
            }
        },
        { immediate: true }
    );

    // if the answer is removed, clear the input
    watch(
        () => answersStore.answerRemoved,
        (newAnswerRemoved) => {
            if (newAnswerRemoved) {
                if (
                    answersStore.answerRemoved.week == props.week &&
                    answersStore.answerRemoved.question == props.question
                ) {
                    input.value = '';
                    // reset the watcher
                    answersStore.answerRemoved = { week: null, question: null };
                }
            }
        }
    );
});
</script>
