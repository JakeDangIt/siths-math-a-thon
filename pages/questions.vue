<template>
    <div >
        <QuestionsTabs/>
        
        <div>
            <Button @click="scrollDown()" class="fixed bottom-4 right-4 lg:left-4 lg:right-auto transition-all" :class="isFarDownEnough ? 'translate-x-[6rem] lg:translate-x-[-6rem]' : 'translate-x-0'">
                <Icon name="gravity-ui:arrow-down" class="w-8 h-6"></Icon>
            </Button>
        </div>
    </div>
</template>

<script setup>
const { x, y } = useWindowScroll()
const isFarDownEnough = ref(false)

function checkIsFarDownEnough() {
    isFarDownEnough.value = y.value > document.body.scrollHeight - window.innerHeight * 2
}

function scrollDown() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

onMounted(() => {
    watch(y, () => {
        checkIsFarDownEnough()
    })
})
</script>