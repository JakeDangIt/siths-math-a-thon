<template>
  <!-- tabs -->
  <div class="flex w-full justify-center">
    <Tabs :default-value="default" class="w-full md:w-4/5 lg:w-[600px]">
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
                Welcome! Please enter your information to sign up and save your
                answers.
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <!-- sign up fields -->
              <div class="space-y-1">
                <Label for="email" :class="{
                  'text-theme-red': !emailValid && userEmail.length > 0,
                }">{{
                    !emailValid && userEmail.length > 0
                      ? 'Please enter a valid NYCDOE email'
                      : 'Email (NYCDOE)'
                  }}
                </Label>
                <Input type="email" id="email" v-model="userEmail" />
              </div>
              <div class="space-y-1">
                <Label for="password" :class="{
                  'text-theme-red': !passwordValid && userPassword.length > 0,
                }">
                  {{
                    !passwordValid && userPassword.length > 0
                      ? 'Please enter a password longer than 8 characters'
                      : 'Password'
                  }}
                </Label>
                <Input type="password" id="password" v-model="userPassword" />
              </div>

              <div class="space-x-2">
                <Checkbox aria-label="Payment Agreement" id="agreement"
                  @update:checked="userAgreement = !userAgreement">
                </Checkbox>
                <Label for="agreement">I agree.</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog v-model:open="isDialogOpen">
                <!-- fake sign up button, opens dialog -->
                <DialogTrigger as-child>
                  <Button :disabled="!isSignupFormValid"> Sign up </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Complete your sign up</DialogTitle>
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
                      <Label for="osis" :class="{
                        'text-theme-red':
                          !osisValid && String(userOSIS).length > 0,
                      }">
                        {{
                          !osisValid && String(userOSIS).length > 0
                            ? 'Please enter a valid OSIS number'
                            : 'OSIS Number'
                        }}</Label>
                      <Input type="" id="osis" v-model="userOSIS" inputmode="numeric" pattern="[0-9]*" />
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
                            <!-- teachers from teachers.js -->
                            <SelectItem v-for="teacher in teachers" :value="teacher.name">
                              {{ teacher.name }}
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
                            <SelectItem value="9th"> 9th </SelectItem>
                            <SelectItem value="10th"> 10th </SelectItem>
                            <SelectItem value="11th"> 11th </SelectItem>
                            <SelectItem value="12th"> 12th </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <!-- real sign up button -->
                    <Button @click="handleSignup()" :disabled="!isPersonalValid || signupLoading || !osisValid
                      ">
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
                Welcome back! Please enter your information to log in.
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
                class="text-md flex" />
            </CardFooter>
          </Card>
        </form>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup>
defineProps(['default']);
import { teachers } from '../../utils/teachers';
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const toastStore = useToastStore();
const avatarStore = useAvatarStore();
const routesStore = useRoutesStore();

// signup fields
const userName = ref('');
const userOSIS = ref('');
const userTeacher = ref('');
const userEmail = ref('');
const userPassword = ref('');
const userGrade = ref('');
const userAgreement = ref(false);

// validity
const passwordValid = computed(() => userPassword.value.length >= 8);
const emailValid = computed(() => userEmail.value.includes('@nycstudents.net'));
const osisValid = computed(
  () => String(userOSIS.value).length == 9 && !isNaN(Number(userOSIS.value))
);
const isSignupFormValid = computed(
  () => emailValid.value && passwordValid.value && userAgreement.value
);
const isPersonalValid = computed(
  () =>
    osisValid.value &&
    userName.value !== '' &&
    userTeacher.value !== '' &&
    userGrade.value !== ''
);

// loading
const signupLoading = ref(false);
const loginLoading = ref(false);

// dialog
const isDialogOpen = ref(false);

// login fields
const userLoginEmail = ref('');
const userLoginPassword = ref('');

async function handleSignup() {
  // loading and sign up user
  signupLoading.value = true;
  toastStore.changeToast('Signing up', 'Please wait while we sign you up.');

  const { data, error } = await supabase.auth.signUp({
    email: userEmail.value,
    password: userPassword.value,
    options: {
      data: {
        name: userName.value,
        osis: userOSIS.value,
        teacher: userTeacher.value,
        grade: userGrade.value,
        profile_complete: false,
      },
    },
  });
  if (error) {
    toastStore.changeToast('Error signing up', error.message);
  } else {
    toastStore.changeToast(
      'Success',
      'You have successfully signed up. Please confirm in your email.'
    );
  }

  isDialogOpen.value = false;
  signupLoading.value = false;
}

async function handleLogin() {
  // load and login user
  loginLoading.value = true;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: userLoginEmail.value,
    password: userLoginPassword.value,
  });
  if (error) {
    toastStore.changeToast('Error', error.message);
  } else {
    // on first login, upload profile to table
    if (!user.value.user_metadata.profile_complete) {
      const { error: uploadError } = await supabase.from('profiles').insert({
        uid: user.value.id,
        name: user.value.user_metadata.name,
        email: user.value.email,
        osis: Number(user.value.user_metadata.osis),
        teacher: user.value.user_metadata.teacher,
        grade: user.value.user_metadata.grade,
      });
      if (uploadError) {
        toastStore.changeToast('Error uploading profile', uploadError.message);
        return;
      }

      // actual update metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          profile_complete: true,
        },
      });
      if (updateError) {
        toastStore.changeToast('Error updating user', updateError.message);
      }
    }
    toastStore.changeToast('Success', 'You have successfully logged in.');

    // get the new data to update avatar
    await avatarStore.refreshUser();
    await avatarStore.retrieveAvatar();

    // redirect to last page that wasnt login or signup
    await routesStore.redirectToLast();
  }
  loginLoading.value = false;
}
</script>
