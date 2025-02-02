<template>
  <div
    class="flex h-screen items-center justify-center bg-gradient-to-r from-theme-red to-theme-blue p-4"
  >
    <div class="w-full max-w-2xl rounded-lg bg-white p-8 text-center shadow-xl">
      <div class="mb-8">
        <h1 class="mb-4 text-6xl font-bold text-gray-800">404</h1>
      </div>

      <h2 class="mb-4 text-2xl font-semibold text-gray-700">Page Not Found</h2>
      <p class="mb-8 text-gray-600">
        Oops! It seems like you've ventured into unknown mathematical territory.
        Let's get you back to solving some real problems!
      </p>

      <div class="flex flex-col justify-center gap-4 sm:flex-row">
        <NuxtLink
          to="/"
          class="rounded-lg bg-gradient-to-r from-theme-red to-theme-blue px-6 py-3 text-white transition-opacity hover:opacity-90"
        >
          Return Home
        </NuxtLink>
        <NuxtLink
          to="/questions"
          class="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
        >
          View Questions
        </NuxtLink>
      </div>

      <div class="mt-12">
        <p class="text-sm text-gray-500">
          Need help? Contact the Math-a-Thon team
        </p>
      </div>
    </div>
  </div>
</template>
