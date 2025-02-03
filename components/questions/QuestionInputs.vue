<template>
  <!-- the inputs for each accordion for adding/changing questions -->
  <div class="flex flex-col gap-2 p-2">
    <span class="flex gap-2 text-lg">
      <h1 class="font-bold">Title:</h1>
      {{ questionInfo.title || title }}
    </span>

    <div>
      <Label for="content">Content</Label>
      <Textarea
        id="content"
        :placeholder="questionInfo.content"
        v-model="content"
      ></Textarea>

      <Label for="author">Author</Label>
      <Input
        id="author"
        :placeholder="questionInfo.author"
        v-model="author"
      ></Input>

      <Label for="image">Image</Label>
      <div class="flex gap-2">
        <Input
          id="image"
          type="file"
          accept="image/*"
          @change="handleImageUpload"
        />
        <Button
          v-if="questionInfo.image"
          @click="removeImage"
          :disabled="removeLoading"
          >Remove Image</Button
        >
      </div>

      <Label for="points">Points</Label>
      <Input
        id="points"
        type="number"
        :placeholder="questionInfo.points"
        v-model="points"
      />
    </div>
    <Button :disabled="buttonDisabled" @click="createOrUpdateQuestion"
      >Confirm Changes</Button
    >
  </div>
</template>

<script setup>
const props = defineProps(['questionInfo']);
const questionInfo = ref(props.questionInfo);

const questionsStore = useQuestionsStore();
const toastStore = useToastStore();

const matchedQuestion = questionsStore.questionData.find(
  (question) =>
    question.week == questionInfo.value.week &&
    question.number == questionInfo.value.number
);

const createLoading = ref(false);
const removeLoading = ref(false);
const buttonDisabled = computed(
  () => author.value == '' || content.value == '' || createLoading.value
);

// constructed title for easier reading in Sanity
const title = computed(
  () =>
    questionInfo.value.title ||
    `Week ${questionInfo.value.week} Question ${questionInfo.value.number}`
);
const content = ref('');
const author = ref(questionInfo.value.author || '');
const image = ref(null);
const points = ref(questionInfo.value.points || 1);

// changes needed for Sanity
const changes = ref({
  title,
  content,
  author,
  image,
  points,
  week: String(questionInfo.value.week),
  number: String(questionInfo.value.number),
  _type: 'questions',
});

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

// remove the image from the question
async function removeImage() {
  removeLoading.value = true;
  const response = await $fetch('/api/removeimage', {
    method: 'DELETE',
    body: {
      questionInfo: questionInfo.value,
    },
  });

  if (response.status === 'success') {
    toastStore.changeToast(
      'Image removed',
      'The image has been removed successfully'
    );
    matchedQuestion.image = null;
    matchedQuestion.imageUrl = '';
  } else {
    toastStore.changeToast('Error', response.message);
  }
  removeLoading.value = false;
}

// create or update the question in Sanity
async function createOrUpdateQuestion() {
  try {
    createLoading.value = true;

    const confirmedChanges = {
      title: title.value,
      content: content.value,
      author: author.value,
      image: image.value,
      points: points.value,
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

      matchedQuestion.imageUrl = image.value;
    } else {
      toastStore.changeToast('Error', response.message);
    }
  } catch (err) {
    toastStore.changeToast('Error changing question', err.message);
  }
  createLoading.value = false;
}
</script>
