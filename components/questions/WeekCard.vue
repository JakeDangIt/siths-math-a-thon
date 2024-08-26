<template>
    <div>
        <Card class="w-4/5 mx-auto">
            <CardHeader>
                <CardTitle>Week {{ week }} {{ bonus ? 'Bonus' : '' }}</CardTitle>
            </CardHeader>
            <CardContent>
                <div v-html="mathContent"></div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
const props = defineProps(['week', 'bonus' ,'mathContent'])
const mathContent = ref(props.mathContent)
const week = ref(props.week)
const bonus = ref(props.bonus)
</script>