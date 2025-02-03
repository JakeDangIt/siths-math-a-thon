export const useTimeStore = defineStore('time', () => {
  const time = ref(new Date());
  const targetDates = ref([]);

  const timeRemainings = computed(() => {
    return targetDates.value.map((targetDate) => {
      const timeRemaining = time.value - targetDate.date;
      return { week: targetDate.week, timeRemaining };
    });
  });

  const currentWeek = computed(() => {
    return targetDates.value
      .slice()
      .sort((a, b) => b.date - a.date)
      .find((targetDate) => {
        return targetDate.date < time.value;
      })?.week[0];
  });

  onMounted(() => {
    setInterval(() => {
      time.value = new Date();
    }, 1000);
  });

  return { time, targetDates, timeRemainings, currentWeek };
});
