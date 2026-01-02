<script setup>
import { onMounted } from 'vue';

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

const userRole = ref();

onMounted(async () => {
  userRole.value = await requestEndpoint('/api/retrieveUserRole');
});
</script>

<template>
  <header class="header flex h-14 items-center bg-theme-blue px-4 py-1">
    <!-- left + home -->
    <div class="flex h-full flex-1 items-center">
      <nuxt-link
        to="/"
        class="flex h-full w-fit items-center"
        draggable="false"
        aria-label="Home"
      >
        <div class="header-img my-2 mr-2 h-10 rounded-md bg-theme-dark-blue">
          <NuxtImg
            src="/math-a-thon-icon.png"
            alt="Math-a-Thon logo"
            width="40px"
            height="40px"
          />
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
        :currentRoutePath="currentRoutePath"
        variant="link"
        class="bar-links flex flex-1 justify-center text-lg hover:bg-gray-500 hover:bg-opacity-20"
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
              :currentRoutePath="currentRoutePath"
              variant="link"
              class="w-full text-left text-lg"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <HeaderNavLink
        v-if="userRole?.role === 'admin'"
        route-path="/editor"
        route-name="Editor"
        :currentRoutePath="currentRoutePath"
        variant="link"
        class="bar-links flex flex-1 justify-center text-lg hover:bg-gray-500 hover:bg-opacity-20"
      />
    </nav>

    <!-- right buttons -->
    <div class="flex flex-1 items-center justify-end gap-2">
      <AuthChangeTheme />
      <div v-if="user?.role !== 'authenticated'" class="flex gap-2">
        <HeaderNavButtonSignUp />
        <HeaderNavButtonLogIn />
      </div>
      <div v-if="user?.role == 'authenticated'" class="flex items-center gap-2">
        <HeaderAvatar />
        <HeaderNavButtonLogOut />
      </div>
    </div>
  </header>
</template>

<style>
.bee-mode .header {
  background-color: #ffb930;
}
.bee-mode .header-img {
  background-color: #fff3a2;
}
.bee-mode .bar-links:hover {
  background-color: #a77840;
  border-radius: 0.5rem;
  transition: all 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
