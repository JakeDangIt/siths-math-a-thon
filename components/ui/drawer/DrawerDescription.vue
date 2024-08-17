<script lang="ts" setup>
import type { DrawerDescriptionProps } from 'vaul-vue'
import { DrawerDescription } from 'vaul-vue'
import { type HtmlHTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<DrawerDescriptionProps & { class?: HtmlHTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DrawerDescription v-bind="delegatedProps" :class="cn('text-sm text-neutral-500 dark:text-neutral-400', props.class)">
    <slot />
  </DrawerDescription>
</template>
