<template>
  <Dialog>
    <DialogTrigger>
      <Button>
        <Icon name="material-symbols:add" class="h-5 w-5"></Icon>
      </Button>
    </DialogTrigger>

    <DialogScrollContent class="lg:max-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Questions for Week {{ week }}</DialogTitle>
        <DialogDescription>
          Add and edit
          {{ String(week).includes('Bonus') ? '12' : '20' }} questions for week
          {{ week }}.
        </DialogDescription>
      </DialogHeader>
      <div class="">
        <Accordion type="multiple" collapsible class="grid grid-cols-2 gap-x-8">
          <AccordionItem v-for="index in String(week).includes('Bonus') ? 12 : 20" :key="index"
            :value="'item-' + index">
            <AccordionTrigger>Question {{ index }}</AccordionTrigger>
            <AccordionContent>
              <QuestionsQuestionInputs
                :questionInfo="questionsStore.questionData.find(question => question.week == week && question.number == index) || { 'week': week, 'number': index }" />
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
const week = props.week 
</script>
