<template>
  <div
    class="flex items-center justify-between bg-theme-red bg-opacity-20 p-[2px] lg:justify-center"
  >
    <div class="flex w-4/5 items-center lg:w-auto">
      <Icon name="material-symbols:copyright-outline" class="mx-1"></Icon>
      <p class="text-[12px] leading-tight lg:text-[14px]">
        2024 SITHS Math-a-Thon,
        all rights reserved.
      </p>
    </div>
    <FooterGithubLogoLink class="ml-1" />
  </div>
</template>

<script setup>
const { width } = useWindowSize();
</script>
