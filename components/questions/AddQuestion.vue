<template>
  <Dialog>
    <DialogTrigger
      ><Button>
        <Icon name="material-symbols:add" class="h-5 w-5"></Icon> </Button
    ></DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Questions for Week {{ week }}</DialogTitle>
        <DialogDescription>
          Add and edit
          {{ String(week).includes('Bonus') ? '12' : '20' }} questions for week
          {{ week }}.

          <div>
            <Accordion type="multiple" collapsible class="grid grid-cols-2">
              <AccordionItem
                v-for="index in 20"
                :key="index"
                :value="'item-' + index"
              >
                <AccordionTrigger
                  >Is it accessible? {{ index }}</AccordionTrigger
                >
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>

<script setup>
const props = defineProps(['week']);
const week = ref(props.week);
const { width } = useWindowSize();
</script>
