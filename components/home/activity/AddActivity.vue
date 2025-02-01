<template>
  <Sheet>
    <SheetTrigger>
      <Button>
        <Icon name="material-symbols:edit" class="h-5 w-5"></Icon>
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader class="mb-4">
        <SheetTitle>Add Activity</SheetTitle>
        <SheetDescription> Add and edit the activity section </SheetDescription>
      </SheetHeader>
      <div class="flex flex-col items-center">
        <div
          class="flex w-full items-center gap-2 p-1"
          v-for="(activity, index) in last3Activities"
          :key="index"
        >
          <p>{{ formatDate(activity.date) }}</p>
          <Input
            v-model="activity.content"
            placeholder="Enter activity content"
          />
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
const toastStore = useToastStore();
const activityStore = useActivityStore();
const last3Activities = ref([...activityStore.activityData.slice(0, 3)]);
const originalActivities = ref([]);

// Copy the initial state for change tracking
onMounted(() => {
  originalActivities.value = JSON.parse(JSON.stringify(last3Activities.value));
});

function formatDate(date) {
  return new Date(date).toLocaleString().split(',')[0];
}

function addActivity() {
  const newActivity = {
    date: new Date().toISOString(),
    content: '',
    isNew: true,
    _id: '',
  };
  last3Activities.value.push(newActivity);
}

// Function to check for changes and save updated or new activities
async function saveActivities() {
  const changes = last3Activities.value.filter((activity, index) => {
    const original = originalActivities.value[index];
    return (
      activity.isNew || // New activities
      (original && activity.content !== original.content) // Edited activities
    );
  });

  // Process changes by making API calls
  const results = await Promise.all(
    changes.map(async (activity) => {
      // Create new activity
      const response = await $fetch('/api/activity', {
        method: 'POST',
        body: {
          _id: activity._id,
          changes: {
            content: activity.content,
            date: activity.date,
          },
        },
      });
      if (response.status == 'success') {
        toastStore.changeToast('Activity saved successfully', response.message);
      }
    })
  );

  // After successful save, update the original state and remove the isNew flag
  last3Activities.value.forEach((activity) => {
    activity.isNew = false;
  });
  originalActivities.value = JSON.parse(JSON.stringify(last3Activities.value));
}
</script>
