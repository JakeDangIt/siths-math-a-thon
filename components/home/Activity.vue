<template>
  <div>
    <!-- recent activity but idk how i wanna actually put the activity -->
    <Card class="relative flex h-full flex-col">
      <CardHeader>
        <CardTitle class="relative z-10">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent class="flex-1">
        <div v-for="activity in activities" class="relative z-10 space-y-2">
          <p>
            <span class="font-bold">{{ formatDate(activity.date) }}</span> -
            {{ activity.content }}
          </p>
        </div>
      </CardContent>
      <CardFooter class="flex gap-2">
        <Dialog>
          <DialogTrigger>
            <Button>View All</Button>
          </DialogTrigger>
          <DialogScrollContent>
            <DialogHeader>
              <DialogTitle class="text-2xl">All Activity</DialogTitle>
            </DialogHeader>
            <div>
              <div
                v-for="activity in activityStore.activityData"
                class="space-y-2"
              >
                <p>
                  <span class="font-bold"
                    >{{ formatDate(activity.date) }} -</span
                  >
                  {{ activity.content }}
                </p>
              </div>
            </div>
          </DialogScrollContent>
        </Dialog>
        <HomeActivityAddActivity v-if="roleStore.role == 'admin'" />
        <img
          src="/theme/card_accent_2.png"
          class="absolute right-0 top-0 h-64 w-64 object-contain"
          alt="card accent"
          draggable="false"
        />
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
const roleStore = useRoleStore();
const activityStore = useActivityStore();

const activities = computed(() => activityStore.activityData.slice(0, 3));

function formatDate(date) {
  return new Date(date).toLocaleString().split(',')[0];
}
</script>

<style scoped>
img {
  display: none;
}
.bee-mode img {
  display: block;
}
</style>
