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

    const confirmedChanges = {
      title: title.value,
      content: content.value,
      author: author.value,
      week: String(questionInfo.value.week),
      number: String(questionInfo.value.number),
      _type: 'questions',
    };

    const response = await $fetch('/api/questions', {
      method: 'POST',
      body: {
        changes: confirmedChanges,
        questionInfo: questionInfo.value,
      },
    });

    if (response.status === 'success') {
      toastStore.changeToast(
        'Question changed successfully',
        `Question ${changes.value.number} for week ${changes.value.week} has been changed successfully`
      );

      content.value = '';
      author.value = '';
      questionInfo.value = confirmedChanges;
    } else {
      toastStore.changeToast('Error', response.message);
    }

    createLoading.value = false;
  } catch (err) {
    toastStore.changeToast('Error changing question', err.message);
    createLoading.value = false;
  }
}
</script>
