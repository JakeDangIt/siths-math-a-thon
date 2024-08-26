<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { name, email } = user.value?.user_metadata || {}

const toastStore = useToastStore()

const formLoading = ref(false)

const formName = name ? ref(name) : ref('')
const formEmail = email ? ref(email) : ref('')
const emailValid = computed(() => formEmail.value.includes('@nycstudents.net'))
const formSubject = ref('')
const formBody = ref('')

const formValid = computed(() => formName.value && emailValid.value && formSubject.value && formBody.value)
const timeDisableForm = ref(false)

async function submitForm() {
    formLoading.value = true
    const { data, error } = await supabase.from('contact').insert([
        {
            name: formName.value,
            email: formEmail.value,
            subject: formSubject.value,
            body: formBody.value,
        },
    ])

    if (error) {
        toastStore.changeToast('Error submitting', error.message)
    } else {
        toastStore.changeToast('Form submitted', 'Thank you for reaching out!')

        formName.value = ''
        formEmail.value = ''
        formSubject.value = ''
        formBody.value = ''

        localStorage.setItem('timeSubmitted', Date.now())
    }
    formLoading.value = false
}

onMounted(() => {
    const lastTimeSubmited = localStorage.getItem('timeSubmitted')
    if (lastTimeSubmited) {
        const timeSinceLastSubmit = Date.now() - parseInt(lastTimeSubmited)
        if (timeSinceLastSubmit < 1000 * 60 * 60 * 1) {
            toastStore.changeToast('Please wait', 'Thank you for reaching out! Please wait 1 hour before submitting another form.')
            timeDisableForm.value = true
        }
    }
})
</script>

<template>
    <Card class="w-4/5 mx-auto">
        <CardHeader>
            <CardTitle>Contact us</CardTitle>
            <CardDescription>Have any questions? Fill out your information and let us know!</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <form>
                <div>
                    <Label for="name">Full Name</Label>
                    <Input v-model="formName" type="text" :disabled="name || timeDisableForm"
                        :placeholder="name || 'Full Name'" id="name"></Input>
                </div>

                <div>
                    <Label for="email" :class="{ 'text-theme-red': !emailValid && formEmail.length > 0 }">
                        {{ !emailValid && formEmail.length > 0
                            ? 'Please enter a valid NYCDOE email' : 'Email (NYCDOE)' }} </Label>
                    <Input v-model="formEmail" type="email" :disabled="email || timeDisableForm"
                        :placeholder="email || 'Email (NYCDOE)'" id="email"></Input>
                </div>

                <div>
                    <Label for="subject">Subject</Label>
                    <Input v-model="formSubject" type="text" :disabled="timeDisableForm" id="subject"></Input>
                </div>

                <div>
                    <Label for="body">Body</Label>
                    <Textarea v-model="formBody" type="textarea" :disabled="timeDisableForm" id="body"></Textarea>
                </div>
            </form>
        </CardContent>
        <CardFooter>
            <Button type="submit" @click="submitForm"
                :disabled="!formValid || formLoading || timeDisableForm">Submit</Button>
        </CardFooter>
    </Card>
</template>
