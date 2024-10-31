// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxtjs/sanity',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@formkit/auto-animate',
    '@pinia/nuxt',
  ],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/math-a-thon-icon.webp' },
      ],
      htmlAttrs: {
        lang: 'en',
      },
      script: [
        {
          src: '/mathjax/es5/tex-chtml.js',
          async: true,
        },
      ],
    },
  },
  icon: {
    serverBundle: {
      collections: ['material-symbols'], // <!--- this
    },
    clientBundle: {
      // list of icons to include in the client bundle
      icons: [
        'material-symbols:copyright-outline',
        'material-symbols:arrow-drop-down',
        'material-symbols:trophy',
        'material-symbols:workspace-premium-outline',
        'material-symbols:add',
        'material-symbols:arrow-downward',
        'material-symbols:arrow-upward',
        'material-symbols:cancel-outline',
        'material-symbols:home',
        'material-symbols:library-books-outline',
        'material-symbols:leaderboard',
        'material-symbols:group',
        'material-symbols:mail',
        'material-symbols:folder',
        'material-symbols:edit',
      ],
    },
  },
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/',
      include: ['/auth/profile'],
      exclude: [],
    },
  },
  runtimeConfig: {
    sanity: {
      token: process.env.SANITY_TOKEN,
      projectId: 'ferer2d9',
      dataset: 'production',
      useCdn: true,
    },
    public: {
      sanity: {
        projectId: 'ferer2d9',
        dataset: 'production',
        useCdn: true,
      },
    },
    sanityToken: process.env.SANITY_TOKEN,
  },
});
