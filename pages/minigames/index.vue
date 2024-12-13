<template>
    <div>
        <div class="flex items-center">
            <NuxtLink to="/questions"><Button variant="link">
                    <ArrowLeft /><span>Back to Questions</span>
                </Button></NuxtLink>
        </div>
        <div class="w-2/3 mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Card class="flex flex-col text-center p-3">
                <nuxt-link to="/minigames/connections" class="flex flex-col justify-between h-full">
                    <img src="/assets/connections.webp" alt="connections" class="rounded-lg"><span
                        class="text-bold text-2xl">Connections</span></nuxt-link>
            </Card>
            <Card class="flex flex-col justify-between h-full text-center p-3">
                <nuxt-link to="/minigames/mines" class="flex flex-col justify-between h-full">
                    <img src="/assets/mines.jpg" alt="mines" class="rounded-lg"><span
                        class="text-bold text-2xl">Mines</span></nuxt-link>
            </Card>
        </div>
    </div>
</template>


<script setup>
import { ArrowLeft } from 'lucide-vue-next';
</script>