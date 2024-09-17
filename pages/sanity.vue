<script setup lang="ts">
import type { SanityDocument } from "@sanity/client";

const POSTS_QUERY = groq`*[_type == "questions"]{ _id, number, content }`;

const { data: posts } = await useSanityQuery<SanityDocument[]>(POSTS_QUERY);
</script>

<template>
    <main class="container mx-auto min-h-screen max-w-3xl p-8">
        <h1 class="text-4xl font-bold mb-8">Posts</h1>
        <ul class="flex flex-col gap-y-4">
            <li v-for="post in posts" class="hover:underline">
                {{ post }}
            </li>
        </ul>
    </main>
</template>