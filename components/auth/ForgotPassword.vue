<template>
  <div class="flex flex-col justify-center gap-8 lg:flex-row">
    <!-- just a form to get a reset link (which doesnt actually reset, you just log in and then go to update password) -->
    <Card class="mx-4 lg:w-1/3">
      <CardHeader class="flex">
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription
          >Enter your email and follow the reset password link in your
          email.</CardDescription
        >
      </CardHeader>

      <CardContent class="mr-4 flex flex-col">
        <div class="space-y-1">
          <Label
            for="email"
            :class="{ 'text-theme-red': !emailValid && email.length > 0 }"
          >
            {{
              !emailValid && email.length > 0
                ? 'Please enter a valid NYCDOE email'
                : 'Email (NYCDOE)'
            }}</Label
          >
          <Input id="email" type="email" v-model="email" />
        </div>
      </CardContent>

      <CardFooter class="flex justify-between">
        <Button
          @click="sendResetPassword"
          :disabled="sendResetPasswordLoading || !emailValid"
          >Send link</Button
        >
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast';

const supabase = useSupabaseClient();
const toastStore = useToastStore();

const sendResetPasswordLoading = ref(false);

// input
const email = ref('');

const emailValid = computed(() => email.value.includes('@nycstudents.net'));

// send reset password email
async function sendResetPassword() {
  sendResetPasswordLoading.value = true;
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    email.value,
    {
      redirectTo: 'http://math-a-thon-25.vercel.app/auth/updatepassword',
    }
  );
  if (error) {
    toastStore.changeToast('Error sending reset password email', error.message);
  } else {
    toastStore.changeToast(
      'Reset password email sent',
      'Please check your email for the reset password link.'
    );
  }
  email.value = '';
  sendResetPasswordLoading.value = false;
}
</script>
