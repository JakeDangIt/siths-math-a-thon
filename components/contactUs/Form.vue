<template>
  <Card class="md:mx-auto md:w-4/5 lg:mx-auto lg:w-4/5">
    <CardHeader>
      <CardTitle>Contact us</CardTitle>
      <CardDescription
        >Have any questions? Fill out your information and let us
        know!</CardDescription
      >
    </CardHeader>
    <CardContent>
      <form class="space-y-2">
        <!-- autofilled and disabled with name + email if logged in -->
        <div>
          <Label class="text-md" for="name">Full Name</Label>
          <Input
            v-model="formName"
            type="text"
            :disabled="name || timeDisableForm"
            :placeholder="name || ''"
            id="name"
          ></Input>
        </div>

        <div>
          <Label
            class="text-md"
            for="email"
            :class="{ 'text-theme-red': !emailValid && formEmail.length > 0 }"
          >
            {{
              !emailValid && formEmail.length > 0
                ? 'Please enter a valid NYCDOE email'
                : 'Email (NYCDOE)'
            }}
          </Label>
          <Input
            v-model="formEmail"
            type="email"
            :disabled="email || timeDisableForm"
            :placeholder="email || ''"
            id="email"
          ></Input>
        </div>

        <div>
          <Label class="text-md" for="subject">Subject</Label>
          <Input
            v-model="formSubject"
            type="text"
            :disabled="timeDisableForm"
            id="subject"
          ></Input>
        </div>

        <div>
          <Label class="text-md" for="body">Body</Label>
          <Textarea
            v-model="formBody"
            type="textarea"
            :disabled="timeDisableForm"
            id="body"
          ></Textarea>
        </div>
      </form>
    </CardContent>
    <CardFooter>
      <!-- disabled if stuff arent filled in, submission is loading, or you already sent a form in the last hour -->
      <Button
        type="submit"
        @click="submitForm"
        :disabled="!formValid || formLoading || timeDisableForm"
        >Submit</Button
      >
    </CardFooter>
  </Card>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// for autofilling form
const { name, email } = user.value?.user_metadata || {};

const toastStore = useToastStore();

const formLoading = ref(false);

const formName = name ? ref(name) : ref('');
const formEmail = email ? ref(email) : ref('');
const formSubject = ref('');
const formBody = ref('');

// validity
const emailValid = computed(() => formEmail.value.includes('@nycstudents.net'));
const formValid = computed(
  () =>
    formName.value && emailValid.value && formSubject.value && formBody.value
);
const timeDisableForm = ref(false);

// submit form
async function submitForm() {
  formLoading.value = true;

  const response = await fetch('/api/submitContactForm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formName.value,
      email: formEmail.value,
      subject: formSubject.value,
      body: formBody.value,
    }),
  });

  const result = await response.json();

  if (result.error) {
    toastStore.changeToast('Error submitting', result.error);
  } else {
    toastStore.changeToast('Form submitted', 'Thank you for reaching out!');
    formName.value = '';
    formEmail.value = '';
    formSubject.value = '';
    formBody.value = '';
    localStorage.setItem('timeSubmitted', Date.now());
  }

  formLoading.value = false;
}


// disable form if you submitted a form in the last hour
onMounted(() => {
  const lastTimeSubmited = localStorage.getItem('timeSubmitted');
  if (lastTimeSubmited) {
    const timeSinceLastSubmit = Date.now() - parseInt(lastTimeSubmited);
    if (timeSinceLastSubmit < 1000 * 60 * 60 * 1) {
      toastStore.changeToast(
        'Please wait',
        'Thank you for reaching out! Please wait 1 hour before submitting another form.'
      );
      timeDisableForm.value = true;
    }
  }
});
</script>
