<script setup>
// props
const props = defineProps([
  'routePath',
  'routeName',
  'iconName',
  'variant',
  'currentRoutePath',
]);
</script>

<template>
  <!-- link thats wrapped by a button and shows the name, goes to path, and has icon if there is -->
  <NuxtLink draggable="false" :to="routePath">
    <Button
      class="text-md flex items-center text-center"
      :class="{ 'font-bold': currentRoutePath == routePath }"
      :variant="variant"
    >
      <Icon
        v-if="iconName"
        class="mr-2"
        :name="`material-symbols:${iconName}`"
      />
      {{ routeName }}
    </Button>
  </NuxtLink>
</template>
