<template>
    <div class="bg-theme-red bg-opacity-20 p-[2px] flex items-center justify-between lg:justify-center">
        <div class="w-4/5 lg:w-auto flex items-center">
            <Icon name="gravity-ui:circle-letter-c" class="mx-1"></Icon>
            <p class="text-[12px] lg:text-[14px] leading-tight">2024 SITHS Math-a-Thon,<br v-if="width < 1024"> all rights reserved.</p>
        </div>
        <FooterGithubLogoLink class="ml-2" />
    </div>
</template>

<script setup>
const { width, height } = useWindowSize();
</script>