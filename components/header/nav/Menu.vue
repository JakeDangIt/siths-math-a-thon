<script setup>
const user = useSupabaseUser();

const route = useRoute();
const currentRoutePath = computed(() => route.path);
const currentRouteName = computed(() =>
  currentRoutePath.value == '/'
    ? 'SITHS Math-a-Thon'
    : routes.find((route) => route?.routePath == currentRoutePath.value)
        ?.routeName
);
</script>

<template>
  <Sheet>
    <!-- header w/ hamburger icon -->
    <header class="flex h-12 items-center justify-between bg-theme-blue">
      <!-- left -->
      <div class="mx-2 flex h-full items-center">
        <SheetTrigger>
          <!-- hamburger takes time to load but should be fine on initial load -->
          <HeaderHamburgerIcon />
        </SheetTrigger>

        <NuxtLink to="/">
          <div class="m-2 h-10 rounded-md bg-theme-dark-blue">
            <img src="/math-a-thon-icon.webp" class="h-full" />
          </div>
        </NuxtLink>

        <h1 class="text-lg">{{ currentRouteName }}</h1>
      </div>

      <!-- right -->
      <div v-if="user?.role !== 'authenticated'" class="flex justify-end">
        <HeaderNavButtonSignUp />
        <HeaderNavButtonLogIn class="sm:hidden md:block" />
      </div>
      <div v-else class="mx-2 flex justify-end gap-2">
        <HeaderAvatar class="sm:hidden md:block" />
        <HeaderNavButtonLogOut class="sm:hidden md:block" />
      </div>
    </header>

    <!-- sheet nav content -->
    <SheetContent side="left" class="flex h-[100dvh] flex-col">
      <SheetHeader>
        <SheetTitle class="w-full">
          <div class="w-2/6 rounded-md">
            <img src="/math-a-thon-icon.webp" />
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
              :variant="'link'"
              class="text-lg"
            />
          </SheetClose>
        </nav>
      </SheetDescription>

      <SheetFooter class="flex-col gap-4 sm:flex-col">
        <div class="flex flex-col items-center justify-center">
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
