<script setup>
defineProps(['isLoading']);
</script>

<template>
  <HeaderNavMenu v-if="!isLoading" />
  <slot />
</template>
