<template>
  <div
    class="footer relative flex flex-col items-center justify-center bg-theme-red bg-opacity-20 p-[2px]"
  >
    <div class="relative z-20 flex items-center py-1 text-center">
      <Icon name="material-symbols:copyright-outline" class="mx-1" />
      <p class="text-[8px] leading-tight lg:text-[14px]">
        2026 SITHS Math-a-Thon, all rights reserved.
      </p>
      <FooterGithubLogoLink class="ml-1" />
    </div>

    <img
      src="/theme/grass.png"
      alt="Footer background"
      class="footer-image pointer-events-none absolute bottom-0 left-0 z-0 hidden h-auto w-full"
      draggable="false"
    />
  </div>
</template>

<style>
.bee-mode .footer-image {
  display: block;
}
.bee-mode .footer {
  background-color: transparent;
}
</style>
