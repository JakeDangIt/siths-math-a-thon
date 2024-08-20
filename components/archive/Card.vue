<template>
  <Card class="mx-4 lg:w-1/3 h-fit">
    <CardHeader>
      <CardTitle>Math-a-Thon {{ year }}</CardTitle>
    </CardHeader>
    <CardContent>
      <Accordion type="single" collapsible>
        <AccordionItem v-for="(week, index) in files" :value="'item-' + (index + 1)">
          <AccordionTrigger class="text-lg" v-if="week.files.length > 0">{{ week.week }}</AccordionTrigger>
          <AccordionContent>
            <ArchiveDownloadLink v-for="file in week.files" :id="file.id" :file="file" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
</template>

<script setup>
const props = defineProps(['filesYear', 'year'])
const filesYear = props.filesYear

const week1 = filesYear.filter(file => file.name.includes('Week-1'));
const week2 = filesYear.filter(file => file.name.includes('Week-2'));
const week3 = filesYear.filter(file => file.name.includes('Week-3'));
const fullPdfs = filesYear.filter(file => file.name.includes('Math-a-Thon'));

const files = [
  { week: 'Week 1', files: week1 },
  { week: 'Week 2', files: week2 },
  { week: 'Week 3', files: week3 },
  { week: 'Questions + Answers', files: fullPdfs }
]
</script>