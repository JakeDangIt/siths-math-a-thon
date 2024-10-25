<template>
  <!-- dialog to add/edit answers -->
  <Dialog>
    <DialogTrigger>
      <Button>
        <Icon name="material-symbols:add" class="h-5 w-5"></Icon>
      </Button>
    </DialogTrigger>

    <DialogScrollContent class="lg:max-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Add Activity</DialogTitle>
        <!-- 12 or 20 depending on if it's a bonus or not -->
        <DialogDescription>
          Add and edit the activity section
        </DialogDescription>
      </DialogHeader>
      <div>
        <Accordion type="multiple" collapsible>
          <AccordionItem v-for="activity in activityStore.activityData.slice(0, 3)" :key="index"
            :value="'item-' + index">
            <AccordionTrigger>{{ activity.date }}</AccordionTrigger>
            <AccordionContent>
              <Input :placeholder="activity.content" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </DialogScrollContent>
  </Dialog>
</template>

<script setup>
const activityStore = useActivityStore();
</script>
