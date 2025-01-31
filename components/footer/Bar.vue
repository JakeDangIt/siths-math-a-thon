<template>
  <div class="relative flex flex-col items-center justify-center p-[2px]">
    <img src="/assets/theme/grass.png" alt="Footer background" class="footer-image" />

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
	display: hidden;
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
</style>
