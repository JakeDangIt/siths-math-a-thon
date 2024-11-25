<template>
    <Button @click="toggleColorMode" variant="outline">
        <Icon name="radix-icons:moon"
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Icon name="radix-icons:sun"
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-white" />
        <span class="sr-only">Toggle theme</span>
    </Button>
</template>

<script setup>
const colorMode = useColorMode();

function toggleColorMode() {
    colorMode.value = colorMode.value === 'light' ? 'dark' : 'light';
};
</script>