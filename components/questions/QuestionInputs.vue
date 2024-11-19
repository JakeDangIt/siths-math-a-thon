<template>
  <!-- the inputs for each accordion for adding/changing questions -->
  <div class="flex flex-col gap-2 p-2">
    <span class="flex gap-2 text-lg">
      <h1 class="font-bold">Title:</h1>
      {{ questionInfo.title || title }}
    </span>

    <div>
      <Label for="content">Content</Label>
      <Textarea id="content" :placeholder="questionInfo.content" v-model="content"></Textarea>

      <Label for="author">Author</Label>
      <Input id="author" :placeholder="questionInfo.author" v-model="author"></Input>

      <Label for="image">Image</Label>
      <Input id="image" type="file" accept="image/*" @change="handleImageUpload" />

    </div>
    <Button :disabled="buttonDisabled" @click="createOrUpdateQuestion">Confirm
      Changes</Button>
  </div>
</template>

<script setup>
const props = defineProps(['questionInfo']);
const questionInfo = ref(props.questionInfo);

const toastStore = useToastStore();

const createLoading = ref(false);
const buttonDisabled = computed(() => author.value == '' || content.value == '' || createLoading.value);

// constructed title for easier reading in Sanity
const title = computed(
  () =>
    questionInfo.value.title ||
    `Week ${questionInfo.value.week} Question ${questionInfo.value.number}`
);
const content = ref('');
const author = ref(questionInfo.value.author || '');
const image = ref(null);

// changes needed for Sanity
const changes = ref({
  title,
  content,
  author,
  image,
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
      image: image.value,
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
  } catch (err) {
    toastStore.changeToast('Error changing question', err.message);
  }
  createLoading.value = false;
}


// Helper to handle the image file conversion
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      image.value = reader.result;
    };
  }
}
</script>
