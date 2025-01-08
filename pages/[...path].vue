<template>
  <div class="h-full flex items-center justify-center bg-gradient-to-r from-theme-red to-theme-blue p-4">
    <div class="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
      <div class="mb-8">
        <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
      </div>

      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p class="text-gray-600 mb-8">
        Oops! It seems like you've ventured into unknown mathematical territory.
        Let's get you back to solving some real problems!
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/"
          class="px-6 py-3 bg-gradient-to-r from-theme-red to-theme-blue text-white rounded-lg hover:opacity-90 transition-opacity">
          Return Home
        </NuxtLink>
        <NuxtLink to="/questions"
          class="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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