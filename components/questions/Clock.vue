<template>
    <div>
        <p class="font-normal text-lg">{{ timeRemaining }}</p>
    </div>
</template>

<script setup>
const props = defineProps(['week'])
const timeStore = useTimeStore();

const week = computed(() => String(props.week).split(' ')[0]);
const targetWeekDate = ref(new Date(timeStore.targetDates.find((targetDate) => targetDate.week == week.value).date));

const timeRemaining = computed(() => {
    const now = timeStore.time
    const target = targetWeekDate.value;
    const diff = target - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
});
</script>