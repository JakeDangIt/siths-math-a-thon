import { weeks } from '@/utils/dates.js';

export const useTimeStore = defineStore('time', () => {
  const now = ref(Date.now());

  const currentWeek = computed(() => {
    return weeks.value.find((w) => now.value < w.endsAt)?.week ?? null;
  });

  onMounted(() => {
    setInterval(() => {
      now.value = Date.now();
    }, 1000);
  });

  return { now, currentWeek };
});
