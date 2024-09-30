<script setup>
defineProps(['isLoading']);
</script>

<template>
  <div class="flex h-[100dvh] flex-col">
    <Body class="flex-1">
      <HeaderNavBar v-if="!isLoading" />
      <slot />
    </Body>
    <FooterBar class="mt-auto" />
  </div>
</template>
