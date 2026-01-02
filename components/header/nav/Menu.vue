<script setup>
const user = useSupabaseUser();

const route = useRoute();
const currentRoutePath = computed(() => route.path);
const currentRouteName = computed(() =>
  currentRoutePath.value == '/'
    ? 'Math-a-Thon'
    : routes.find((route) => route?.routePath == currentRoutePath.value)
        ?.routeName
);
</script>

<template>
  <Sheet class="z-50">
    <!-- header w/ hamburger icon -->
    <header
      class="header flex h-14 items-center justify-between bg-theme-blue px-2"
    >
      <!-- left -->
      <div class="flex h-full items-center">
        <SheetTrigger aria-label="Menu">
          <HeaderHamburgerIcon />
        </SheetTrigger>

        <NuxtLink to="/" aria-label="Home">
          <div class="header-img m-2 h-fit rounded-md bg-theme-dark-blue">
            <NuxtImg
              class="md:hidden"
              src="/math-a-thon-icon.png"
              alt="Math-a-Thon logo"
              width="32px"
              height="32px"
            />
            <NuxtImg
              class="hidden md:block"
              src="/math-a-thon-icon.png"
              alt="Math-a-Thon logo"
              width="40px"
              height="40px"
            />
          </div>
        </NuxtLink>

        <h1 class="text-lg">{{ currentRouteName }}</h1>
      </div>

      <!-- right -->
      <div v-if="user?.role !== 'authenticated'" class="flex justify-end">
        <HeaderNavButtonSignUp />
        <HeaderNavButtonLogIn />
      </div>
      <div v-else class="flex items-center justify-end gap-2">
        <HeaderAvatar class="sm:hidden md:block" />
        <HeaderNavButtonLogOut class="sm:hidden md:block" />
      </div>
    </header>

    <!-- sheet nav content -->
    <SheetContent side="left" class="flex h-[100dvh] flex-col">
      <SheetHeader>
        <SheetTitle class="w-full">
          <div class="rounded-md">
            <NuxtImg
              src="/math-a-thon-icon.png"
              alt="Math-a-Thon logo"
              width="92px"
              height="92px"
            />
          </div>
        </SheetTitle>
      </SheetHeader>

      <SheetDescription class="flex-1">
        <!-- nav links -->
        <nav class="flex flex-col items-start">
          <SheetClose
            v-for="route in routes.slice(0, 6)"
            class="w-full hover:bg-gray-500 hover:bg-opacity-20"
          >
            <HeaderNavLink
              :route-path="route.routePath"
              :route-name="route.routeName"
              :icon-name="route.iconName"
              :currentRoutePath="currentRoutePath"
              :variant="'link'"
              class="w-full text-left text-lg"
            />
          </SheetClose>
        </nav>
      </SheetDescription>

      <SheetFooter class="flex-col gap-4 sm:flex-col">
        <div class="flex flex-col items-center justify-center">
          <AuthChangeTheme />
          <div v-if="user?.role !== 'authenticated'" class="flex gap-4">
            <SheetClose>
              <HeaderNavButtonSignUp />
            </SheetClose>
            <SheetClose>
              <HeaderNavButtonLogIn />
            </SheetClose>
          </div>
          <div v-if="user?.role == 'authenticated'" class="flex gap-4">
            <SheetClose>
              <HeaderAvatar />
            </SheetClose>
            <SheetClose>
              <HeaderNavButtonLogOut />
            </SheetClose>
          </div>
        </div>
        <FooterBar />
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
<style scoped>
.bee-mode .header {
  background-color: #ffb930;
}
.bee-mode .header-img {
  background-color: #fff3a2;
}
</style>
