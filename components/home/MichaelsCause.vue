<template>
  <div>
    <!-- cause -->
    <Card class="relative h-full overflow-hidden">
      <CardHeader>
        <CardTitle>Charity</CardTitle>
      </CardHeader>
      <CardContent class="relative z-10">
        <p>
          The 2025 SITHS Math-a-Thon is fundraising for Michael's Cause, a
          Staten Island organization inspired by Michael Capolongo, a current
          17-year-old student at Tottenville High School. Michael was diagnosed
          with Duchenne Muscular Dystrophy, and the organization was formed with
          the goal of raising awareness and research about the disease. All
          proceeds goes to Michael's Cause and the research towards Duchenne.
        </p>
      </CardContent>
      <img
        src="/theme/card_accent_1.png"
        class="absolute bottom-0 right-0 h-64 w-64 object-contain"
        alt="card accent"
        draggable="false"
      />
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
