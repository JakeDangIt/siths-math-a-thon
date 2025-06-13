<template>
  <div class="flex justify-end">
    <Button variant="outline" @click="showInstructions = true" class="gap-2">
      <HelpCircle class="h-4 w-4" />
      How to Compete
    </Button>
  </div>
  <Dialog v-model:open="showInstructions">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>How to Compete</DialogTitle>
        <DialogDescription>
          Follow these steps to participate in the Math-a-Thon
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <div class="flex gap-3">
          <div
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
          >
            1
          </div>
          <div>
            <h4 class="font-medium">Sign up</h4>
            <p class="text-sm text-muted-foreground">
              Enter your student information to create an account.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <div
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
          >
            2
          </div>
          <div>
            <h4 class="font-medium">Submit Payment</h4>
            <p class="text-sm text-muted-foreground">
              Pay the $5 donation and registration fee to Mrs. Asher in Room
              215.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <div
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
          >
            3
          </div>
          <div>
            <h4 class="font-medium">Choose Questions</h4>
            <p class="text-sm text-muted-foreground">
              Select the math questions for the week from the provided list.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <div
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
          >
            4
          </div>
          <div>
            <h4 class="font-medium">Solve</h4>
            <p class="text-sm text-muted-foreground">
              Work on the problems at your own pace.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <div
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
          >
            5
          </div>
          <div>
            <h4 class="font-medium">Save & Submit</h4>
            <p class="text-sm text-muted-foreground">
              Save your progress and submit your answers before the deadline.
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button @click="showInstructions = false">Got it!</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
const showInstructions = ref(false);
import { HelpCircle } from 'lucide-vue-next';
</script>

<style scoped>
img {
  display: none;
}
.bee-mode img {
  display: block;
}
</style>
