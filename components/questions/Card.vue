<template>
    <div>
        <Card class="w-4/5 mx-auto">
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <div v-html="mathContent"></div>
            </CardContent>
            <CardFooter>
                Card Footer
            </CardFooter>
        </Card>
    </div>
</template>

<script setup>
const props = defineProps(['mathContent', 'loadingScript'])
const mathContent = props.mathContent

onMounted(() => {
    window.MathJax.typeset()
})
</script>