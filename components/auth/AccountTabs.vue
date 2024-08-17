<script setup>
defineProps(['default'])
const supabase = useSupabaseClient()
const toastStore = useToastStore()

const isLoading = ref(true)

// signup fields
const userName = ref('')
const userOSIS = ref('')
const userTeacher = ref('')
const userEmail = ref('')
const userPassword = ref('')
const userGrade = ref('')
const userAgreement = ref(false)

// validity
const passwordValid = computed(() => userPassword.value.length >= 6)
const isSignupFormValid = computed(() => userEmail.value !== '' && userPassword.value !== '' && userAgreement.value && passwordValid.value)
const isPersonalValid = computed(() => userOSIS.value !== '' && userName.value !== '' && userTeacher.value !== '' && userGrade.value !== '')

// loading
const signupLoading = ref(false)
const loginLoading = ref(false)

// dialog
const isDialogOpen = ref(false)

// login fields
const userLoginEmail = ref('')
const userLoginPassword = ref('')

async function handleSignup() {
    // loading and sign up user
    signupLoading.value = true
    const { data, error } = await supabase.auth.signUp({
        email: userEmail.value,
        password: userPassword.value,
        options: {
            data: {
                name: userName.value,
                osis: userOSIS.value,
                teacher: userTeacher.value,
                grade: userGrade.value,
            }
        }
    })
    if (error) {
        toastStore.changeToast('Error', error.message)
    } else {
        toastStore.changeToast('Success', 'You have successfully signed up. Please confirm in your email.')
    }
    isDialogOpen.value = false
    signupLoading.value = false
}

async function handleLogin() {
    // load and login user
    loginLoading.value = true
    const { data, error } = await supabase.auth.signInWithPassword({
        email: userLoginEmail.value,
        password: userLoginPassword.value
    })
    if (error) {
        toastStore.changeToast('Error', error.message)
    } else {
        toastStore.changeToast('Success', 'You have successfully logged in.')
    }
    loginLoading.value = false

    // redirect to profile 
    await navigateTo('/auth/profile')
}

onMounted(() => {
    isLoading.value = false
})
</script>

<template>
    <Skeleton v-if="isLoading" class="mt-[40px] mx-auto h-[400px] w-[600px]" />

    <!-- tabs -->
    <div v-if="!isLoading" class="w-full mt-[40px] flex justify-center">
        <Tabs :default-value="default" class="mx-8 w-[600px]">

            <!-- triggers on the top -->
            <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="signup" @click="navigateTo('/auth/signup')">
                    Signup
                </TabsTrigger>
                <TabsTrigger value="login" @click="navigateTo('/auth/login')">
                    Login
                </TabsTrigger>
            </TabsList>

            <!-- signup form -->
            <TabsContent value="signup">
                <form>
                    <Card>
                        <CardHeader>
                            <CardTitle>Sign up</CardTitle>
                            <CardDescription>
                                Welcome! Please enter your information to sign up and save
                                your answers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-2">
                            <!-- sign up fields -->
                            <div class="space-y-1">
                                <Label for="email">Email (NYCDOE)</Label>
                                <Input type="email" id="email" v-model="userEmail" />
                            </div>
                            <div class="space-y-1">
                                <Label for="password"
                                    :class="{ 'text-theme-red': !passwordValid && (userPassword.length > 0 && userPassword.length < 6) }">
                                    {{ !passwordValid && (userPassword.length > 0 && userPassword.length < 6)
                                        ? 'Please enter a password longer than 6 characters' : 'Password' }} </Label>
                                        <Input type="password" id="password" v-model="userPassword" />
                            </div>

                            <div class="space-x-2">
                                <Checkbox id="agreement" @update:checked="userAgreement = !userAgreement">
                                </Checkbox>
                                <Label for="agreement">I agree.</Label>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Dialog v-model:open="isDialogOpen">
                                <!-- fake sign up button, opens dialog -->
                                <DialogTrigger as-child>
                                    <Button :disabled="!isSignupFormValid">
                                        Sign up
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Profile information</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        Please finish your profile.
                                    </DialogDescription>

                                    <!-- user personal fields -->
                                    <div class="grid gap-4 py-4">
                                        <div class="space-y-1">
                                            <Label for="name">Full Name</Label>
                                            <Input type="text" id="name" v-model="userName" />
                                        </div>
                                        <div class="space-y-1">
                                            <Label for="osis">OSIS Number</Label>
                                            <Input type="number" id="osis" v-model="userOSIS" />
                                        </div>
                                        <div class="space-y-1">
                                            <Label for="teacher">Teacher</Label>
                                            <Select id="teacher" v-model="userTeacher">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your teacher" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Teachers</SelectLabel>
                                                        <SelectItem value="something">
                                                            Mrs. Something
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div class="space-y-1">
                                            <Label for="grade">Grade</Label>
                                            <Select id="grade" v-model="userGrade">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your grade" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Grade</SelectLabel>
                                                        <SelectItem value="1234">
                                                            1234
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <!-- real sign up button -->
                                        <Button @click="handleSignup()" :disabled="!isPersonalValid || signupLoading">
                                            Submit
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>
                </form>

            </TabsContent>

            <!-- login stuff -->
            <TabsContent value="login">
                <form>
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Welcome back! Please enter your information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-2">
                            <div class="space-y-1">
                                <Label for="loginEmail">Email Address</Label>
                                <Input type="email" id="loginEmail" v-model="userLoginEmail" />
                            </div>
                            <div class="space-y-1">
                                <Label for="loginPassword">Password</Label>
                                <Input type="password" id="loginPassword" v-model="userLoginPassword" />
                            </div>
                        </CardContent>
                        <CardFooter class="flex justify-between">
                            <Button @click="handleLogin()" :disabled="loginLoading">Log in</Button>
                            <HeaderNavLink routePath="/auth/forgotpassword" routeName="Forgot Password?" variant="link"
                                class="flex text-md" />
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>
        </Tabs>
    </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
