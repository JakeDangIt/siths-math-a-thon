<template>
  <div>
    <!-- recent activity but idk how i wanna actually put the activity -->
    <Card class="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-for="activity in activityStore.activityData" className="space-y-2">
          <p>{{formatDate(activity.date)}}</p>
          <p>{{activity.content}}</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
const activityStore = useActivityStore();

function formatDate(date) {
  return new Date(date).toLocaleString().split(',')[0].replaceAll('/', '-')
}
</script>