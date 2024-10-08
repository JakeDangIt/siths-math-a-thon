<template>
  <div
    class="w-1/3 rounded-t-2xl"
    :class="(user_id == user.uid ? 'border-2 border-slate-400' : '', bgColor)"
  >
    <div v-if="leaderboardStore.avatarLoading">
      <Skeleton :style="{ height: `${width < 1024 ? 250 : 400}px` }" />
    </div>

    <div
      v-else
      class="flex flex-col items-center text-center"
      :style="{ height: `${computedHeight}px` }"
    >
      <div
        class="relative bottom-6 flex border-2 border-slate-400 bg-theme-red p-2"
      >
        <Icon :name="iconName" class="h-8 w-8 bg-white" />
      </div>
      <div class="mt-4 flex flex-col items-center justify-center lg:mt-10">
        <Avatar class="lg:h-20 lg:w-20">
          <AvatarImage v-if="userAvatar" :src="userAvatar" />
          <AvatarFallback class="text-[16px] lg:text-[24px]">{{
            firstName[0]
          }}</AvatarFallback>
        </Avatar>
        <h1 class="text-[30px] lg:text-[40px]">{{ index }}</h1>
        <p class="lg:text-lg">{{ user.user_name }}</p>
        <p class="text-sm">{{ user.correct_answers }} points</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['user', 'index']);
const leaderboardStore = useLeaderboardStore();
const user_id = computed(() => useSupabaseUser().value?.id);

const { width } = useWindowSize();

const top3 = ref(leaderboardStore.top10.slice(0, 3));
const user = ref(props.user);
const index = ref(props.index + 1);
const userAvatar = computed(
  () => leaderboardStore.top3Avatars[props.index]?.image
);
const firstName = computed(() => {
  const [first] = user.value.user_name.split(' ');
  return first
    ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
    : '';
});

const maxScore = computed(() => top3.value[0].correct_answers);
const minScore = computed(() => top3.value[2].correct_answers);
const scoreRange = computed(() => maxScore.value - minScore.value);

const computedHeight = computed(() => {
  // basically the percentage of how much higher the user is than the lowest score times the range (50px or 100px), with 250px or 350px as the minimum height
  const height =
    ((user.value.correct_answers - minScore.value) / scoreRange.value) *
      (width.value < 1024 ? 50 : 100) +
    (width.value < 1024 ? 250 : 350);
  return height;
});

const bgColor = computed(() => {
  switch (index.value) {
    case 1:
      return 'bg-gold';
    case 2:
      return 'bg-silver';
    case 3:
      return 'bg-bronze';
  }
});

const iconName = computed(() => {
  switch (index.value) {
    case 1:
      return 'material-symbols:trophy';
    case 2:
      return 'material-symbols:workspace-premium-outline';
    case 3:
      return 'material-symbols:workspace-premium-outline';
  }
});
</script>
