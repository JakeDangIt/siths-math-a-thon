<template>
  <!-- avatar that also is a link to the profile page -->
  <NuxtLink to="/auth/profile" class="h-fit">
    <Avatar class="flex">
      <Avatar class="text-xl">{{ firstName[0] }}</Avatar>
    </Avatar>
  </NuxtLink>
</template>

<script setup>
const user = useSupabaseUser();

// first name
const firstName = useFirstName(user.value?.user_metadata?.name);
</script>
