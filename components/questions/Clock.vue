<template>
  <p
    class="text-lg font-normal"
    :class="{ 'text-theme-red': remaining.diff < 1000 * 60 * 60 * 3 }"
  >
    {{ remaining.format }} {{ remaining.diff ? 'left' : '' }}
  </p>
</template>

<script setup>
const props = defineProps({
  week: Number | String,
});

const timeStore = useTimeStore();

const target = computed(
  () =>
    timeStore.weeks.find(
      (w) => w.week === Number(props.week.replace(' Bonus', ''))
    )?.endsAt
);

const remaining = computed(() => {
  if (!target.value) return { format: 'Timer Error', diff: 0 };

  const diff = target.value - timeStore.now;

  if (diff <= 0) return { format: "Time's Up!", diff: 0 };

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
