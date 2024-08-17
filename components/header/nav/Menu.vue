<script setup lang="ts">
const user = useSupabaseUser()
</script>

<template>
  <Sheet>
    <!-- header w/ hamburger icon -->
    <header class="flex items-center justify-between bg-theme-blue h-12 px-2 py-1">

      <!-- left -->
      <div class="flex items-center h-full">
        <SheetTrigger>
          <!-- hamburger takes time to load but should be fine on initial load -->
          <HeaderHamburgerIcon />
        </SheetTrigger>

        <div class="bg-theme-dark-blue rounded-md h-full m-1">
          <!-- <Icon name="gravity-ui:math-operations" class="h-[32px] w-[32px]" /> -->
          <img src="/math-a-thon-icon.webp" class="h-full">
        </div>

        <h1 class="text-lg">SITHS Math-a-Thon</h1>

      </div>

      <!-- right -->
      <div v-if="user?.role !== 'authenticated'" class="flex justify-end">
        <HeaderNavButtonSignUp />
      </div>
    </header>

    <!-- sheet nav content -->
    <SheetContent side="left" class="flex h-screen pb-24">
      <SheetHeader>
        <SheetTitle>
          <div class="rounded-md w-2/6">
            <img src="/math-a-thon-icon.webp">
          </div>
        </SheetTitle>
        <SheetDescription class="flex flex-col justify-between h-full">
          <!-- nav links -->
          <nav class="flex flex-col items-start">
            <SheetClose v-for="route in routes" class="w-full hover:bg-gray-500 hover:bg-opacity-20">
              <HeaderNavLink :route-path="route.routePath" :route-name="route.routeName" :icon-name="route.iconName"
                :variant="'link'" class="text-lg" />
            </SheetClose>
          </nav>

          <div v-if="user?.role !== 'authenticated'" class="flex justify-center gap-4">
            <SheetClose>
              <HeaderNavButtonSignUp />
            </SheetClose>
            <SheetClose>
              <HeaderNavButtonLogIn />
            </SheetClose>
          </div>
          <div v-if="user?.role == 'authenticated'" class="flex justify-center gap-4">
            <SheetClose>
              <HeaderAvatar />
            </SheetClose>
            <SheetClose>
              <HeaderNavButtonLogOut />
            </SheetClose>
          </div>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>
