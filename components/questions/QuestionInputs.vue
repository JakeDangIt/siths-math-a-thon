<template>
    <div class="flex flex-col gap-2 p-2">
        <span class="flex text-lg gap-2">
            <h1 class="font-bold">Title:</h1>
            {{ questionInfo.title || title }}
        </span>

        <div>
            <Label for="title">Content</Label>
            <Input id="title" :placeholder="questionInfo.content" v-model="content"></Input>

            <Label for="title">Author</Label>
            <Input id="title" :placeholder="questionInfo.author" v-model="author"></Input>
        </div>
        <Button :disabled="author == '' || content == '' || createLoading" @click="createOrUpdateQuestion">Confirm
            Changes</Button>
    </div>
</template>

<script setup>
const props = defineProps(['questionInfo']);
const questionInfo = ref(props.questionInfo);

const toastStore = useToastStore();
const questionsStore = useQuestionsStore();
const sanity = useSanity();

const createLoading = ref(false);

const title = computed(() => questionInfo.value.title || `Week ${questionInfo.value.week} Question ${questionInfo.value.number}`);
const content = ref('');
const author = ref(questionInfo.value.author || '');

const changes = ref({ title, content, author, week: String(questionInfo.value.week), number: String(questionInfo.value.number), _type: 'questions' });

async function createOrUpdateQuestion() {
    try {
        createLoading.value = true;

        const QUESTIONS_QUERY = groq`*[_type == "questions" && week == '${questionInfo.value.week}' && number == '${questionInfo.value.number}'][0]`;
        const { data: questions } = await useSanityQuery(QUESTIONS_QUERY);

        const existingQuestion = questions.value;

        if (existingQuestion) {
            await sanity.client
                .patch(existingQuestion._id)
                .set({
                    title: changes.value.title,
                    content: changes.value.content,
                    author: changes.value.author
                })
                .commit();
        } else {
            await sanity.client.create(changes.value);
        }

        await questionsStore.getQuestions();
        questionInfo.value = { ...changes.value };

        // clear the inputs
        content.value = '';
        author.value = '';

        toastStore.changeToast('Question changed successfully', `Question ${changes.value.number} for week ${changes.value.week} has been changed successfully`);
        createLoading.value = false;
    } catch (error) {
        toastStore.changeToast('Error changing question', error.message);
    }
}

</script>
