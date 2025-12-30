<template>
  <div>
    <!-- user profile on home -->
    <Card v-if="user" class="relative flex h-full">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- just avatar and some info -->
        <nuxt-link to="/auth/profile" class="flex items-center space-x-4">
          <Avatar class="h-16 w-16">
            <Avatar class="text-lg">{{ firstName[0] }}</Avatar>
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

    <!-- no user profile on home -->
    <Card v-else class="relative flex h-full flex-col">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent class="relative flex flex-1 flex-col justify-between">
        <p>
          Please log in to view your profile information and track your
          progress in the Math-a-Thon.
        </p>

        <nuxt-link to="/auth/login">
          <Button>Log In</Button>
        </nuxt-link>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
const user = useSupabaseUser();
const firstName = useFirstName(user.value?.user_metadata?.name);
</script>
