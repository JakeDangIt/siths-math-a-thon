<template>
  <!-- show Skeleton Loader while loading -->
  <div
    class="flex flex-col flex-wrap items-center justify-center gap-4 lg:flex-row"
    v-if="archiveStore.isLoading"
  >
    <Skeleton class="h-60 w-4/5 lg:w-1/3" />
    <Skeleton class="h-60 w-4/5 lg:w-1/3" />
  </div>

  <!-- once loading is complete, show the archive cards -->
  <div
    v-else
    class="flex flex-col flex-wrap items-center justify-center gap-4 lg:flex-row lg:items-start"
  >
    <!-- card for each year -->
    <ArchiveCard :filesYear="archiveStore.files2025" year="2025" />
    <ArchiveCard :filesYear="archiveStore.files2024" year="2024" />
    <ArchiveCard :filesYear="archiveStore.files2023" year="2023" />
  </div>
</template>

<script setup>
const archiveStore = useArchiveStore();
</script>
