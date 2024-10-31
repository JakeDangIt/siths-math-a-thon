<template>
  <div>
    <!-- recent activity but idk how i wanna actually put the activity -->
    <Card class="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent class="flex-1">
        <div v-for="activity in activities" className="space-y-2">
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
              <DialogTitle>All Activity</DialogTitle>
            </DialogHeader>
            <div>
              <div
                v-for="activity in activityStore.activityData"
                className="space-y-2"
              >
                <p>
                  <span class="font-bold">{{ formatDate(activity.date) }}</span>
                  - {{ activity.content }}
                </p>
              </div>
            </div>
          </DialogScrollContent>
        </Dialog>
        <HomeActivityAddActivity v-if="roleStore.role == 'admin'" />
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
const roleStore = useRoleStore();
const activityStore = useActivityStore();

const activities = computed(() =>
  activityStore.activityData
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
);

function formatDate(date) {
  return new Date(date).toLocaleString().split(',')[0];
}
</script>
