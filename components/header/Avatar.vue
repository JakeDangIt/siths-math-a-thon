<template>
  <!-- avatar that also is a link to the profile page -->
  <NuxtLink to="/auth/profile" class="h-fit">
    <Avatar v-if="showAvatar" class="flex">
      <AvatarImage :src="avatarStore.avatarImage" />
    </Avatar>
    <Avatar v-else class="flex">
      <AvatarFallback class="text-xl">{{ firstName[0] }}</AvatarFallback>
    </Avatar>
  </NuxtLink>
</template>

<script setup>
const avatarStore = useAvatarStore();
const user = useSupabaseUser();

// first name
const firstName = useFirstName(user.value?.user_metadata?.name);

const showAvatar = computed(
  () => avatarStore.avatarImage !== '' && avatarStore.avatarImage !== null
);
</script>
