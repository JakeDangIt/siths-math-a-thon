// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: [
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@formkit/auto-animate",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@nuxtjs/sanity",
  ],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/math-a-thon-icon.webp" },
      ],
    },
  },
  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/",
      include: ["/auth/profile"],
      exclude: [],
    },
  },
  sanity: {
    projectId: "ferer2d9",
    dataset: "production",
  },
});