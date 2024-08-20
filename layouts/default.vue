<script setup>
defineProps(['isLoading'])
</script>

<template>
  <div class="h-[100dvh] flex flex-col">
    <Body class="flex-1">
      <HeaderNavBar v-if="!isLoading" />
      <slot />
    </Body>
    <FooterBar class="mt-auto" />
  </div>
</template>
