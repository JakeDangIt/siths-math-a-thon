<template>
  <ClientOnly>
    <!-- Show Skeleton Loader while loading -->
    <div class="flex flex-wrap flex-col lg:flex-row justify-center gap-4" v-if="archiveStore.isLoading">
      <Skeleton class="mx-4 lg:w-1/3 h-60" />
      <Skeleton class="mx-4 lg:w-1/3 h-60" />
    </div>

    <!-- Once loading is complete, show the archive cards -->
    <div v-else class="flex flex-wrap flex-col lg:flex-row justify-center gap-4">
      <LazyArchiveCard :filesYear="archiveStore.files2024" year="2024" />
      <LazyArchiveCard :filesYear="archiveStore.files2023" year="2023" />
    </div>
  </ClientOnly>
</template>

<script setup>
const archiveStore = useArchiveStore()
</script>
