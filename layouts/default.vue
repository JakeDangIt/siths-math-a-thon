<script setup>
defineProps(['isLoading']);
</script>

<template>
  <div class="flex min-h-[100dvh] flex-col">
    <Body class="flex-1">
      <HeaderNavBar v-if="!isLoading" />
      <slot />
    </Body>
    <FooterBar class="mt-auto" />
  </div>
</template>
  
<style>
body {
  height:auto;
  background-color: #fff;
  color: rgba(0,0,0,0.8);
}
.bee-mode body {
  background-color: #f1e7d0;
  z-index: 2;
}
</style>