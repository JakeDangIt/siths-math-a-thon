<script setup>
defineProps(['isLoading'])
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Body class="flex-1">
      <HeaderNavBar v-if="!isLoading" />
      <slot />
    </Body>
    <FooterBar class="mt-auto" />
  </div>
</template>
