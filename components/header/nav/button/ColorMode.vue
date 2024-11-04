<template>
        <Switch :checked="$colorMode.preference == 'dark'" @update:checked="toggleTheme" />
</template>

<script setup>
const colorMode = useColorMode()

function toggleTheme() {
    colorMode.preference = colorMode.preference == 'dark' ? 'light' : 'dark'
}
</script>