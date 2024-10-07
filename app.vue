<script setup>
await preloadComponents('Icon');
import { useToast } from '@/components/ui/toast/use-toast';

const toastStore = useToastStore();
const questionsStore = useQuestionsStore();
const routesStore = useRoutesStore();
const roleStore = useRoleStore();
const { toast } = useToast();

// reactive vars
const { width, height } = useWindowSize();
const layout = ref('default');
const isLoading = ref(true);

// mobile screen is width less than 1024px
const isMobile = computed(() => width.value < 1024);

onMounted(async () => {
  // set layout based on screen size and watches change in widths
  watch(
    isMobile,
    (newValue) => {
      layout.value = newValue ? 'mobile' : 'default';
    },
    { immediate: true }
  );

  watch(
    () => [toastStore.toastID],
    ([newID]) => {
      toast({
        title: toastStore.titleMessage,
        description: toastStore.descriptionMessage,
      });
    }
  );

  isLoading.value = false;
});
</script>

<template>
  <Head>
    <Title>SITHS Math-a-Thon</Title>

    <!-- <Base href="https://siths-mathathon.com" /> -->

    <Meta name="application-name" content="SITHS Math-a-Thon" />
    <Meta
      name="description"
      content="Staten Island Technical High School's very own Math-a-thon, a student-led schoolwide competition dedicated to charity"
    />
    <Meta
      name="keywords"
      content="SITHS, Math-a-Thon, Math, Competition, Charity, Staten Island Technical High School"
    />
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
      rel="stylesheet"
    />
  </Head>

  <!-- nuxt is weird and throws warnings if v-else is used w nuxt-layout, 
  so only render on client while loading (which should show nothing anyway)  -->
  <ClientOnly v-if="isLoading">
    <!-- show skeleton when loading the layout -->
    <div class="h-screen overflow-hidden">
      <Skeleton class="h-[48px] w-full" />
      <Skeleton class="mt-2 h-screen w-full" />
    </div>
    <NuxtLayout :name="layout" fallback="default" :is-loading="isLoading">
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly>

  <!-- show mobile if mobile screen, show default if larger -->
  <NuxtLayout v-else :name="layout" fallback="default" :is-loading="isLoading">
    <NuxtLoadingIndicator color="#CB5D56" />
    <NuxtPage class="py-4 lg:py-12" />
    <Toaster />
  </NuxtLayout>
</template>
