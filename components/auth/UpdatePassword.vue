<template>
  <!-- show the form if youre logged in  -->
  <div
    v-if="showPasswordChange"
    class="flex flex-col justify-center gap-8 lg:flex-row"
  >
    <Card class="mx-4 lg:w-1/3">
      <CardHeader class="flex">
        <CardTitle>Update Password</CardTitle>
        <CardDescription
          >Enter your email and follow the reset password link in your
          email.</CardDescription
        >
      </CardHeader>

      <CardContent>
        <!-- password and new password -->
        <form class="mr-4 flex flex-col">
          <div class="space-y-1">
            <Label for="password">New Password</Label>
            <Input id="password" type="password" v-model="password" />
          </div>
          <div class="space-y-1">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              v-model="confirmPassword"
            />
          </div>
        </form>
        <Label class="space-y-1 text-theme-red">{{
          password !== confirmPassword && confirmPassword.length > 0
            ? 'Your passwords do not match'
            : ''
        }}</Label>
      </CardContent>

      <!-- button -->
      <CardFooter class="flex justify-between">
        <Button @click="changePassword" :disabled="changePasswordLoading"
          >Update</Button
        >
      </CardFooter>
    </Card>
  </div>

  <!-- if youre not logged in -->
  <div v-else class="flex justify-center">
    <Card class="mx-4 lg:w-1/3">
      <CardHeader class="flex">
        <CardTitle>Invalid Reset Session</CardTitle>
        <CardDescription>Please resend the link.</CardDescription>
      </CardHeader>
    </Card>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast';

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const toastStore = useToastStore();

// if user is not logged in, show the invalid reset session card
const showPasswordChange = computed(() => user.value);
const changePasswordLoading = ref(false);

// input values
const password = ref('');
const confirmPassword = ref('');

async function changePassword() {
  changePasswordLoading.value = true;

  // check if passwords match
  if (password.value !== confirmPassword.value) {
    toastStore.changeToast('Error', 'Your passwords do not match');
  }

  // update the user's password
  const { data, error } = await supabase.auth.updateUser({
    password: password.value,
  });
  if (error) {
    toastStore.changeToast('Error', error.message);
  } else {
    toastStore.changeToast(
      'Success',
      'Your password has been changed successfully.'
    );
  }

  password.value = '';
  confirmPassword.value = '';

  changePasswordLoading.value = false;
}
</script>
