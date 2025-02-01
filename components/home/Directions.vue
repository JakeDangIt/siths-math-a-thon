<template>
  <div>
    <!-- directions -->
    <Card class="relative overflow-hidden">
      <CardHeader>
        <CardTitle>How to Compete</CardTitle>
      </CardHeader>
      <CardContent>
        <ol class="list-decimal pl-5">
          <li>
            <span class="font-bold">Sign up:</span>
            Enter your student information to create an account.
          </li>
          <li>
            <span class="font-bold">Submit Payment:</span>
            Pay the $5 donation and registration fee to Mrs. Asher in Room 215.
          </li>
          <li>
            <span class="font-bold">Choose Questions:</span>
            Select the math questions for the week from the provided list.
          </li>
          <li>
            <span class="font-bold">Solve:</span>
            Work on the problems at your own pace.
          </li>
          <li>
            <span class="font-bold">Save & Submit:</span>
            Save your progress and submit your answers before the deadline.
          </li>
        </ol>
        <img
          src="/assets/theme/card_accent_3.png"
          class="absolute bottom-0 right-0 h-64 w-64 object-contain"
          alt="card accent"
          draggable="false"
        />
      </CardContent>
    </Card>
  </div>
</template>
<style scoped>
img {
  display: none;
}
.bee-mode img {
  display: block;
}
</style>