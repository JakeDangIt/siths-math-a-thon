<script setup>
const sanityQuestionData = ref([]);
const POSTS_QUERY = groq`*[_type == "questions"]`;
const { data: posts } = await useSanityQuery(POSTS_QUERY);
sanityQuestionData.value = posts.value;
</script>

<template>
    <main class="container mx-auto min-h-screen max-w-3xl p-8">
        <h1 class="text-4xl font-bold mb-8">Posts</h1>
        <ul class="flex flex-col gap-y-4">
            <li v-for="post in posts" class="hover:underline">
                {{ post }}
            </li>
            <QuestionsQuestionCard v-for="post in sanityQuestionData" :key="post._id" :questionNumber="post.number" :week="post.week"
                :mathContent="post.content" />
        </ul>
    </main>
</template>