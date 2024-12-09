<template>
  <div v-if="user">
    <!-- user profile on home -->
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- just avatar and some info -->
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              v-if="avatarStore.avatarImage"
              :src="avatarStore.avatarImage"
            ></AvatarImage>
            <AvatarFallback class="text-lg">{{ firstName[0] }}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">
              {{ user?.user_metadata?.name }}
            </p>
            <p className="text-sm text-muted-foreground">
              {{ user?.user_metadata?.grade }} Grade
            </p>

            <!-- more badges to come -->
            <div className="mt-2 flex space-x-2">
              <HomeBadgeTopPercent />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
const user = useSupabaseUser();
const avatarStore = useAvatarStore();

const firstName = useFirstName(user.value?.user_metadata?.name);
</script>
