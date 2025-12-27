<script setup>
defineProps(['isLoading']);
</script>

<template>
  <div class="flex min-h-[100dvh] flex-col">
    <Body class="z-10 h-auto flex-1 bg-white text-black/80">
      <HeaderNavMenu v-if="!isLoading" />
      <slot />
      <img
        src="/theme/clouds.png"
        class="clouds fixed top-16"
        alt="clouds"
        draggable="false"
      />
    </Body>
  </div>
</template>

<style>
body {
  height: auto;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
  z-index: 10;
}
.clouds {
  display: none;
}
.bee-mode .clouds {
  display: block;
}
.bee-mode body {
  background-color: #a0c4d4;
  z-index: 2;
}
</style>
