<script setup>
defineProps(['isLoading']);
</script>

<template>
  <div class="flex min-h-[100dvh] flex-col">
    <Body class="flex-1">
      <HeaderNavMenu v-if="!isLoading" />
      <slot />
    </Body>
  </div>
</template>
