<script setup>
// props
const props = defineProps(['routePath', 'routeName', 'iconName', 'variant']);
</script>

<template>
  <!-- link thats wrapped by a button and shows the name, goes to path, and has icon if there is -->
  <NuxtLink draggable="false" :to="routePath" class="flex-1">
    <Button class="text-md flex items-center text-center" :variant="variant">
      <Icon v-if="iconName" class="mr-2" :name="`gravity-ui:${iconName}`" />
      {{ routeName }}
    </Button>
  </NuxtLink>
</template>
