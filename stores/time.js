export const useTimeStore = defineStore('time', () => {
  const time = ref(new Date());
  const targetDates = ref([])

  const timeRemainings = computed(() => {
    return targetDates.value.map((targetDate) => {
      const timeRemaining = targetDate.date - time.value;
      return { week: targetDate.week, timeRemaining };
    });
  });

  const currentWeek = computed(() => {
    return targetDates.value.find((targetDate) => {
      return targetDate.date > time.value;
    })?.week[0];
  });
  
  onMounted(() => {
    setInterval(() => {
      time.value = new Date();
    }, 1000);
  })

  return { time, targetDates, timeRemainings, currentWeek };
});
