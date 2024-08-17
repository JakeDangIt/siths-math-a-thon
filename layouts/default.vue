<script setup>
defineProps(['isLoading'])
</script>

<template>

  <Body>
    <HeaderNavBar v-if="!isLoading" />
    <slot />
  </Body>

</template>