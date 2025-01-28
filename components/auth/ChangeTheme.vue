<template>
    <div>
      <h1>Color mode: {{ $colorMode.value }}</h1>
      <select v-model="$colorMode.preference">
        <option value="light">Original</option>
        <option value="bee">Bee</option>
      </select>
    </div>
  </template>
  
  <script setup>
  const colorMode = useColorMode()
  </script>
  