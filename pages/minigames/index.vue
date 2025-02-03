<template>
  <div>
    <div class="flex items-center">
      <NuxtLink to="/questions"
        ><Button variant="link">
          <ArrowLeft /><span>Back to Questions</span>
        </Button></NuxtLink
      >
    </div>
    <div class="mx-auto grid w-2/3 gap-3 md:grid-cols-2 lg:grid-cols-3">
      <Card class="flex flex-col p-3 text-center">
        <nuxt-link
          to="/minigames/connections"
          class="flex h-full flex-col justify-between"
        >
          <img
            src="/assets/connections.webp"
            alt="connections"
            class="rounded-lg"
            draggable="false"
          /><span class="text-bold text-2xl">Connections</span></nuxt-link
        >
      </Card>
      <Card class="flex h-full flex-col justify-between p-3 text-center">
        <nuxt-link
          to="/minigames/mines"
          class="flex h-full flex-col justify-between"
        >
          <img
            src="/assets/mines.jpg"
            alt="mines"
            class="rounded-lg"
            draggable="false"
          /><span class="text-bold text-2xl">Mines</span></nuxt-link
        >
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next';
</script>
