<template>
  <div class="flex items-center">
    <NuxtLink to="/minigames"
      ><Button variant="link">
        <ArrowLeft :color="color" /><span :class="`text-${color}`"
          >Minigames</span
        >
      </Button></NuxtLink
    >
  </div>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: 'black',
  },
});
import { ArrowLeft } from 'lucide-vue-next';
</script>
