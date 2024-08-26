<template>
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Question {{ questionNumber }}</CardTitle>
            </CardHeader>
            <CardContent>
                <div v-html="mathContent"></div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
const props = defineProps(['questionNumber', 'bonus' ,'mathContent'])
const mathContent = ref(props.mathContent)
const questionNumber = ref(props.questionNumber)
</script>