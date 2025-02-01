<template>
  <!-- gradient banner -->
  <div
    class="rounded-lg border-2 border-black bg-gradient-to-r from-theme-red to-theme-blue p-6 text-white"
  >
    <h1 class="text-3xl font-bold">SITHS Math-a-Thon</h1>
    <img
      src="/assets/theme/mathathon_title.png"
      alt="SITHS Math-a-Thon"
      draggable="false"
    />
  </div>
</template>

<style scoped>
img {
  display: none;
}
.bee-mode img {
  display: block;
}
.bee-mode h1 {
  display: none;
}
.bee-mode div {
  background-image: none;
  border: none;
}
</style>
