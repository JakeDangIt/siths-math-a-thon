export const useTimeStore = defineStore('time', () => {
  const questionsStore = useQuestionsStore();

  const time = ref(new Date());

  setInterval(() => {
    time.value = new Date();
  }, 1000);

  const targetDates = questionsStore.questionTimeData.map((question) => {
    const targetDate = new Date(question.content);
    return { week: question.week, date: targetDate };
  });
  console.log(targetDates);

  return { time, targetDates };
});
