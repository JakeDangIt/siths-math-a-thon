<template>
  <p
    class="text-lg font-normal"
    :class="{ 'text-theme-red': timeRemaining.diff < 1000 * 60 * 60 * 3 }"
  >
    {{ timeRemaining.format }}
  </p>
</template>

<script setup>
const props = defineProps(['week']);
const timeStore = useTimeStore();

const formattedCurrentWeek = String(props.week).includes('Bonus')
  ? `${Number(String(props.week).replace('Bonus', '')) + 1} Bonus`
  : `${props.week + 1}`;
const targetWeekDate = ref();

targetWeekDate.value = timeStore.targetDates.find((targetDate) =>
  targetDate.week.includes(formattedCurrentWeek)
)?.date;

const timeRemaining = computed(() => {
  const now = timeStore.time;
  const target = targetWeekDate.value;
  const diff = target - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { format: `${days}d ${hours}h ${minutes}m ${seconds}s`, diff };
});
</script>
