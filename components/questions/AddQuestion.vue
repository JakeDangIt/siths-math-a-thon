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
        <DialogTitle>Questions for Week {{ week }}</DialogTitle>
        <!-- 12 or 20 depending on if it's a bonus or not -->
        <DialogDescription>
          Add and edit
          {{ String(week).includes('Bonus') ? '12' : '20' }} questions for week
          {{ week }}.
        </DialogDescription>
      </DialogHeader>
      <div>
        <!-- accordion for each question -->
        <Accordion type="single" collapsible class="grid grid-cols-2 gap-x-8">
          <AccordionItem
            v-for="index in String(week).includes('Bonus') ? 12 : 20"
            :key="index"
            :value="'item-' + index"
          >
            <AccordionTrigger>Question {{ index }}</AccordionTrigger>
            <AccordionContent>
              <QuestionsQuestionInputs
                :questionInfo="
                  questionsStore.questionData.find(
                    (question) =>
                      question.week == week && question.number == index
                  ) || { week: week, number: index }
                "
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </DialogScrollContent>
  </Dialog>
</template>

<script setup>
const questionsStore = useQuestionsStore();
const props = defineProps(['week']);
const week = ref(props.week);
</script>
