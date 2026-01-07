<template>
  <component
    :is="unstyled ? 'span' : 'p'"
    :class="
      unstyled
        ? ''
        : [
            'text-lg font-normal',
            remaining.diff < 1000 * 60 * 60 * 3 ? 'text-theme-red' : '',
          ]
    "
  >
    {{ remaining.format }}
    <span v-if="!unstyled && remaining.diff"> left</span>
  </component>
</template>

<script setup>
const props = defineProps({
  week: String,
  unstyled: {
    type: Boolean,
    default: false,
  },
});

import { weeks } from '@/utils/dates.js';

const timeStore = useTimeStore();

const target = computed(() => {
  const entry = weeks.find((w) => w.week === props.week.replace(' Bonus', ''));
  return props.unstyled ? entry?.startsAt : entry?.endsAt;
});

const remaining = computed(() => {
  if (!target.value) return { format: 'Timer Error', diff: 0 };

  const diff = target.value - timeStore.now;

  if (diff <= 0) return { format: props.unstyled ? 'Started' : "Time's Up!", diff: 0 };

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return {
    diff,
    format: `${d}d ${h}h ${m}m ${s}s`,
  };
});
</script>
