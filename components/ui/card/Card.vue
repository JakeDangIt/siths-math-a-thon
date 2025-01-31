<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div
    :class="
      cn(
        'card rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>

<style scoped>
.card {
  background-color: #fff3a2;
}
</style>