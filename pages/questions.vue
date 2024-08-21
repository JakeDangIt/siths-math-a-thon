<template>
    <div>
        <QuestionsCard :mathContent="mathContent" />
    </div>
</template>

<script setup>
const mathContent = ref(`
    Compute the least value of \\(\\sqrt{\\phantom{x}} +   4\\) such that \\(\\frac{12}{x-4}\\) is an integer.
  `)
</script>
<style>