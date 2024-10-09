<template>
  <!-- the inputs for each accordion for adding/changing questions -->
  <div class="flex flex-col gap-2 p-2">
    <span class="flex gap-2 text-lg">
      <h1 class="font-bold">Title:</h1>
      {{ questionInfo.title || title }}
    </span>

    <div>
      <Label for="title">Content</Label>
      <Input
        id="title"
        :placeholder="questionInfo.content"
        v-model="content"
      ></Input>

      <Label for="title">Author</Label>
      <Input
        id="title"
        :placeholder="questionInfo.author"
        v-model="author"
      ></Input>
    </div>
    <Button
      :disabled="author == '' || content == '' || createLoading"
      @click="createOrUpdateQuestion"
      >Confirm Changes</Button
    >
  </div>
</template>

<script setup>
const props = defineProps(['questionInfo']);
const questionInfo = ref(props.questionInfo);

const toastStore = useToastStore();
const questionsStore = useQuestionsStore();
const sanity = useSanity();

const createLoading = ref(false);

// constructed title for easier reading in Sanity
const title = computed(
  () =>
    questionInfo.value.title ||
    `Week ${questionInfo.value.week} Question ${questionInfo.value.number}`
);
const content = ref('');
const author = ref(questionInfo.value.author || '');

// changes needed for Sanity
const changes = ref({
  title,
  content,
  author,
  week: String(questionInfo.value.week),
  number: String(questionInfo.value.number),
  _type: 'questions',
});

// create or update the question in Sanity
async function createOrUpdateQuestion() {
  try {
    createLoading.value = true;

    // like the actual changes
    const confirmedChanges = {
      ...changes.value,
      content: content.value,
      author: author.value,
      title: title.value,
    };

    // query to get the question
    const QUESTIONS_QUERY = groq`*[_type == "questions" && week == '${questionInfo.value.week}' && number == '${questionInfo.value.number}'][0]`;
    const { data: questions } = await useSanityQuery(QUESTIONS_QUERY);

    const existingQuestion = questions.value;

    // if the question exists, update it, otherwise create it
    if (existingQuestion) {
      await sanity.client
        .patch(existingQuestion._id)
        .set({
          title: changes.value.title.value,
          content: changes.value.content,
          author: changes.value.author.value,
        })
        .commit();

        // update the question in the store as well
      const questionIndex = questionsStore.questionData.findIndex(
        (question) =>
          question.week == questionInfo.value.week &&
          question.number == questionInfo.value.number
      );

      questionsStore.questionData[questionIndex] = { ...changes.value };
    } else {
      await sanity.client.create(changes.value);
      questionsStore.questionData.push(confirmedChanges);
    }

    // update on the client side as well
    questionInfo.value = { ...changes.value };

    // rerender MathJax after a second to make sure it looks right
    setTimeout(() => {
      questionsStore.rerenderMathJax();
    }, 1000);

    // clear the inputs
    content.value = '';
    author.value = '';

    toastStore.changeToast(
      'Question changed successfully',
      `Question ${changes.value.number} for week ${changes.value.week} has been changed successfully`
    );
    createLoading.value = false;
  } catch (error) {
    toastStore.changeToast('Error changing question', error.message);
  }
}
</script>
