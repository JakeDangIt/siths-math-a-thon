<template>
  <div v-if="user">
    <!-- user profile on home -->
    <Card class="h-full">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- just avatar and some info -->
        <nuxt-link to="/auth/profile" class="flex items-center space-x-4">
          <Avatar class="h-16 w-16">
            <AvatarImage
              v-if="avatarStore.avatarImage"
              :src="avatarStore.avatarImage"
            ></AvatarImage>
            <AvatarFallback class="text-lg">{{ firstName[0] }}</AvatarFallback>
          </Avatar>

          <div>
            <p class="text-lg font-semibold">
              {{ user?.user_metadata?.name }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{ user?.user_metadata?.grade }} Grade
            </p>

            <!-- more badges to come -->
            <div class="mt-2 flex space-x-2">
              <HomeBadgeTopPercent />
            </div>
          </div>
        </nuxt-link>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
const user = useSupabaseUser();
const avatarStore = useAvatarStore();

const firstName = useFirstName(user.value?.user_metadata?.name);
</script>
