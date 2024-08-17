<template>
    <Card class="mx-4 lg:w-1/3 h-fit">
      <CardHeader>
        <CardTitle>Math-a-Thon {{year}}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" v-if="week1.length > 0">
            <AccordionTrigger class="text-lg">Week 1</AccordionTrigger>
            <AccordionContent>
              <ArchiveDownloadLink v-for="file in week1" :id="file.id" :file="file" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" v-if="week2.length > 0">
            <AccordionTrigger>Week 2</AccordionTrigger>
            <AccordionContent>
              <ArchiveDownloadLink v-for="file in week2" :id="file.id" :file="file" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" v-if="week3.length > 0">
            <AccordionTrigger>Week 3</AccordionTrigger>
            <AccordionContent>
              <ArchiveDownloadLink v-for="file in week3" :id="file.id" :file="file" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" v-if="fullPdfs.length > 0">
            <AccordionTrigger>Questions + Answers</AccordionTrigger>
            <AccordionContent>
              <ArchiveDownloadLink v-for="file in fullPdfs" :id="file.id" :file="file" />
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
</script>