<script setup>
const user = useSupabaseUser();

// for current route and matching
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
  <header
    class="flex h-12 items-center bg-theme-blue px-4 py-1 dark:bg-theme-dark-blue"
  >
    <!-- left + home -->
    <div class="flex h-full flex-1 items-center">
      <nuxt-link
        to="/"
        class="flex h-full w-fit items-center"
        draggable="false"
      >
        <div class="my-2 mr-2 h-full rounded-md bg-theme-dark-blue">
          <img src="/math-a-thon-icon.webp" class="h-full" />
        </div>
      </nuxt-link>
      <p class="text-md lg:text-xl">{{ currentRouteName }}</p>
    </div>

    <!-- middle nav -->
    <nav class="flex flex-1 justify-center gap-2">
      <HeaderNavLink
        v-for="route in routes.slice(1, 3)"
        :route-path="route.routePath"
        :route-name="route.routeName"
        variant="link"
        class="flex justify-center text-lg hover:bg-gray-500 hover:bg-opacity-20"
        :class="{ 'font-bold': currentRoutePath == route.routePath }"
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          class="flex flex-1 items-center justify-center gap-1 text-lg"
        >
          Resources
          <Icon name="material-symbols:arrow-drop-down"></Icon>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem v-for="route in routes.slice(3, 6)">
            <HeaderNavLink
              :route-path="route.routePath"
              :route-name="route.routeName"
              variant="link"
              class="w-full text-lg"
              :class="{ 'font-bold': currentRoutePath == route.routePath }"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>

    <!-- right buttons -->
    <div class="flex flex-1 items-center justify-end gap-2">
      <div v-if="user?.role !== 'authenticated'" class="flex gap-2">
        <HeaderNavButtonSignUp />
        <HeaderNavButtonLogIn />
      </div>
      <div v-if="user?.role == 'authenticated'" class="flex gap-2">
        <HeaderAvatar />
        <HeaderNavButtonLogOut />
      </div>
    </div>
  </header>
</template>
