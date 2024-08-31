<template>
  <Card class="lg:w-1/3 h-fit">

    <!-- card  -->
    <CardHeader>
      <CardTitle>Math-a-Thon {{ year }}</CardTitle>
    </CardHeader>
    <CardContent>
      <!-- accordion for the files -->
      <Accordion type="single" collapsible>
        <!-- each item has to have a value of 'item-' and a number -->
        <AccordionItem v-for="(week, index) in files" :value="'item-' + (index + 1)">
          <AccordionTrigger class="text-lg" v-if="week.files.length > 0">{{ week.week }}</AccordionTrigger>
          <AccordionContent>
            <!-- link to download -->
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

// filter the files into weeks and full pdfs by name
const week1 = filesYear.filter(file => file.name.includes('Week-1'));
const week2 = filesYear.filter(file => file.name.includes('Week-2'));
const week3 = filesYear.filter(file => file.name.includes('Week-3'));
const fullPdfs = filesYear.filter(file => file.name.includes('Math-a-Thon'));

// names to the files
const files = [
  { week: 'Week 1', files: week1 },
  { week: 'Week 2', files: week2 },
  { week: 'Week 3', files: week3 },
  { week: 'Questions + Answers', files: fullPdfs }
]
</script>