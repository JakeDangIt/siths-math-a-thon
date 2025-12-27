export const useTimeStore = defineStore('time', () => {
  const now = ref(Date.now());

  const weeks = ref([
    {
      week: 1,
      endsAt: Date.UTC(2025, 11, 29, 5),
    },
    {
      week: 2,
      endsAt: Date.UTC(2026, 0, 5, 5),
    },
    {
      week: 3,
      endsAt: Date.UTC(2026, 0, 12, 5),
    },
  ]);

  const currentWeek = computed(() => {
    return weeks.value.find((w) => now.value < w.endsAt)?.week ?? null;
  });

  onMounted(() => {
    setInterval(() => {
      now.value = Date.now();
    }, 1000);
  });

  return { now, weeks, currentWeek };
});
