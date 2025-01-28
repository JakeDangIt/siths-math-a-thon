<template>
  <div class="relative flex flex-col items-center justify-center bg-theme-red bg-opacity-20 p-[2px]">
    <img src="/assets/theme/grass.png" alt="Footer background" class="footer-image bg-transparent" />
    <div class="footer-text flex items-center text-center">
      <Icon name="material-symbols:copyright-outline" class="mx-1" />
      <p class="text-[12px] leading-tight lg:text-[14px]">
        2025 SITHS Math-a-Thon, all rights reserved.
      </p>
      <FooterGithubLogoLink class="ml-1" />
    </div>
  </div>
</template>

<style>
.footer-image {
  display: none;
}
.bee-mode * {
  z-index: 1;
}
.bee-mode .footer-text {
  position: fixed;
  bottom: 0;
  z-index: 2;
}
.bee-mode .footer-image {
  display: block;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 1;
}
</style>