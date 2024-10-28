<template>
  <Sheet>
    <SheetTrigger>
      <Button>
        <Icon name="material-symbols:add" class="h-5 w-5"></Icon>
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader class="mb-4">
        <SheetTitle>Add Activity</SheetTitle>
        <SheetDescription>
          Add and edit the activity section
        </SheetDescription>
      </SheetHeader>
      <div class="flex flex-col items-center">
        <div class="flex items-center p-1 gap-2 w-full" v-for="(activity, index) in last3Activities"
          :key="index">
          <p>{{ formatDate(activity.date) }}</p>
          <!-- Use v-model to bind the input to activity.content -->
          <Input v-model="activity.content" placeholder="Enter activity content" />
        </div>
        <Button @click="addActivity">
          <Icon name="material-symbols:add" class="h-5 w-5"></Icon>
        </Button>
      </div>
      <SheetFooter class="mt-20">
        <Button @click="saveActivities">Save</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup>
const activityStore = useActivityStore();
const originalActivities = ref([]);
const last3Activities = ref([...activityStore.activityData.slice(0, 3)]);

// Format date to a readable string
function formatDate(date) {
  return new Date(date).toLocaleString().split(',')[0];
}

// Function to add a new blank activity to the list
function addActivity() {
  const newActivity = { date: new Date(), content: '' };
  last3Activities.value.push(newActivity);
}

// Function to save activities, updating the store if required
function saveActivities() {
  activityStore.activityData = last3Activities.value;
  console.log(originalActivities)
  originalActivities.value.forEach((activity) => {
    console.log(activity.content)
    if (activity.content !== last3Activities.value.find((originalActivity) => activity._id == originalActivity._id).content) {
      console.log(`Activity updated: ${activity.content} -> ${last3Activities.value[index].content}`);
    }
  });

  console.log('Activities saved:', last3Activities.value);
}

onMounted(() => {
  originalActivities.value = [...activityStore.activityData.slice(0, 3)];
})
</script>
