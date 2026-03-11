export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/seo'
  ],
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'wandermap-color-mode'
  },
  i18n: {
    locales: [
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'ru',
    langDir: 'locales',
    strategy: 'prefix_except_default'
  },
  site: {
    url: 'https://wandermap.ru', // будущий домен
    name: 'WanderMap',
  },
  sitemap: {
    sources: [
      '/api/__sitemap__/urls',
    ],
    exclude: [
      '/admin/**',
    ],
  },
  robots: {
    disallow: ['/admin'],
  },
})

