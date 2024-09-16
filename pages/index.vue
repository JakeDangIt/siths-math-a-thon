<script setup lang="ts">
import type { SanityDocument } from "@sanity/client";

const QUESTIONS_QUERY = groq`*[
  _type == "questions"
]|order(publishedAt desc)[0...12]{_id, number, content}`;

const { data: questions } = await useSanityQuery<SanityDocument[]>(QUESTIONS_QUERY);
</script>

<template>
    <main class="container mx-auto min-h-screen max-w-3xl p-8">
        <h1 class="text-4xl font-bold mb-8">Questions</h1>
        <ul class="flex flex-col gap-y-4">
            <li v-for="question in questions" :key="question._id" class="hover:underline">
                <nuxt-link :to="`/${question.slug.current}`">
                    {{ question.title }}
                </nuxt-link>
            </li>
        </ul>
    </main>
</template>