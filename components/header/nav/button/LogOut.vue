<template>
  <HeaderNavLink
    routeName="Sign Out"
    routePath="/auth/login"
    variant="secondary"
    @click="logout()"
    class="p-1 text-lg"
    :disabled="logoutLoading"
  ></HeaderNavLink>
</template>

<script setup>
const toastStore = useToastStore();
const supabase = useSupabaseClient();

const logoutLoading = ref(false);

async function logout() {
  logoutLoading.value = true;
  const { error } = await supabase.auth.signOut();
  if (error) {
    toastStore.changeToast('Error', error.message);
    return;
  } else {
    toastStore.changeToast('Success', 'You have been logged out.');
  }
  logoutLoading.value = false;
}
</script>
