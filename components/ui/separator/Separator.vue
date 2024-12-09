<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import { Separator, type SeparatorProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<
  SeparatorProps & { class?: HTMLAttributes['class']; label?: string }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <Separator
    v-bind="delegatedProps"
    :class="
      cn(
        'relative shrink-0 bg-neutral-300 dark:bg-neutral-800',
        props.orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full',
        props.class
      )
    "
  >
    <span
      v-if="props.label"
      :class="
        cn(
          'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-white text-xs text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400',
          props.orientation === 'vertical'
            ? 'w-[1px] px-1 py-2'
            : 'h-[1px] px-2 py-1'
        )
      "
      >{{ props.label }}</span
    >
  </Separator>
</template>
