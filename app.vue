<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
await preloadComponents('Icon');
import { SpeedInsights } from '@vercel/speed-insights/vue';
import { useToast } from '@/components/ui/toast/use-toast';

// toast
const toastStore = useToastStore();
const { toast } = useToast();

// initialize necessary stores on app load
useQuestionsStore();
useLeaderboardStore();
useRoutesStore();
useAnnouncementsStore();
if (user.value) {
  useAnswersStore();
}

// reactive vars
const { width } = useWindowSize();
const layout = ref('default');
const isLoading = ref(true);

// mobile screen is width less than 1024px
const isMobile = computed(() => width.value < 1024);

// constants for activity tracking
const ONE_HOUR = 60 * 60 * 1000;
const CHECK_INTERVAL = 30 * 1000; // 30 seconds
const LAST_ACTIVITY_KEY = 'lastActivity';

const lastActivity = ref(Date.now());

// track activity
const updateLastActivity = () => {
  const now = Date.now();
  localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
  lastActivity.value = now;
};

// logout user
const logoutUser = async () => {
  await supabase.auth.signOut(); // Log out from Supabase
  toastStore.changeToast(
    'Session expired',
    'You have been logged out due to inactivity'
  );
  await navigateTo('/auth/login');
};

// event listeners for user activity
const setupActivityListeners = () => {
  ['mousemove', 'keypress', 'scroll'].forEach((event) => {
    window.addEventListener(event, updateLastActivity);
  });
};

// set layout based on screen size and watch for changes in width
watch(
  isMobile,
  (newValue) => {
    layout.value = newValue ? 'mobile' : 'default';
  },
  { immediate: true }
);

// when the toast changes, show the toast
watch(
  () => [toastStore.toastID],
  () => {
    toast({
      title: toastStore.titleMessage,
      description: toastStore.descriptionMessage,
    });
  }
);

onMounted(async () => {

  // initialize interval id
  let intervalId;

  // if session has expired, log out user if logged in
  const checkSessionExpiration = async () => {
    const lastActivityTime = localStorage.getItem(LAST_ACTIVITY_KEY);

    if (
      user.value &&
      lastActivityTime &&
      Date.now() - parseInt(lastActivityTime) > ONE_HOUR
    ) {
      await logoutUser();
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  };

  // set up activity listeners to track user activity
  setupActivityListeners();
  await checkSessionExpiration();

  // periodically check for session expiration every 30 seconds
  intervalId = setInterval(checkSessionExpiration, CHECK_INTERVAL);
  // watch if user logs in, set the interval to check for session expiration
  watch(user, async (newUser) => {
    const answersStore = useAnswersStore();
    if (newUser) {
      // Set up activity listeners to track user activity
      setupActivityListeners();

      await answersStore.retrieveAnswers();
    } else {
      answersStore.answerData = [];
    }
  });
  setTimeout(() => {
    isLoading.value = false;
  }, 500);

  if (user.value) {
    if (!user.value.user_metadata.profile_complete) {
      const { error: uploadError } = await supabase.from('profiles').insert({
        uid: user.value.id,
        name: user.value.user_metadata.name,
        email: user.value.email,
        osis: Number(user.value.user_metadata.osis),
        teacher: user.value.user_metadata.teacher,
        grade: user.value.user_metadata.grade,
      });
      if (uploadError) {
        toastStore.changeToast('Error uploading profile', uploadError.message);
        return;
      }

      // actual update metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          profile_complete: true,
        },
      });
      if (updateError) {
        toastStore.changeToast('Error updating user', updateError.message);
      }
    }
  }
});

onUnmounted(() => {
  // Remove activity listeners when component unmounts
  ['mousemove', 'keypress', 'scroll'].forEach((event) => {
    window.removeEventListener(event, updateLastActivity);
  });
});
</script>

<template>

  <Head>
    <Title>SITHS Math-a-Thon</Title>

    <!-- meta -->
    <Meta name="application-name" content="SITHS Math-a-Thon" />
    <Meta name="description"
      content="Staten Island Technical High School's very own Math-a-thon, a student-led schoolwide competition dedicated to charity" />
    <Meta name="keywords"
      content="SITHS, Math-a-Thon, Math, Competition, Charity, Staten Island Technical High School" />
    <Meta name="author" content="SITHS" />
    <Meta name="robots" content="index, follow" />
    <Meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <Meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <Meta name="theme-color" content="#B1BAD1" />
    <Meta name="copyright" content="© 2024 SITHS Math-a-Thon" />
    <Meta name="rating" content="general" />

    <Link rel="preconnect" href="https://fonts.googleapis.com" />
    <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <Link
      href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
      rel="stylesheet" />
  </Head>

  <!-- nuxt is weird and throws warnings if v-else is used w nuxt-layout, 
  so only render on client while loading (which should show nothing anyway)  -->
  <ClientOnly v-if="isLoading">
    <!-- show skeleton when loading the layout -->
    <div class="h-screen overflow-hidden">
      <Skeleton class="h-[48px] w-full" />
      <div class="flex h-full items-center justify-center">
        <div class="loading-animation"></div>
      </div>
    </div>
    <NuxtLayout :name="layout" fallback="default" :is-loading="isLoading">
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly>

  <!-- show mobile if mobile screen, show default if larger -->
  <NuxtLayout v-else :name="layout" fallback="default" :is-loading="isLoading">
    <SpeedInsights />
    <NuxtLoadingIndicator color="#CB5D56" />
    <NuxtPage class="z-10 px-2 py-4 lg:py-8" />
  </NuxtLayout>

  <ClientOnly>
    <Toaster />
  </ClientOnly>
</template>

<style>
.loading-animation {
  width: 50px;
  height: 50px;
  border: 5px solid black;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
