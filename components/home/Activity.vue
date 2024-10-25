<template>
  <div>
    <!-- recent activity but idk how i wanna actually put the activity -->
    <Card class="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent class="flex-1">
        <div v-for="activity in activityStore.activityData.slice(0, 3)" className="space-y-2">
          <p><span class="font-bold">{{ formatDate(activity.date) }}</span> - {{ activity.content }}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger>
            <Button>View All</Button>
          </DialogTrigger>
          <DialogScrollContent>
            <DialogHeader>
              <DialogTitle>All Activity</DialogTitle>
            </DialogHeader>
            <div>
              <div v-for="activity in activityStore.activityData" className="space-y-2">
                <p><span class="font-bold">{{ formatDate(activity.date) }}</span> - {{ activity.content }}</p>
              </div>
            </div>
          </DialogScrollContent>
        </Dialog>
        <HomeAddActivity v-if="roleStore.role == 'admin'" />
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
const roleStore = useRoleStore();
const activityStore = useActivityStore();

function formatDate(date) {
  return new Date(date).toLocaleString().split(',')[0]
}
</script>