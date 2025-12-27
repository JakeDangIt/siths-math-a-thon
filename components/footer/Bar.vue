<template>
  <div
    class="footer relative flex flex-col items-center justify-center bg-theme-red bg-opacity-20 p-[2px]"
  >
    <img
      src="/theme/grass.png"
      alt="Footer background"
      class="footer-image"
      draggable="false"
    />

    <div class="footer-text relative z-10 flex items-center text-center">
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
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 1;
  pointer-events: none;
}

.footer-text {
  position: relative;
  z-index: 10;
}

.bee-mode .footer-image {
  display: block;
}
.bee-mode .footer {
  background-color: transparent;
}
</style>
