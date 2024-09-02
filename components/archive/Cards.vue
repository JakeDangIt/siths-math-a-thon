<template>
  <!-- show Skeleton Loader while loading -->
  <div class="flex flex-wrap flex-col lg:flex-row justify-center gap-4 mx-2" v-if="archiveStore.isLoading">
    <Skeleton class="lg:w-1/3 h-60" />
    <Skeleton class="lg:w-1/3 h-60" />
  </div>

  <!-- once loading is complete, show the archive cards -->
  <div v-else class="flex flex-wrap flex-col lg:flex-row justify-center gap-4 mx-2">
    <!-- card for each year -->
    <ArchiveCard :filesYear="archiveStore.files2024" year="2024" />
    <ArchiveCard :filesYear="archiveStore.files2023" year="2023" />
  </div>
</template>

<script setup>
const archiveStore = useArchiveStore()
</script>
