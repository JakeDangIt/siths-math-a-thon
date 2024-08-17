<template>
    <!-- avatar that also is a link to the profile page -->
    <NuxtLink to="/auth/profile" class="h-fit">
        <Avatar v-if="showAvatar" class="flex">
            <AvatarImage :src="userStore.avatarImage" draggable="false" />
        </Avatar>
        <Avatar v-else class="flex">
            <AvatarFallback class="text-xl">{{ firstName[0] }}</AvatarFallback>
        </Avatar>
    </NuxtLink>
</template>

<script setup>
const userStore = useUserStore()
const user = useSupabaseUser()

const { name } = user.value.user_metadata
const firstName = computed(() => {
    const [first] = name.value.split(' ');
    return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
});
const showAvatar = computed(() => userStore.avatarImage !== '' && userStore.avatarImage !== null)
</script>