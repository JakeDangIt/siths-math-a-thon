<template>
  <Bar :data="chartData" />
</template>

<script setup>
const leaderboardStore = useLeaderboardStore();
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { useLeaderboardStore } from '@/stores/leaderboard';

// just the functions and data needed to create the chart
function extractWeekNumber(week) {
  const [weekNumber, bonus] = week.correct_answers[0].week.split(' ');
  return bonus ? Number(weekNumber) + 0.5 : Number(weekNumber);
}

function sortWeeks(a, b) {
  return extractWeekNumber(a) - extractWeekNumber(b);
}

const userAnswers = leaderboardStore.userAnswers.sort((a, b) =>
  sortWeeks(a, b)
);

const labels = userAnswers.map(
  (week) => `Week ${week.correct_answers[0]?.week ?? 'Unknown'}`
);
const data = userAnswers.map(
  (week) => week.correct_answers.filter((answer) => answer.isCorrect).length
);

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

const chartData = {
  labels: labels,
  datasets: [{ data: data }],
};
</script>
