<script setup>
const user = useSupabaseUser()

// for current route and matching
const route = useRoute()
const currentRoutePath = computed(() => route.path)
const currentRouteName = computed(() => currentRoutePath.value == '/' ? 'SITHS Math-a-Thon' : routes.find(route => route.routePath == currentRoutePath.value).routeName)
</script>

<template>
  <header class="flex items-center bg-theme-blue dark:bg-theme-dark-blue h-12 px-4 py-1">
    <!-- left + home -->
    <div class="h-full flex flex-1  items-center">
      <nuxt-link to="/" class="flex items-center h-full w-fit" draggable="false">
        <div class="bg-theme-dark-blue rounded-md h-full my-2 mr-2">
          <img src="/math-a-thon-icon.webp" class="h-full">
        </div>
      </nuxt-link>
      <p class="text-md lg:text-xl">{{ currentRouteName }}</p>
    </div>

    <!-- middle nav -->
    <nav class="flex-1 gap-2 flex justify-center">

      <HeaderNavLink v-for='route in routes.slice(1, 3)' :route-path="route.routePath" :route-name="route.routeName"
        variant="link" class="hover:bg-gray-500 hover:bg-opacity-20 text-lg"
        :class="{ 'font-bold': currentRoutePath == route.routePath }" />

      <DropdownMenu>

        <DropdownMenuTrigger class="text-lg flex items-center gap-1 px-4">
          Resources
          <Icon name="gravity-ui:caret-down"></Icon>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem v-for="route in routes.slice(3, 6)">
            <HeaderNavLink :route-path="route.routePath" :route-name="route.routeName" variant="link"
              class="w-full text-lg" :class="{ 'font-bold': currentRoutePath == route.routePath }" />
          </DropdownMenuItem>
        </DropdownMenuContent>

      </DropdownMenu>
    </nav>

    <!-- right buttons -->
    <div class="flex flex-1 gap-2 items-center justify-end">
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